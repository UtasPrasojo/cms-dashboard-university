<template>
  <div :class="['flex flex-col', label ? 'gap-1' : '', styles.datepickerWrapper, classContainer, iconPosition === 'right' ? styles.iconRight : '', inputClass ? styles.customInputBg : '', inputClass]">
    <label v-if="label != null" :for="name" :class="['text-xs md:text-sm text-text-500 font-medium', labelClass]">
      {{ label }}<span v-if="required" class="text-red-600">*</span>
      <span class="text-primary-500 font-semibold" v-if="title_desc">&nbsp;{{ title_desc ?? '' }} </span>
    </label>
    <p class="mb-2 text-sm text-base-black" v-if="description"> {{ description }} </p>
    <VueDatePicker :uid="dpUid" :id="name" :teleport="true" :style="iconStyles"
      ref="datepicker" :clearable="false" v-bind="filteredAttrs" locale="id" :format="customFormat"
      :model-value="modelValue" :flow="dynamicFlow" @update:model-value="handleUpdateModelValue"
      @flow-step="onFlowStep" :enable-time-picker="false" :auto-apply="autoApply" @date-update="handleDateSelect"
      @update-month-year="handleMonthYear" @closed="onMenuClosed" :placeholder="placeholder" :required="required"
      :month-change-on-scroll="false">
      <template v-if="!isMultiCalendars()" #menu-header>
        <div class="flex justify-between items-center px-4 pt-2">
          <button type="button" @click="openYearPicker" class="flex flex-row gap-1 items-center">
            <div class="font-semibold text-base text-text-600">{{ displayMonth }} {{ displayYear }}</div>
            <i :class="[yearOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line']"></i>
          </button>
          <div v-if="currentView == 'calendar'" class="flex flex-row items-center">
            <button type="button" class="p-1 h-fit rounded-full hover:bg-gray-100" @click="goPrevMonth">
              <i class="ri-arrow-left-s-line text-xl !leading-none !tracking-none text-gray-400"></i>
            </button>
            <button type="button" class="p-1 rounded-full hover:bg-gray-100" @click="goNextMonth">
              <i class="ri-arrow-right-s-line text-xl !leading-none !tracking-none text-gray-400"></i>
            </button>
          </div>
        </div>
      </template>
      <template #calendar-header="{ index, day }">
        <div>
          {{ day[0] }}
        </div>
      </template>
      <template v-if="reset" #action-extra>
        <div class="flex justify-start gap-2 p-2 !pt-0">
          <button type="button" class="pl-2 text-xs !leading-[18px] !font-semibold text-primary-500"
            @click="clearDate">
            Reset
          </button>
        </div>
      </template>
      <template #input-icon>
        <i v-if="!hideIcon" :class="[iconPosition === 'right' ? '' : 'ml-3', 'fi fi-rr-calendar-lines text-gray-500']"></i>
      </template>
    </VueDatePicker>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    label: { type: String, default: null },
    labelClass: { type: [String, Array], default: '' },
    modelValue: { type: [String, Array, Date, Object], default: null },
    title_desc: { type: String, default: null },
    description: { type: String, default: null },
    reset: { type: Boolean, default: false },
    formatPreview: { type: String, default: 'DD/MM/YYYY' },
    hideIcon: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Pilih Tanggal' },
    name: { type: String, default: 'Tanggal' },
    required: { type: Boolean, default: false },
    autoApply: { type: Boolean, default: true },
    resetValue: { type: [String, Date, Array], default: null },
    classContainer: { type: [String, Array], default: '' },
    inputClass: { type: [String, Array], default: '' },
    iconPosition: { type: String, default: 'left', validator: v => ['left', 'right'].includes(v) },
    outputFormat: { type: String, default: null },
  },

  data() {
    return {
      currentView: this.isMonthPicker() ? 'month' : 'calendar',
      currentMonth: null,
      currentYear: null,
      dynamicFlow: this.isMultiCalendars() ? undefined : (this.isMonthPicker() ? ['month'] : ['calendar']),
      yearOpen: false,
      closingAfterSelect: false,
      monthNamesShort: [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
      ],
    };
  },

  computed: {
    initialDateSource() {
      if (this.modelValue) {
        return this.modelValue;
      }
      if (this.$attrs.startDate || this.$attrs['start-date']) {
        return this.$attrs.startDate || this.$attrs['start-date'];
      }
      return null;
    },
    displayMonth() {
      if (this.currentMonth === null) return '';
      return this.monthNamesShort[this.currentMonth];
    },
    displayYear() {
      return this.currentYear;
    },
    iconStyles() {
      if (this.hideIcon) return { '--dp-padding-left': '12px' };
      if (this.iconPosition === 'right') return { '--dp-padding-left': '12px', '--dp-padding-right': '34px' };
      return { '--dp-padding-left': '34px' };
    },
    dpUid() {
      return this.isMultiCalendars() ? 'dashboard-multi' : 'dashboard';
    },
    filteredAttrs() {
      const { modelValue, ...rest } = this.$attrs;
      if (Object.prototype.hasOwnProperty.call(rest, 'modelValue')) {
        delete rest.modelValue;
      }
      return rest;
    }
  },

  methods: {
    isMonthPicker() {
      return Object.prototype.hasOwnProperty.call(this.$attrs, 'monthPicker');
    },
    defaultFlow() {
      if (this.isMultiCalendars()) return undefined;
      if (Object.prototype.hasOwnProperty.call(this.$attrs, 'monthPicker')) {
        return ['month'];
      }
      return ['calendar'];
    },
    isMultiCalendars() {
      return !!this.$attrs.multiCalendars || !!this.$attrs['multi-calendars'];
    },
    defaultView() {
      if (Object.prototype.hasOwnProperty.call(this.$attrs, 'monthPicker')) {
        return 'month';
      }
      return 'calendar';
    },
    handleUpdateModelValue(value) {
      // After year-picker flow, closeMenu() emits null — ignore it so
      // the value committed by handleDateSelect is not overwritten.
      // The flag stays active until onMenuClosed clears it, because
      // closeMenu + dynamicFlow reset can produce multiple null emissions.
      if (this.closingAfterSelect && (value == null || value === '')) {
        return;
      }
      if (!this.outputFormat || value == null || value === '') {
        this.$emit('update:modelValue', value);
        return;
      }
      if (Array.isArray(value)) {
        this.$emit('update:modelValue', value.map(v => v ? this.$dateFormat(v, this.outputFormat) : v));
        return;
      }
      if (typeof value === 'object' && value.month !== undefined && value.year !== undefined) {
        this.$emit('update:modelValue', value);
        return;
      }
      this.$emit('update:modelValue', this.$dateFormat(value, this.outputFormat));
    },
    handleDateSelect(date) {
      if (Object.prototype.hasOwnProperty.call(this.$attrs, 'range')) {
        return;
      }
      if (!date) return;

      const d = new Date(date);
      this.currentMonth = d.getMonth();
      this.currentYear = d.getFullYear();

      // Only intervene when the year-picker flow was used. In that case
      // autoApply won't close the menu because the flow prop is still active.
      if (!this.pendingFlowReset) return;

      // Emit the value ourselves since autoApply doesn't close the menu
      // when the flow prop is active.
      this.$emit('update:modelValue', this.outputFormat ? this.$dateFormat(date, this.outputFormat) : date);
      // Guard against null emissions triggered by closing.
      this.closingAfterSelect = true;
      // Simulate an outside click to naturally dismiss the popup.
      // This avoids closeMenu() which clears VueDatePicker's internal value.
      this.$nextTick(() => {
        document.body.click();
      });
    },
    handleMonthYear({ instance, month, year }) {
      if (!this.isInitialized) return;
      this.currentYear = year;
      this.currentMonth = month;
    },
    clearDate() {
      const hasVal = this.resetValue;
      if (!hasVal) {
        this.$refs.datepicker.clearValue();
        this.$emit('update:modelValue', '');
        return;
      }
      const toDate = x => (x instanceof Date ? x : new Date(x));
      if (Array.isArray(hasVal)) {
        const [start, end] = hasVal.map(toDate);
        this.$emit('update:modelValue', this.outputFormat ? [
          this.$dateFormat(start, this.outputFormat),
          this.$dateFormat(end, this.outputFormat),
        ] : [start, end]);
        this.currentMonth = start.getMonth();
        this.currentYear = start.getFullYear();
      } else {
        const d = toDate(hasVal);
        this.$emit('update:modelValue', this.outputFormat ? this.$dateFormat(d, this.outputFormat) : d);
        this.currentMonth = d.getMonth();
        this.currentYear = d.getFullYear();
      }
      this.$nextTick(() => this.updateMonthYear());
      this.dynamicFlow = this.defaultFlow();
      this.yearOpen = false;
      this.$refs.datepicker.closeMenu();
    },
    openYearPicker() {
      // Clear any pending reset so @closed from the intermediate close
      // doesn't overwrite the flow we're about to set.
      this.pendingFlowReset = false;
      if (!this.yearOpen) {
        this.yearOpen = true;
        this.$refs.datepicker.closeMenu();
        this.dynamicFlow = ['year', 'month', 'calendar'];
        this.currentView = 'year';

        this.$nextTick(() => {
          this.$refs.datepicker.openMenu();
          this.$refs.datepicker.handleFlow(0);
        });
      } else {
        this.yearOpen = false;
        this.dynamicFlow = [];
        this.$refs.datepicker.closeMenu();
        this.currentView = this.defaultView();

        this.$nextTick(() => {
          this.dynamicFlow = this.defaultFlow();
          this.$refs.datepicker.openMenu();
          this.$refs.datepicker.handleFlow(0);
        });
      }
    },
    onFlowStep(step) {
      this.currentView = this.dynamicFlow?.[step] ?? this.defaultView();
      // Only set pendingFlowReset when the year-picker flow (multi-step) reaches
      // its last step. For the default single-step flow (['calendar']), do nothing.
      if (this.dynamicFlow && this.dynamicFlow.length > 1 && step >= this.dynamicFlow.length - 1) {
        this.yearOpen = false;
        this.currentView = this.defaultView();
        // Don't reset dynamicFlow here — changing the :flow prop while the menu
        // is open causes VueDatePicker to restart the flow, which makes the user
        // have to pick the date twice. The reset is deferred to onMenuClosed.
        this.pendingFlowReset = true;
      }
    },
    onMenuClosed() {
      this.currentView = this.defaultView();
      this.yearOpen = false;
      if (this.pendingFlowReset) {
        this.dynamicFlow = this.defaultFlow();
        this.pendingFlowReset = false;
        // Clear the guard after flow reset settles, so late null emissions
        // from VueDatePicker reacting to the dynamicFlow change are blocked.
        this.$nextTick(() => { this.closingAfterSelect = false; });
      }
    },
    goPrevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.updateMonthYear();
    },
    goNextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.updateMonthYear();
    },
    updateMonthYear() {
      if (this.$refs.datepicker) {
        this.$refs.datepicker.setMonthYear({
          month: this.currentMonth,
          year: this.currentYear
        });
      }
    },
    customFormat(date) {
      if (Array.isArray(date)) {
        if (date[0] && date[1]) {
          const startDate = new Date(date[0]);
          const endDate = new Date(date[1]);
          const sameYear = startDate.getFullYear() === endDate.getFullYear();
          const startFormat = sameYear ? this.formatPreview.replace(/[\s/\-.,]*Y{2,4}/i, '') : this.formatPreview;
          const start = this.$dateFormat(date[0], startFormat);
          const end = this.$dateFormat(date[1], this.formatPreview);
          return start + ' - ' + end;
        }
        return date[0] ? this.$dateFormat(date[0], this.formatPreview) : '';
      }
      return date ? this.$dateFormat(date, this.formatPreview) : "";
    }
  },

  watch: {
    initialDateSource: {
      handler(source) {
        this.isInitialized = false;
        let initialDate = null;
        if (source && typeof source === 'object' && source.month !== undefined && source.year !== undefined) {
          initialDate = new Date(source.year, source.month);
        }
        else if (Array.isArray(source) && source[0]) {
          initialDate = new Date(source[0]);
        } else if (source && !Array.isArray(source)) {
          initialDate = new Date(source);
        }

        if (initialDate && !isNaN(initialDate.getTime())) {
          this.currentMonth = initialDate.getMonth();
          this.currentYear = initialDate.getFullYear();
        } else {
          const today = new Date();
          this.currentMonth = today.getMonth();
          this.currentYear = today.getFullYear();
        }
        this.$nextTick(() => {
          this.updateMonthYear();
          this.isInitialized = true;
        });
      },
      immediate: true
    }
  },
};
</script>

