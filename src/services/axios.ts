import { useAuthStore } from '@/stores/auth.store.js';
import { useHelperStore } from '@/stores/helper.store.js';
import { useAlertStore, AlertType } from '@/stores/alert.store.js';
import axios from 'axios';
import router from '@/router/index.js';


type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface ApiError {
  response?: {
    data: { status?: number; message?: string; errors?: Array<{ message: string }> };
    status: number;
  };
  code?: string;
  message: string;
}

export const axiosWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
};

function request(method: HttpMethod) {
  return (
    url: string, 
    body?: unknown, 
    notification: boolean = false, 
    contentType: string = 'application/json', 
    delay: number = 0, 
    withLoading: boolean = false
  ) => {
    const helper = useHelperStore()
    const alertStore = useAlertStore();
    switch (withLoading) {
      case true:
        helper.activate()
        break;
      case null:
        break;
      default:
        helper.onFetch = true
        break;
    }
    alertStore.network_status = true

    const requestOptions: {
      url: string;
      method: HttpMethod;
      headers: Record<string, string>;
      data?: unknown;
    } = {
      url,
      method,
      headers: authHeader(url),
    };

    if (body) {
      if (contentType == 'application/json') {
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.data = JSON.stringify(body);
      } else {
        requestOptions.headers['Content-Type'] = contentType;
        requestOptions.data = body;
      }
    }

    return axios(requestOptions)
      .then((response) => {
        if(withLoading) {
          helper.deactivate()
        } else {
          setTimeout((() => {
            helper.onFetch = false
          }), 150)
          helper.status_mini = false
        }

        if(notification){
          setTimeout((() => {
            alertStore.activate(AlertType.SUCCESS, response.data.message , 2000);
          }), delay)
          
        }

        response.data.status = response.status;
        
        if(response.data.status != 422 && method != 'GET') helper.form_error = []
        return response.data

      }, (error) => {
        if(withLoading) {
          helper.deactivate()
        } else {
          setTimeout((() => {
            helper.onFetch = false
          }), 150)
          helper.status_mini = false
        }
        return errorHandler(error);
      });
  };
}

function authHeader(url: string): Record<string, string> {
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.token;
  const isApiUrl = url.startsWith(import.meta.env.VITE_BASE_URL);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}

function errorHandler(error: ApiError) {
  const alertStore = useAlertStore();
  const helper = useHelperStore()
  helper.deactivate()

  const response = error.code === "ERR_NETWORK"
    ? { data: { status: 500, message: 'Tidak dapat terhubung ke jaringan' }, status: 500 }
    : error.response ?? { data: { status: 500, message: error.message }, status: 500 }

  const data = response.data
  const { user, logout } = useAuthStore();

  let message = ''

  if ([401, 402].includes(response.status) && user) {
    logout();
  } else if ([403].includes(response.status)) {
    router.push('/forbidden')
  } else if ([422].includes(response.status)) {
    helper.form_error = data.errors ?? []

    const errors = data.errors ?? []
    errors.forEach((element: { message: string }, index: number) => {
      message += index < errors.length - 1
        ? element.message + ', '
        : element.message
    });
  } else {
    message = data.message ?? error.message
  }
  alertStore.activate(AlertType.ERROR, message, 2000);

  return response;
}




