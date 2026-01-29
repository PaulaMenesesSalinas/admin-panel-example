import { mount } from '@vue/test-utils'
import UserForm from '../admin/UserForm.vue'

const stubComponents = {
  template: '<div><slot /></div>',
}
const mockAccounts = [
  { id: 1, company: 'Demo Inc.' },
  { id: 2, company: 'Other Co.' },
]

describe('UserForm.vue', () => {
  // Test that closeForm() sets show to false
  it('closes the form when closeForm() is called', () => {
    const wrapper = mount(UserForm, {
      props: { accounts: mockAccounts },
      global: {
        stubs: {
          Toggle: stubComponents,
          DropDown: stubComponents,
          SearchableDropDown: stubComponents,
        },
      },
    })

    wrapper.vm.show = true
    wrapper.vm.closeForm()
    expect(wrapper.vm.show).toBe(false)
  })

  // Test that showForm(null, account) initializes defaults for new user
  it('sets show to true and loads defaults when showForm(null, account) is called', () => {
    const wrapper = mount(UserForm, {
      props: { accounts: mockAccounts },
      global: {
        stubs: {
          Toggle: stubComponents,
          DropDown: stubComponents,
          SearchableDropDown: stubComponents,
        },
      },
    })

    expect(wrapper.vm.show).toBe(false)
    wrapper.vm.showForm(null, mockAccounts[0])

    expect(wrapper.vm.show).toBe(true)
    expect(wrapper.vm.formData.account).toBe(mockAccounts[0].id)
    expect(wrapper.vm.formData.status).toBe(true)
    expect(wrapper.vm.formData.profile).toBe('')
  })

  // Test that showForm(user) populates formData with the given user
  it('sets show to true and loads user data when showForm(user) is called', () => {
    const wrapper = mount(UserForm, {
      props: { accounts: mockAccounts },
      global: {
        stubs: {
          Toggle: stubComponents,
          DropDown: stubComponents,
          SearchableDropDown: stubComponents,
        },
      },
    })

    const mockUser = {
      id_user: 42,
      email: 'test@example.com',
      first_name: 'Jane',
      last_name: 'Doe',
      profile: 'admin',
      account: 1,
      status: false,
    }

    wrapper.vm.showForm(mockUser)

    expect(wrapper.vm.show).toBe(true)
    expect(wrapper.vm.formData.id_user).toBe(42)
    expect(wrapper.vm.formData.email).toBe('test@example.com')
    expect(wrapper.vm.formData.profile).toBe('admin')
    expect(wrapper.vm.formData.status).toBe(false)
  })

  // If saveUser is called for a new user, it should generate a password and open password dialog
  it('opens password dialog and sets password when creating a new user (saveUser)', () => {
    const wrapper = mount(UserForm, {
      props: { accounts: mockAccounts },
      global: { stubs: stubComponents },
    });

    wrapper.vm.formData = {
      id_user: null,
    };

    wrapper.vm.saveUser();

    expect(wrapper.vm.generatedPassword).toBeTruthy();
    expect(wrapper.vm.passwordDialog).toBe(true);
  });

  // If editing an existing user, saveUser should emit the "save" event
  it('emits save and closes form when editing existing user (saveUser)', () => {
    const wrapper = mount(UserForm, {
      props: { accounts: mockAccounts },
      global: { stubs: stubComponents },
    });

    wrapper.vm.formData = {
      id_user: 7,
      email: 'user@example.com'
    };

    wrapper.vm.saveUser();

    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.emitted('save')[0][0].email).toBe('user@example.com');
    expect(wrapper.vm.show).toBe(false);
  });

  // resetPassword should generate a password and set the passwordDialog to true
  it('generates a password and opens password dialog (resetPassword)', () => {
    const wrapper = mount(UserForm, {
      props: { accounts: mockAccounts },
      global: { stubs: stubComponents },
    });

    wrapper.vm.resetPassword();

    expect(wrapper.vm.generatedPassword).toBeTruthy();
    expect(wrapper.vm.passwordDialog).toBe(true);
  });

  // confirmPasswordDialog should emit reset-password and close the dialog
  it('emits reset-password and closes dialog (confirmPasswordDialog)', () => {
    const wrapper = mount(UserForm, {
      props: { accounts: mockAccounts },
      global: { stubs: stubComponents },
    });

    wrapper.vm.formData = {
      username: 'testuser',
      email: 'user@example.com',
      id_user: 5,
    };
    wrapper.vm.generatedPassword = 'abc123';
    wrapper.vm.passwordDialog = true;

    wrapper.vm.confirmPasswordDialog();

    expect(wrapper.emitted('reset-password')).toBeTruthy();
    expect(wrapper.emitted('reset-password')[0][0]).toEqual({
      username: 'testuser',
      password: 'abc123',
    });

    expect(wrapper.vm.passwordDialog).toBe(false);
    expect(wrapper.vm.show).toBe(false);
  });

  // If new user, confirmPasswordDialog should also emit save
  it('emits save after reset-password if it is a new user (confirmPasswordDialog)', () => {
    const wrapper = mount(UserForm, {
      props: { accounts: mockAccounts },
      global: { stubs: stubComponents },
    });

    wrapper.vm.formData = {
      email: 'newuser@example.com',
      id_user: null,
    };
    wrapper.vm.generatedPassword = 'xyz789';
    wrapper.vm.passwordDialog = true;

    wrapper.vm.confirmPasswordDialog();

    expect(wrapper.emitted('reset-password')).toBeTruthy();
    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.vm.show).toBe(false);
  });
})
