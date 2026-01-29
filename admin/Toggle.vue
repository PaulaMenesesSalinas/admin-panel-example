<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    isChecked() {
      return this.modelValue;
    },
  },
  methods: {
    toggle() {
      this.$emit("update:modelValue", !this.modelValue);
    },
  },
};
</script>

<template>
  <div
    :class="[
      'w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300',
      isChecked ? 'bg-orange-500' : 'bg-gray-300'
    ]"
    @click="toggle"
  >
    <div
      class="w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300"
      :class="isChecked ? 'translate-x-6' : 'translate-x-0'"
    ></div>
  </div>
</template>

  
  
  
  