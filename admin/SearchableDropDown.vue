<script>
export default {
  name: "SearchableDropDown",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      dropdownOpen: false,
      searchQuery: "",
    };
  },
  computed: {
    filteredOptions() {
      const query = this.searchQuery.toLowerCase();
      return this.options.filter((opt) =>
        opt.label.toLowerCase().includes(query)
      );
    },
    currentLabel() {
      const selected = this.options.find(
        (opt) => opt.value === this.modelValue
      );
      return selected ? selected.label : "";
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler() {
        if (!this.dropdownOpen) {
          this.searchQuery = this.currentLabel;
        }
      },
    },
  },
  methods: {
    onInput(e) {
      this.searchQuery = e.target.value;
      this.dropdownOpen = true;
    },
    openDropdown() {
      if (!this.disabled) {
        this.searchQuery = "";
        this.dropdownOpen = true;
      }
    },
    closeDropdown() {
      setTimeout(() => {
        this.dropdownOpen = false;
        this.searchQuery = this.currentLabel;
      }, 150);
    },
    selectOption(option) {
      this.$emit("update:modelValue", option.value);
      this.searchQuery = option.label;
      this.dropdownOpen = false;
    },
  },
};
</script>

<template>
    <div class="relative w-full">
      <input
        type="text"
        :value="searchQuery"
        :disabled="disabled"
        @input="onInput"
        @click="openDropdown"
        @blur="closeDropdown"
        placeholder="Search..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
      />
  
      <div
        v-if="dropdownOpen"
        class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-60 overflow-y-auto"
      >
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          @mousedown.prevent="selectOption(option)"
          class="px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm"
        >
          {{ option.label }}
        </div>
        <div
          v-if="filteredOptions.length === 0"
          class="px-4 py-2 text-sm text-gray-400"
        >
          No results
        </div>
      </div>
    </div>
  </template>
  
 