<style module="styles">
.datepickerWrapper :global(.dp__theme_light) {
  font-family: 'Plus Jakarta Sans';
  --dp-border-radius: 8px;
  --dp-font-size: 14px;
  --dp-button-height: 10px;
  --dp-input-padding: 8px 0px 8px var(--dp-padding-left, 34px);
}

.customInputBg :global(.dp__input) {
  background-color: inherit !important;
}

.datepickerWrapper :global(.dp__input) {
  font-family: 'Plus Jakarta Sans';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  background-color: #F9FBFE;
  border: 1px solid #d1d5db;
  padding: 8px var(--dp-padding-right, 0px) 8px var(--dp-padding-left, 34px);
  transition: border-color 0.2s ease;
}

.iconRight :global(.dp__input_icon) {
  left: auto;
  right: 12px;
  top: 42%;
  transform: translateY(-50%);
  font-size: 14px;
  width: 14px;
  height: 14px;
}

.datepickerWrapper :global(.dp__input:focus),
.datepickerWrapper :global(.dp__input_focus) {
  background-color: #E0D8F5;
  border-color: #663BCB;
  outline: 1px solid #663BCB;
}

/* =========================
   SCROLLBARS
   ========================= */
:global([id^="dp-menu-dashboard"]) :global(.dp__container_block) {
  scrollbar-width: thin;
  scrollbar-color: #663BCB #eeeeee;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__container_block::-webkit-scrollbar) {
  width: 6px;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__container_block::-webkit-scrollbar-thumb) {
  background-color: #663BCB;
  border-radius: 4px;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__container_block::-webkit-scrollbar-track) {
  background-color: #eeeeee;
}

