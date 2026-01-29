<script>
import DropDown from "./DropDown.vue";
import Toggle from "./Toggle.vue";

export default {
  emits: ["save"],
  components: {
    DropDown,
    Toggle,
  },
  data() {
    return {
      show: false,
      defaults: {
        status: true,
        id: "",
        company: "",
        analytics: true,
        max_tickers: 0,
        unpermissioned: "block",
        cmbs: true,
        vehicles: true,
        trucks: true,
        transactions: true,
        weather: true,
        explorer: true,
        dashboard: false,
        tokens: 0,
        reports: true,
      },
      formData: {},

      unpermissionedOptions: [
        { value: "block", label: "Block" },
        { value: "delay_6", label: "Delay 6 months" },
        { value: "delay_12", label: "Delay 12 months" },
      ],
    };
  },
  methods: {
    closeForm() {
      this.show = false;
    },
    incrementTokens() {
      this.formData.tokens = Number(this.formData.tokens) || 0; // I tried to make this always a number so that it would not give NaN
      this.formData.tokens += 100;
    },
    saveAccount() {
      const isNew = !this.formData.id;
      const account = { ...this.formData };

      account.disabled = !account.status;

      const boolFields = [
        "analytics",
        "cmbs",
        "vehicles",
        "trucks",
        "transactions",
        "weather",
        "explorer",
        "dashboard",
        "reports",
      ];

      boolFields.forEach((key) => {
        account[key] = account[key] ? 1 : 0;
      });

      this.$emit("save", account);
      this.closeForm();
    },

    showForm(account) {
      this.show = true;
      this.formData = account ? { ...account } : { ...this.defaults };
      this.formData.unpermissioned = this.formData.unpermissioned || "block";
    },
  },
};
</script>

<template>
  <div v-if="show" class="dialog">
    <!-- Dark overlay -->
    <div
      class="dialog-overlay fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
      @click="closeForm"
    ></div>

    <!-- Content centered -->
    <div
      class="dialog-content fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold">ACCOUNTS</h3>
        <div class="flex items-center gap-4 text-sm text-gray-700">
          <span
            class="px-3 py-2 bg-gray-100 text-gray-400 rounded-md border border-gray-200"
          >
            ID: {{ formData.id }}
          </span>
          <Toggle v-model="formData.status" />
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="saveAccount" class="space-y-6">
        <!-- Name -->
        <div>
          <input
            type="text"
            v-model="formData.company"
            placeholder="Name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-orange-200"
          />
        </div>
        <!-- Analytics title + toggle -->
        <div class="flex items-center gap-2 mb-3">
          <Toggle v-model="formData.analytics" class="scale-75" />
          <h3 class="text-lg font-semibold">Analytics</h3>
        </div>

        <!-- Max Tickers + Unpermissioned -->
        <div class="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
          <div class="relative">
            <label class="text-xs text-gray-400 font-semibold">
              Max Tickers
            </label>
            <input
              type="number"
              class="flex-1 px-3 py-2 ml-4 border border-gray-300 rounded-md shadow-sm text-sm placeholder-gray-400"
              v-model="formData.max_tickers"
              :disabled="!formData.analytics"
              placeholder="Max Tickers"
            />
          </div>

          <div class="flex items-center gap-2">
            <label class="text-xs text-gray-400 font-semibold">
              Unpermissioned
            </label>
            <DropDown
              :disabled="!formData.analytics"
              :options="unpermissionedOptions"
              v-model="formData.unpermissioned"
            />
          </div>
        </div>

        <!-- All checkboxes -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="formData.cmbs"
              :disabled="!formData.analytics"
              class="form-checkbox"
            />
            <span class="text-sm font-medium text-gray-700">CMBS</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="formData.vehicles"
              :disabled="!formData.analytics"
              class="form-checkbox"
            />
            <span class="text-sm font-medium text-gray-700">Vehicles</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="formData.trucks"
              :disabled="!formData.analytics"
              class="form-checkbox"
            />
            <span class="text-sm font-medium text-gray-700">Trucks</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="formData.weather"
              :disabled="!formData.analytics"
              class="form-checkbox"
            />
            <span class="text-sm font-medium text-gray-700">Weather</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="formData.transactions"
              :disabled="!formData.analytics"
              class="form-checkbox"
            />
            <span class="text-sm font-medium text-gray-700">Transactions</span>
          </label>
        </div>

        <!-- Explorer -->
        <div class="border-t border-gray-200 pt-4">
          <div class="flex items-center gap-2 mb-2">
            <Toggle v-model="formData.explorer" class="scale-75" />
            <h3 class="text-lg font-semibold">Explorer</h3>
          </div>

          <div
            :class="[
              'grid grid-cols-3 gap-4 transition-opacity',
              !formData.explorer ? 'opacity-50 pointer-events-none' : '',
            ]"
          >
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="formData.dashboard"
                class="form-checkbox"
              />
              <span class="text-sm font-medium text-gray-700">Dashboard</span>
            </label>

            <div class="flex items-center space-x-2">
              <input
                type="number"
                v-model="formData.tokens"
                placeholder="Tokens"
                class="w-24 px-3 py-2 border border-gray-300 rounded shadow-sm placeholder-gray-500 text-sm"
              />
              <button
                type="button"
                @click="incrementTokens"
                class="bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded text-sm"
              >
                +100
              </button>
            </div>
          </div>
        </div>
        <!-- Reports -->
        <div class="border-t border-gray-200 pt-4">
          <div class="flex items-center gap-2 mb-2">
            <Toggle v-model="formData.reports" class="scale-75" />
            <h3 class="text-lg font-semibold">Reports</h3>
          </div>

          <div
            :class="[
              'transition-opacity',
              !formData.reports ? 'opacity-50 pointer-events-none' : '',
            ]"
          ></div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="closeForm"
            class="border border-orange-500 text-orange-500 px-4 py-2 rounded hover:bg-orange-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="border border-purple-500 text-purple-600 px-4 py-2 rounded hover:bg-purple-50"
          >
            OK
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
