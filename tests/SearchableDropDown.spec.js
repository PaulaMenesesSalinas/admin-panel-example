import { mount } from '@vue/test-utils'
import SearchableDropDown from '../admin/SearchableDropDown.vue'

describe('SearchableDropDown.vue', () => {
  // Options from the actual Admin Panel profile dropdown
  const options = [
    { label: 'Admin', value: 'admin' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Explorer', value: 'explorer' },
  ]

  // Helper function to mount the component with props
  const mountComponent = (modelValue = 'analytics', disabled = false) =>
    mount(SearchableDropDown, {
      props: { options, modelValue, disabled }
    })

  // Test: initial value should match label (e.g., value 'analytics' => label 'Analytics')
  it('displays the correct label from modelValue', async () => {
    const wrapper = mountComponent('explorer')
    expect(wrapper.find('input').element.value).toBe('Explorer')
  })

  // Test: clicking the input should open the dropdown
  it('opens the dropdown when input is clicked', async () => {
    const wrapper = mountComponent()
    await wrapper.find('input').trigger('click')
    expect(wrapper.vm.dropdownOpen).toBe(true)
  })

  // Test: typing filters visible options
  it('filters options based on search query', async () => {
    const wrapper = mountComponent()
    await wrapper.find('input').setValue('analytics')
    const html = wrapper.html()
    expect(html).toContain('Analytics')
    expect(html).not.toContain('Admin')
    expect(html).not.toContain('Explorer')
  })

  // Test: selecting an option emits the correct value
  it('emits the selected value when an option is clicked', async () => {
    const wrapper = mountComponent()
    await wrapper.find('input').trigger('click')

    const option = wrapper.findAll('div.cursor-pointer').find(el =>
      el.text() === 'Admin'
    )

    await option.trigger('mousedown')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['admin'])
  })
})