/* =========================
   OVERLAY PICKERS (Month/Year)
   ========================= */
:global([id^="dp-menu-dashboard"]) :global(.dp__overlay_cell:hover) {
  background-color: #8562D5;
  border-radius: 50px;
  cursor: pointer;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__overlay_cell_active) {
  background-color: #663BCB;
  border-radius: 50px;
}

/* Month picker range: highlight months between start and end */
:global([id^="dp-menu-dashboard"]) :global(.dp__overlay_cell.dp__cell_in_between) {
  background-color: #E0D8F5;
  color: #303030;
  border-radius: 0;
}

/* =========================
   CALENDAR HEADER
   ========================= */
:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_header_item) {
  font-weight: normal !important;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_header_separator) {
  display: none !important;
}

/* =========================
   BASE DAY CELLS
   ========================= */
:global([id^="dp-menu-dashboard"]) :global(.dp__cell_inner) {
  box-shadow: none !important;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__active_date) {
  background-color: #663BCB;
  color: #fff;
  border-radius: 50%;
  font-weight: bold;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__today) {
  border: 1px solid #B4B3B5;
  border-radius: 50%;
}

/* Today di tengah range (biar bisa diberi treatment lain jika perlu) */
:global([id^="dp-menu-dashboard"]) :global(.dp__cell_inner.dp__today.dp__range_between) {
  position: relative;
  border-radius: 0;
}

