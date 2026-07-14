import axios, {
  type Method,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/auth.store";
import { useHelperStore } from "@/stores/helper.store";
import { useAlertStore, AlertType } from "@/stores/alert.store";
import { useLocaleStore } from "@/stores/locale.store";

axios.defaults.baseURL = import.meta.env.VITE_API_ASSESSMENT_URL;
axios.defaults.timeout = 30000;

type HttpMethod = Method;

// ✅ Generic function type
type RequestFn = <T = unknown>(
  url: string,
  body?: unknown,
  notification?: boolean,
  contentType?: string,
  delay?: number,
  withLoading?: boolean | null,
) => Promise<T>;

interface NetworkErrorResponse {
  data: {
    status: number;
    message?: string;
    errors?: ValidationErrorItem[];
  };
  status: number;
}

interface ValidationErrorItem {
  message: string;
  field?: string;
}

export const axiosWrapper: {
  get: RequestFn;
  post: RequestFn;
  put: RequestFn;
  patch: RequestFn;
  delete: RequestFn;
} = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  patch: request("PATCH"),
  delete: request("DELETE"),
};

// ✅ FIX: generic di implementation
function request(method: HttpMethod): RequestFn {
  return async <T = unknown>(
    url: string,
    body?: unknown,
    notification: boolean = false,
    contentType: string = "application/json",
    delay: number = 0,
    withLoading: boolean | null = false,
  ): Promise<T> => {
    const helper = useHelperStore();
    const alertStore = useAlertStore();

    if (withLoading === true) helper.activate();
    else if (withLoading !== null) helper.onFetch = true;

    alertStore.network_status = true;

    const requestOptions: AxiosRequestConfig = {
      url: normalizeUrl(url),
      method,
      headers: {
        ...authHeader(),
        ...(body ? { "Content-Type": contentType } : {}),
      },
    };

    if (body !== undefined) {
      requestOptions.data = body;
    }

    try {
      const response: AxiosResponse = await axios(requestOptions);

      finalizeLoading(helper, withLoading);

      if (notification) {
        setTimeout(() => {
          alertStore.activate(
            AlertType.SUCCESS,
            response.data?.message,
            2000,
          );
        }, delay);
      }

      // attach status
      response.data.status = response.status;

      // ✅ cast ke generic type
      return response.data as T;
    } catch (err) {
      finalizeLoading(helper, withLoading);

      // ❗ penting: throw, jangan return
      throw errorHandler(err);
    }
  };
}

function authHeader(): Record<string, string> {
  const auth = useAuthStore();
  const locale = useLocaleStore();
  const token = auth.user?.access_token;

  const headers: Record<string, string> = {
    "x-header-language": locale.language,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// ❗ sekarang hanya untuk THROW
function errorHandler(error: unknown): NetworkErrorResponse {
  const alertStore = useAlertStore();
  const helper = useHelperStore();
  const auth = useAuthStore();

  helper.deactivate();

  let response: NetworkErrorResponse;

  if (axios.isAxiosError(error) && error.response) {
    response = {
      data: error.response.data,
      status: error.response.status,
    };
  } else {
    response = {
      data: { status: 500, message: "Network Error" },
      status: 500,
    };
  }

  const { status, data } = response;

  if ([401, 402].includes(status)) {
    console.warn("[Axios] Unauthorized");

    auth.logout();
    return response;
  }

  if (status === 403) {
    router.push("/forbidden");
    return response;
  }

  if (status === 422 && Array.isArray(data.errors)) {
    helper.form_error = data.errors;
  } else {
    alertStore.activate(
      AlertType.ERROR,
      data.message || "Unknown error",
      2000,
    );
  }

  return response;
}

function normalizeUrl(url: string): string {
  if (url.startsWith("http")) return url;
  if (!url.startsWith("/")) return `/${url}`;
  return url;
}

function finalizeLoading(
  helper: ReturnType<typeof useHelperStore>,
  withLoading?: boolean | null,
): void {
  if (withLoading) helper.deactivate();
  else {
    setTimeout(() => (helper.onFetch = false), 150);
    helper.status_mini = false;
  }
}