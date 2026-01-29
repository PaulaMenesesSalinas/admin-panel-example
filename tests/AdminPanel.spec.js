// Fake window.location for testing
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/staging/index.php',
    hostname: 'example.com',
  },
  writable: true,
})

import { mount } from '@vue/test-utils'
import AdminPanel from '../admin/AdminPanel.vue'

describe('AdminPanel.vue', () => {
  it('renders the admin panel with search input', () => {
    const wrapper = mount(AdminPanel)

    expect(wrapper.find('input[placeholder="Search"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Admin Panel')
  })

  it('updates search value on input', async () => {
    const wrapper = mount(AdminPanel)

    const searchInput = wrapper.find('input[placeholder="Search"]')
    await searchInput.setValue('test search')

    expect(wrapper.vm.search).toBe('test search')
  })

  it('has ref to accountsTable component', () => {
    const wrapper = mount(AdminPanel)

    expect(wrapper.vm.$refs.accountsTable).toBeDefined()
  })
})