/* =========================
   SELECTED RANGE (aktif)
   ========================= */
:global([id^="dp-menu-dashboard"]) :global(.dp__range_between) {
  background-color: #E0D8F5;
  color: #fff;
  border-radius: 0;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__range_start),
:global([id^="dp-menu-dashboard"]) :global(.dp__range_end) {
  background-color: #663BCB;
  color: #fff;
  border-radius: 50%;
  font-weight: bold;
}

/* Shaping bar range saat start/end */
:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:has(.dp__range_start)) {
  background-color: #E0D8F5;
  border-radius: 50% 0 0 50%;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:has(.dp__range_end)) {
  background-color: #E0D8F5;
  border-radius: 0 50% 50% 0;
}

/* Hover efek default (di luar auto-range) */
:global([id^="dp-menu-dashboard"]) :global(.dp__range_start)~:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:hover),
:global([id^="dp-menu-dashboard"]) :global(.dp__range_start)~:global([id^="dp-menu-dashboard"]) :global(.dp__date_hover:hover) {
  background-color: #E0D8F5;
  border-radius: 50% 0 0 50%;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__range_end)~:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:hover),
:global([id^="dp-menu-dashboard"]) :global(.dp__range_end)~:global([id^="dp-menu-dashboard"]) :global(.dp__date_hover:hover) {
  background-color: #E0D8F5;
  border-radius: 0 50% 50% 0;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:hover) {
  background-color: #E0D8F5;
  border-radius: 50%;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__date_hover) {
  background-color: #fff;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__date_hover:hover) {
  background-color: #E0D8F5;
  border-radius: 50%;
}

