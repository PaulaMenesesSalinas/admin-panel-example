import { mount } from '@vue/test-utils'
import DataTable from '../admin/DataTable.vue'

describe('DataTable.vue', () => {
  // Mock props for testing
  const columns = [
    { name: 'ID', key: 'id' },
    { name: 'Company', key: 'company' },
    { name: 'Analytics', key: 'analytics' },
  ]

  const data = [
    { id: 1, company: 'TestCo', analytics: true, status: true },
    { id: 2, company: 'OtherCo', analytics: false, status: false },
  ]

  const selectedId = 1

  // Verifies that column headers are rendered based on props
  it('renders column headers from props', () => {
    const wrapper = mount(DataTable, {
      props: { columns, data, selectedId }
    })

    columns.forEach((col) => {
      expect(wrapper.html()).toContain(col.name)
    })
  })

  // Verifies that data rows render correctly and classes are applied
  it('renders data rows and applies classes correctly', () => {
    const wrapper = mount(DataTable, {
      props: { columns, data, selectedId }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)

    // First row is selected
    expect(rows[0].classes()).toContain('bg-gray-300')

    // Second row has inactive style
    expect(rows[1].classes()).toContain('opacity-50')
  })

  // Tests row-click event on left click
  it('calls handleLeftClick and emits row-click on left click', async () => {
    const wrapper = mount(DataTable, {
      props: { columns, data, selectedId }
    })

    await wrapper.findAll('tbody tr')[0].trigger('click')
    expect(wrapper.emitted('row-click')).toBeTruthy()
    expect(wrapper.emitted('row-click')[0]).toEqual([data[0]])
  })

  // Tests row-right-click event on right click
  it('calls handleRightClick and emits row-right-click on right click', async () => {
    const wrapper = mount(DataTable, {
      props: { columns, data, selectedId }
    })

    const row = wrapper.findAll('tbody tr')[1]
    const mockEvent = { preventDefault: jest.fn() }

    await row.trigger('contextmenu', mockEvent)

    expect(wrapper.emitted('row-right-click')).toBeTruthy()
    expect(wrapper.emitted('row-right-click')[0]).toEqual([data[1]])
  })

  // Verifies the toBoolean method
  it('converts to boolean correctly using toBoolean()', () => {
    const wrapper = mount(DataTable, {
      props: { columns, data: [], selectedId: null }
    })

    const vm = wrapper.vm
    expect(vm.toBoolean(true)).toBe(true)
    expect(vm.toBoolean(1)).toBe(true)
    expect(vm.toBoolean("1")).toBe(true)
    expect(vm.toBoolean(false)).toBe(false)
    expect(vm.toBoolean(0)).toBe(false)
  })

  // Verifies isBooleanField returns true for known boolean keys
  it('recognizes boolean fields using isBooleanField()', () => {
    const wrapper = mount(DataTable, {
      props: { columns, data: [], selectedId: null }
    })

    const vm = wrapper.vm
    expect(vm.isBooleanField('analytics')).toBe(true)
    expect(vm.isBooleanField('cmbs')).toBe(true)
    expect(vm.isBooleanField('company')).toBe(false)
    expect(vm.isBooleanField('id')).toBe(false)
  })
})
