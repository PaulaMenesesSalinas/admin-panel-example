import { mount } from '@vue/test-utils'
import DropDown from '../admin/DropDown.vue'

describe('DropDown.vue', () => {
  const options = [
    { value: 'block', label: 'Block' },
    { value: 'delay_6', label: 'Delay 6 months' },
    { value: 'delay_12', label: 'Delay 12 months' },
  ]

  it('renders the correct label for the initial modelValue', async () => {
  const wrapper = mount(DropDown, {
    props: {
      modelValue: 'delay_6',
      options,
    }
  })

  // Wait for label to update after mount
  await wrapper.vm.$nextTick()

  // Now it should have the correct label in the input
  expect(wrapper.find('input').element.value).toBe('Delay 6 months')
})


  it('emits the selected value and closes dropdown on option click', async () => {
    const wrapper = mount(DropDown, {
      props: {
        modelValue: 'block',
        options,
      }
    })

    // Open the dropdown by clicking the input
    await wrapper.find('input').trigger('click')

    // Click the second option
    const option = wrapper.findAll('div[role="option"], div.cursor-pointer')[1]
    await option.trigger('mousedown')

    // It should emit the new value
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['delay_6'])

    // Dropdown should now be closed
    expect(wrapper.vm.dropdownOpen).toBe(false)
  })

  it('opens and closes the dropdown on input click and blur', async () => {
    const wrapper = mount(DropDown, {
      props: {
        modelValue: 'block',
        options,
      }
    })

    const input = wrapper.find('input')

    // Click to open dropdown
    await input.trigger('click')
    expect(wrapper.vm.dropdownOpen).toBe(true)

    // Blur to close (simulates user clicking outside)
    await input.trigger('blur')
    // Wait for the timeout to apply
    await new Promise(resolve => setTimeout(resolve, 160))

    expect(wrapper.vm.dropdownOpen).toBe(false)
  })

  it('does not open the dropdown if disabled', async () => {
    const wrapper = mount(DropDown, {
      props: {
        modelValue: 'block',
        options,
        disabled: true,
      }
    })

    const input = wrapper.find('input')
    await input.trigger('click')

    // The dropdown should stay closed
    expect(wrapper.vm.dropdownOpen).toBe(false)
  })
})