/* Jangan hapus border pada future+range (agar dashed auto-range tetap muncul) */
:global([id^="dp-menu-dashboard"]) :global(.dp__cell_inner.dp__pointer.dp--future.dp__range_between) {
  padding: 0px !important;
  margin: 0px !important;
}

/* =========================
   AUTO-RANGE PREVIEW (hover) — dashed
   ========================= */
:global([id^="dp-menu-dashboard"]) :global(.dp__cell_auto_range),
:global([id^="dp-menu-dashboard"]) :global(.dp_cell_auto_range) {
  color: #303030 !important;
  background: transparent !important;
  border-top: 0.2px dashed #663BCB !important;
  border-bottom: 0.2px dashed #663BCB !important;
  border-radius: 0 !important;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__cell_auto_range_start),
:global([id^="dp-menu-dashboard"]) :global(.dp_cell_auto_range_start) {
  color: #303030 !important;
  background: transparent !important;
  border: 0.2px dashed #663BCB !important;
  border-radius: 9999px 0 0 9999px !important;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__cell_auto_range_end),
:global([id^="dp-menu-dashboard"]) :global(.dp_cell_auto_range_end) {
  color: #303030 !important;
  background: transparent !important;
  border: 0.2px dashed #663BCB !important;
  border-radius: 0 9999px 9999px 0 !important;
}

/* Safeguard: kalau auto-range overlap dengan range aktif, tetap tampil */
:global([id^="dp-menu-dashboard"]) :global(.dp__cell_inner.dp__range_between.dp__cell_auto_range) {
  border-top: 0.2px dashed #663BCB !important;
  border-bottom: 0.2px dashed #663BCB !important;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__cell_inner.dp__range_between.dp__cell_auto_range_start) {
  border: 0.2px dashed #663BCB !important;
  border-radius: 9999px 0 0 9999px !important;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__cell_inner.dp__range_between.dp__cell_auto_range_end) {
  border: 0.2px dashed #663BCB !important;
  border-radius: 0 9999px 9999px 0 !important;
}

/* Wrapper radius untuk bentuk pill auto-range */
:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:has(.dp__cell_auto_range)),
:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:has(.dp_cell_auto_range)) {
  position: relative;
  background: transparent;
  border-radius: 0 !important;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:has(.dp__cell_auto_range_start)),
:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:has(.dp_cell_auto_range_start)) {
  border-radius: 9999px 0 0 9999px !important;
}

:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:has(.dp__cell_auto_range_end)),
:global([id^="dp-menu-dashboard"]) :global(.dp__calendar_item:has(.dp_cell_auto_range_end)) {
  border-radius: 0 9999px 9999px 0 !important;
}

/* =========================
   HIDE BUILT-IN PARTS (pakai header custom)
   ========================= */
:global([id^="dp-menu-dashboard"]) :global(.dp__month_year_select),
:global([id^="dp-menu-dashboard"]) :global(.dp__btn.dp--arrow-btn-nav),
:global([id^="dp-menu-dashboard"]) :global(.dp__action_row),
:global([id^="dp-menu-dashboard"]) :global(.dp__btn.dp__button.dp__overlay_action.dp__button_bottom) {
  display: none !important;
}

/* =========================
   MULTI-CALENDARS: show built-in nav
   ========================= */
:global(#dp-menu-dashboard-multi) :global(.dp__month_year_select),
:global(#dp-menu-dashboard-multi) :global(.dp__btn.dp--arrow-btn-nav) {
  display: inline-flex !important;
}
</style>