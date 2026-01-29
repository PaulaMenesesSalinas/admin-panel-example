Object.defineProperty(window, 'location', {
  value: { pathname: '/staging/test/test.php' },
  writable: true,
})

import { mount } from '@vue/test-utils'
import fs from 'fs'
import path from 'path'
import AccountsTable from '../admin/AccountsTable.vue'
import api from '../src/api.js'
import { defineComponent, h } from 'vue'

const stubComponents = {
  template: '<div><slot></slot></div>',
}

describe('AccountsTable.vue – mock advan', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('emits account-selected on selectAccount()', async () => {
    const wrapper = mount(AccountsTable, {
      global: { stubs: { AccountForm: stubComponents, DataTable: stubComponents } },
    })

    const account = { id: 123 }
    wrapper.vm.selectAccount(account)
    expect(wrapper.emitted('account-selected')).toBeTruthy()
    expect(wrapper.vm.selectedAccount).toEqual(account)

    wrapper.vm.selectAccount(account)
    expect(wrapper.vm.selectedAccount).toBe(null)
  })

  it('adds new account with saveAccount()', () => {
    const wrapper = mount(AccountsTable, {
      global: { stubs: { AccountForm: stubComponents, DataTable: stubComponents } },
    })

    const newAccount = { company: 'New Co.', analytics: true, cmbs: true }
    wrapper.vm.saveAccount(newAccount)

    expect(wrapper.vm.accounts.length).toBeGreaterThan(0)
    expect(wrapper.vm.accounts.at(-1).company).toBe('New Co.')
  })

  it('updates existing account with saveAccount()', () => {
    const wrapper = mount(AccountsTable, {
      global: { stubs: { AccountForm: stubComponents, DataTable: stubComponents } },
    })

    wrapper.vm.accounts = [{ id: 1, company: 'Old Co.' }]
    wrapper.vm.saveAccount({ id: 1, company: 'Updated Co.' })

    expect(wrapper.vm.accounts[0].company).toBe('Updated Co.')
  })

  it('calls accountForm.showForm() on editAccount()', () => {
    const wrapper = mount(AccountsTable, {
      global: { stubs: { AccountForm: stubComponents, DataTable: stubComponents } },
    })

    Object.defineProperty(wrapper.vm.$refs, 'accountForm', {
      value: { showForm: jest.fn() },
    })

    const account = { id: 123, company: 'Test Inc.' }
    wrapper.vm.editAccount(account)
    expect(wrapper.vm.$refs.accountForm.showForm).toHaveBeenCalledWith(account)
  })

  it('loads 10 accounts from accounts.txt', async () => {
    const filePath = path.resolve(__dirname, 'accounts.txt')
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    api.get.mockResolvedValue(fileContents)

    const wrapper = mount(AccountsTable, {
      global: { stubs: { AccountForm: stubComponents, DataTable: stubComponents } },
    })

    await wrapper.vm.loadAccounts()
    expect(wrapper.vm.accounts).toHaveLength(10)
  })
})

describe('AccountsTable.vue – real backend', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('throws FetchError for a bad URL', async () => {
  api.get.mockImplementationOnce(() => Promise.reject(new Error('FetchError')))

  const wrapper = mount(AccountsTable, {
    global: { stubs: { AccountForm: stubComponents, DataTable: stubComponents } },
    // prevent mounted() from firing loadAccounts
    attachTo: document.createElement('div'),
  })

  await expect(wrapper.vm.loadAccounts('bad/url')).rejects.toThrow('FetchError')
})


  it('calls loadAccounts with good URL and loads >10 rows with correct fields', async () => {
    const mockResponse = fs.readFileSync(path.resolve(__dirname, 'accounts.txt'), 'utf-8')
    api.get.mockResolvedValue(mockResponse)

    const wrapper = mount(AccountsTable, {
      global: { stubs: { AccountForm: stubComponents, DataTable: stubComponents } },
    })

    await wrapper.vm.loadAccounts('api/admin.php?req=accounts')
    expect(wrapper.vm.accounts.length).toBeGreaterThan(9)

    const first = wrapper.vm.accounts[0]
    expect(first).toHaveProperty('id')
    expect(first).toHaveProperty('company')
    expect(first).toHaveProperty('analytics')
    expect(first).toHaveProperty('tokens')
  })
})



describe('AccountsTable.vue – flow tests', () => {
  it('loads 10 accounts on mount', async () => {
    jest.resetAllMocks()

    const filePath = path.resolve(__dirname, 'accounts.txt')
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    api.get.mockResolvedValue(fileContents)

    const wrapper = mount(AccountsTable, {
      global: {
        stubs: {
          AccountForm: stubComponents,
          DataTable: stubComponents,
        },
      },
    })

    await wrapper.vm.loadAccounts()
    expect(wrapper.vm.accounts).toHaveLength(10)
  })

  it('filters accounts when search prop is updated', async () => {
    const wrapper = mount(AccountsTable, {
      props: { search: '' },
      global: {
        stubs: {
          AccountForm: stubComponents,
          DataTable: stubComponents,
        },
      },
    })

    const filePath = path.resolve(__dirname, 'accounts.txt')
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    api.get.mockResolvedValue(fileContents)

    await wrapper.vm.loadAccounts()
    await wrapper.setProps({ search: 'test' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filteredAccounts.length).toBeGreaterThan(0)

    await wrapper.setProps({ search: 'aajxjanvlalsakjf' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filteredAccounts.length).toBe(0)
  })

  it('calls accountForm.showForm when a row is clicked', async () => {
    const filePath = path.resolve(__dirname, 'accounts.txt')
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    api.get.mockResolvedValue(fileContents)

    const mockShowForm = jest.fn()

    const AccountFormStub = defineComponent({
      name: 'AccountForm',
      methods: {
        showForm: mockShowForm,
      },
      template: '<div></div>',
    })

    const DataTableStub = defineComponent({
      name: 'DataTable',
      emits: ['row-right-click'],
      setup(_, { emit }) {
        return () =>
          h('div', {
            class: 'fake-row',
            onClick: () => emit('row-right-click', { id: 1, company: 'Test Co' }),
          })
      },
    })

    const wrapper = mount(AccountsTable, {
      global: {
        stubs: {
          DataTable: DataTableStub,
          AccountForm: AccountFormStub,
        },
      },
    })

    await wrapper.vm.loadAccounts()
    await wrapper.vm.$nextTick()

    await wrapper.find('.fake-row').trigger('click')

    expect(mockShowForm).toHaveBeenCalledWith({ id: 1, company: 'Test Co' })
  })
})


