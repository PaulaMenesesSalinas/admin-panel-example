<script>
import Toggle from "./Toggle.vue";
import DropDown from "./DropDown.vue";
import SearchableDropDown from "./SearchableDropDown.vue";

export default {
  emits: ["save", "reset-password"],
  components: {
    Toggle,
    DropDown,
    SearchableDropDown,
  },
  props: {
    accounts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      passwordDialog: false,
      generatedPassword: "",

      defaults: {
        id_user: null,
        status: true,
        account: "",
        email: "",
        first_name: "",
        last_name: "",
        profile: "",
        restricted: false,
        trial: false,
      },
      formData: {},

      profileOptions: [
        { label: "Admin", value: "admin" },
        { label: "Analytics", value: "analytics" },
        { label: "Explorer", value: "explorer" },
      ],
    };
  },
  computed: {
    accountOptions() {
      return (this.accounts || []).map((a) => ({
        label: a.company,
        value: a.id,
      }));
    },
  },
  methods: {
    closeForm() {
      this.show = false;
    },

    resetPassword() {
      const password = Math.random().toString(36).slice(-12);
      this.generatedPassword = password;
      this.passwordDialog = true;
    },

    saveUser() {
      const isNew = !this.formData.id_user;
      if (isNew) {
        const password = Math.random().toString(36).slice(-12);
        this.generatedPassword = password;
        this.passwordDialog = true;
        return;
      }
      this.$emit("save", { ...this.formData });
      this.closeForm();
    },

    showForm(user, selectedAccount = null) {
      this.show = true;
      this.formData = user ? { ...user } : { ...this.defaults };

      if (!user && selectedAccount) {
        this.formData.account = selectedAccount.id;
      }
    },

    showPasswordDialog(user) {
      this.showForm(user);
      this.resetPassword();
    },

    confirmPasswordDialog() {
      const username = this.formData.username || this.formData.email;
      this.$emit("reset-password", {
        username,
        password: this.generatedPassword,
      });

      this.passwordDialog = false;
      this.closeForm();

      if (!this.formData.id_user) {
        this.$emit("save", { ...this.formData });
        this.closeForm();
      }
    },
  },
};
</script>

<template>
  <div v-if="show" class="dialog">
    <!-- Dark overlay -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
      @click="closeForm"
    ></div>

    <!-- Content centered -->
    <div
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-xl z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold">USERS</h3>

        <div class="flex items-center gap-4">
          <button
            @click="resetPassword"
            title="Reset Password"
            class="text-orange-500 hover:text-orange-600 text-3xl"
          >
            <i class="mdi mdi-lock-reset"></i>
          </button>

          <Toggle v-model="formData.status" />
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="saveUser" class="space-y-4">
        <!-- Account Dropdown -->
        <div>
          <label class="block text-xs text-gray-400 font-semibold mb-1"
            >Account</label
          >
          <SearchableDropDown
            :disabled="false"
            :options="accountOptions"
            v-model="formData.account"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-xs text-gray-400 font-semibold mb-1"
            >Email</label
          >
          <input
            type="email"
            v-model="formData.email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm placeholder-gray-400"
          />
        </div>

        <!-- Name -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-400 font-semibold mb-1"
              >First Name</label
            >
            <input
              type="text"
              v-model="formData.first_name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm placeholder-gray-400"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-400 font-semibold mb-1"
              >Last Name</label
            >
            <input
              type="text"
              v-model="formData.last_name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm placeholder-gray-400"
            />
          </div>
        </div>

        <!-- Profile + Checkboxes -->
        <div class="flex items-end gap-6">
          <!-- Profile -->
          <div class="w-[150px]">
            <label class="block text-xs text-gray-500 font-semibold mb-1"
              >Profile</label
            >
            <DropDown v-model="formData.profile" :options="profileOptions" />
          </div>

          <!-- Checkboxes -->
          <div class="flex items-center gap-4 mt-4 self-center">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="formData.restricted"
                class="form-checkbox"
              />
              <span class="text-sm font-medium text-gray-700">Restricted</span>
            </label>

            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="formData.trial"
                class="form-checkbox"
              />
              <span class="text-sm font-medium text-gray-700">Trial</span>
            </label>
          </div>
        </div>

        <!-- Buttons -->
        <div
          class="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4"
        >
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

      <!-- Password Dialog -->
      <div
        v-if="passwordDialog"
        class="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
        >
          <h2 class="text-xl font-bold">New Password</h2>
          <input
            type="text"
            v-model="generatedPassword"
            class="w-full border px-3 py-2 rounded"
          />
          <div class="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              @click="passwordDialog = false"
              class="border border-orange-500 text-orange-500 px-4 py-2 rounded hover:bg-orange-50"
            >
              Cancel
            </button>
            <button
              @click="confirmPasswordDialog"
              class="border border-purple-500 text-purple-600 px-4 py-2 rounded hover:bg-purple-50"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
