<script>
export default {
  name: "DropDown",
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
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      dropdownOpen: false,
      label: "",
    };
  },
  methods: {
    selectOption(option) {
      this.label = option.label;
      this.$emit("update:modelValue", option.value);
      this.dropdownOpen = false;
    },
    closeDropdown() {
      setTimeout(() => {
        this.dropdownOpen = false;
      }, 150);
    },
    updateLabel() {
      const match = this.options.find((o) => o.value === this.modelValue);
      this.label = match ? match.label : "";
    },
  },
  watch: {
    modelValue: "updateLabel",
    options: "updateLabel",
  },
  mounted() {
    this.updateLabel();
  },
};
</script>

<template>
  <div class="relative w-full">
    <input
      type="text"
      v-model="label"
      :disabled="disabled"
      readonly
      placeholder="Select..."
      @click="!disabled && (dropdownOpen = !dropdownOpen)"
      @blur="closeDropdown"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
    />

    <div
      v-if="dropdownOpen"
      class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full"
    >
      <div
        v-for="option in options"
        :key="option.value"
        @mousedown.prevent="selectOption(option)"
        class="px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>


