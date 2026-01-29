/*
 * Unit tests for the AccountForm.vue component
 * These tests verify that:
 * - The form opens and closes correctly
 * - The tokens value is incremented properly
 * - The save method emits the right payload
 * - The form loads default values or existing account data
 * We use stubComponents to replace child components (DropDown, Toggle)
 * since their behavior is not part of what we want to test here.
 */

import { mount } from '@vue/test-utils'
import AccountForm from '../admin/AccountForm.vue'

const stubComponents = {
  template: '<div><slot /></div>',
}

describe('AccountForm.vue', () => {
  it('closes the form when closeForm() is called', () => {
    const wrapper = mount(AccountForm, {
      global: {
        stubs: {
          DropDown: stubComponents,
          Toggle: stubComponents,
        },
      },
    })

    wrapper.vm.show = true
    wrapper.vm.closeForm()
    expect(wrapper.vm.show).toBe(false)
  })

  it('increments tokens by 100 when incrementTokens() is called', () => {
    const wrapper = mount(AccountForm, {
      global: {
        stubs: {
          DropDown: stubComponents,
          Toggle: stubComponents,
        },
      },
    })

    wrapper.vm.formData = {
      tokens: 200
    }

    wrapper.vm.incrementTokens()
    expect(wrapper.vm.formData.tokens).toBe(300)
  })

  it('emits the formatted data when saveAccount() is called', async () => {
    const wrapper = mount(AccountForm, {
      global: {
        stubs: {
          DropDown: stubComponents,
          Toggle: stubComponents,
        },
      },
    })

    wrapper.vm.showForm(null)
    wrapper.vm.saveAccount()

    expect(wrapper.emitted('save')).toBeTruthy()
    const emittedAccount = wrapper.emitted('save')[0][0]
    expect(emittedAccount.disabled).toBe(false)
    expect(emittedAccount.analytics).toBe(1)
    expect(emittedAccount.explorer).toBe(1)
    expect(emittedAccount.cmbs).toBe(1)
    expect(wrapper.vm.show).toBe(false)
  })

  it('sets show to true and loads defaults when showForm(null) is called', () => {
    const wrapper = mount(AccountForm, {
      global: {
        stubs: {
          DropDown: stubComponents,
          Toggle: stubComponents,
        },
      },
    })

    expect(wrapper.vm.show).toBe(false)
    wrapper.vm.showForm(null)

    expect(wrapper.vm.show).toBe(true)
    expect(wrapper.vm.formData.unpermissioned).toBe('block')
    expect(wrapper.vm.formData.status).toBe(true)
    expect(wrapper.vm.formData.analytics).toBe(true)
  })

  it('sets show to true and loads account data when showForm(account) is called', () => {
    const wrapper = mount(AccountForm, {
      global: {
        stubs: {
          DropDown: stubComponents,
          Toggle: stubComponents,
        },
      },
    })

    const mockAccount = {
      id: '123',
      company: 'Test Inc.',
      status: false,
      analytics: false,
      unpermissioned: 'delay_6'
    }

    wrapper.vm.showForm(mockAccount)

    expect(wrapper.vm.show).toBe(true)
    expect(wrapper.vm.formData.id).toBe('123')
    expect(wrapper.vm.formData.company).toBe('Test Inc.')
    expect(wrapper.vm.formData.unpermissioned).toBe('delay_6')
  })
})
