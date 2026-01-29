import { mount } from '@vue/test-utils'
import Toggle from '../admin/Toggle.vue'

describe('Toggle.vue', () => {
    it('emits the new value when clicked', async () => {
      const wrapper = mount(Toggle, {
        props: {
          modelValue: false,
        },
      })
  
      await wrapper.trigger('click')
  
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
    })
  })
  