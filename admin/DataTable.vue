<script>
export default {
  props: ["columns", "data", "selectedId"],
  emits: ["row-click", "row-right-click"],
  methods: {
    handleLeftClick(row) {
      this.$emit("row-click", row); // Left click = select account
    },
    handleRightClick(event, row) {
      event.preventDefault(); // Avoid the browser menu
      this.$emit("row-right-click", row); // Right click = open form
    },
    isBooleanField(key) {
      const booleanFields = [
        "analytics",
        "cmbs",
        "vehicles",
        "trucks",
        "transactions",
        "weather",
        "explorer",
        "dashboard",
        "reports",
        "status",
        "restricted",
        "restricted_apps",
        "show_all",
      ];
      return booleanFields.includes(key);
    },
    toBoolean(value) {
      return value === true || value === 1 || value === "1";
    },
  },
};
</script>

<template>
  <div class="flex-1 overflow-auto">
    <div class="overflow-y-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th
              v-for="column in columns"
              :key="column.name"
              class="px-2 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
            >
              {{ column.name }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in data"
            :key="row.id ?? row.id_user"
            @click.left="handleLeftClick(row)"
            @contextmenu="handleRightClick($event, row)"
            :class="[
            selectedId !== undefined && (row.id === selectedId || row.id_user === selectedId) ? 'bg-gray-300' : 'hover:bg-gray-50',
            'cursor-pointer transition-colors duration-150',
            !row.status ? 'opacity-50 text-gray-400' : ''
          ]"

          >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-2 py-1 whitespace-nowrap text-xs text-gray-900"
            :class="[
              isBooleanField(column.key) ? 'text-center' : 'text-left',
              (column.key === 'id' || column.key === 'id_user') ? 'w-[40px]' : ''
            ]"
          >

              <template v-if="isBooleanField(column.key)">
                <i
                  class="mdi text-lg"
                  :class="{
                    'mdi-check text-green-500': toBoolean(row[column.key]),
                    'mdi-close text-red-500': !toBoolean(row[column.key]),
                  }"
                ></i>
              </template>
              <template v-else>
                {{ row[column.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
