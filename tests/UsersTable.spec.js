import { mount } from '@vue/test-utils'
import UsersTable from '../admin/UsersTable.vue'
import api from '../src/api.js'

// Stub for child components (UserForm and DataTable)
const stubComponents = {
  template: '<div><slot /></div>',
}

// Mock user data in TSV format
const mockUsersTsv = `id_user\temail\tfirst_name\tlast_name\taccount\tdisabled\trestricted\trestricted_apps\tshow_all\tprofile
1\tjohn@example.com\tJohn\tDoe\t1\t0\t0\t0\t1\tadmin
2\tjane@example.com\tJane\tSmith\t1\t0\t1\t0\t0\texplorer`

describe('UsersTable.vue', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    api.get.mockResolvedValue(mockUsersTsv)
  })

  it('selects and unselects a user', async () => {
    const wrapper = mount(UsersTable, {
      props: {
        accounts: [],
        selectedAccount: null,
      },
      global: {
        stubs: {
          UserForm: stubComponents,
          DataTable: stubComponents,
        },
      },
    })

    const user = { id_user: 1 }
    wrapper.vm.selectUser(user)
    expect(wrapper.vm.selectedUser).toEqual(user)

    // Select again should unselect
    wrapper.vm.selectUser(user)
    expect(wrapper.vm.selectedUser).toBe(null)
  })

  it('filters users based on search and limits to 20', async () => {
    const wrapper = mount(UsersTable, {
      props: {
        search: 'john',
        selectedAccount: null,
        accounts: [],
      },
      global: {
        stubs: {
          UserForm: stubComponents,
          DataTable: stubComponents,
        },
      },
    })

    await wrapper.vm.loadUsers()

    expect(wrapper.vm.filteredUsers.length).toBeLessThanOrEqual(20)
    expect(wrapper.vm.filteredUsers[0].first_name.toLowerCase()).toContain('john')
  })

  it('adds a new user when saveUser() is called without id_user', () => {
    const wrapper = mount(UsersTable, {
      props: {
        accounts: [],
        selectedAccount: null,
      },
      global: {
        stubs: {
          UserForm: stubComponents,
          DataTable: stubComponents,
        },
      },
    })

    const newUser = {
      email: 'new@example.com',
      first_name: 'New',
      last_name: 'User',
    }

    wrapper.vm.saveUser({ ...newUser })

    expect(wrapper.vm.users.length).toBeGreaterThan(0)
    expect(wrapper.vm.users.at(-1).email).toBe('new@example.com')
  })

  it('calls userForm.showForm() when editUser() is called', () => {
    const wrapper = mount(UsersTable, {
      props: {
        accounts: [],
        selectedAccount: null,
      },
      global: {
        stubs: {
          UserForm: stubComponents,
          DataTable: stubComponents,
        },
      },
    })

    // Mock the ref
    Object.defineProperty(wrapper.vm.$refs, 'userForm', {
      value: {
        showForm: jest.fn(),
      },
    })

    const user = { id_user: 1, email: 'test@example.com' }
    wrapper.vm.editUser(user)

    expect(wrapper.vm.$refs.userForm.showForm).toHaveBeenCalledWith(user, null)
  })

    it('calls showForm and resetPassword when showPasswordDialog() is called', () => {
    const wrapper = mount(UsersTable, {
      props: {
        accounts: [],
        selectedAccount: null,
      },
      global: {
        stubs: {
          UserForm: stubComponents,
          DataTable: stubComponents,
        },
      },
    })

    // Manually mock the $refs.userForm with spy functions for showForm and resetPassword

    Object.defineProperty(wrapper.vm.$refs, 'userForm', {
      value: {
        showForm: jest.fn(),
        resetPassword: jest.fn(),
      },
    })

    const user = { id_user: 1, email: 'reset@example.com' }
    wrapper.vm.showPasswordDialog(user)

    expect(wrapper.vm.$refs.userForm.showForm).toHaveBeenCalledWith(user)
    expect(wrapper.vm.$refs.userForm.resetPassword).toHaveBeenCalled()
  })

})
