<template>
    <!-- BEGIN #content -->
    <div id="content" class="app-content">
        <b-row>
            <b-col cols="6">
                <h1 class="page-header">Users</h1>
            </b-col>
            <b-col cols="6" class="text-right">
                <b-button variant="primary" @click="addModal = !addModal"
                    ><i class="fa fa-user"></i> Add User</b-button
                >
            </b-col>
        </b-row>

        <b-card class="mb-3">
            <b-row>
                <b-col cols="12" md="4" lg="4">
                    <label for="">Filter By Name</label>
                    <b-form-input
                        @input="filterByName"
                        placeholder="Enter Name"
                    ></b-form-input>
                </b-col>
                <b-col cols="12" md="4" lg="4">
                    <label for="">Filter By Email</label>
                    <b-form-input
                        placeholder="Enter Email"
                        @input="filterByEmail"
                    ></b-form-input>
                </b-col>
                <b-col cols="12" md="4" lg="4">
                    <label for="">Filter By Role</label>
                    <b-form-select @change="filterByRole">
                        <b-form-select :value="null"
                            >Filter By Role</b-form-select
                        >
                        <b-form-select-option value="all"
                            >All</b-form-select-option
                        >
                        <b-form-select-option value="user"
                            >User</b-form-select-option
                        >
                        <b-form-select-option value="admin"
                            >Admin</b-form-select-option
                        >
                    </b-form-select>
                </b-col>
            </b-row>
        </b-card>

        <b-card>
            <b-table
                :items="users"
                responsive
                head-variant="light"
                hover
                :fields="fields"
            >
                <template v-slot:cell(actions)="record">
                    <b-button size="sm" class="mr-1" @click="edit(record.item)">
                        <i class="fa fa-edit"></i>
                    </b-button>
                    <b-button
                        size="sm"
                        class="mr-1"
                        @click="remove(record.item)"
                    >
                        <i class="fa fa-trash"></i>
                    </b-button>
                </template>
                <template v-slot:table-colgroup="scope">
                    <col
                        v-for="field in scope.fields"
                        :key="field.key"
                        :style="{ width: '250px' }"
                    />
                </template>
            </b-table>
        </b-card>

        <b-row>
            <b-col cols="12" class="mt-3">
                <b-pagination
                    align="right"
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                ></b-pagination>
            </b-col>
        </b-row>

        <!-- Delete Modal -->

        <b-modal title="Delete User" :hide-footer="true" v-model="deleteModal">
            <b-row v-if="userToDelete">
                <b-col cols="12" class="text-center">
                    <h5>
                        Are you sure you want to delete
                        {{ userToDelete.name }} ?
                    </h5>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col cols="6">
                    <b-button
                        block
                        variant="primary"
                        @click="removeUser(userToDelete.id)"
                        :disabled="deleteLoading"
                        >{{
                            deleteLoading ? "Please wait..." : "Yes, Delete"
                        }}</b-button
                    >
                </b-col>
                <b-col cols="6">
                    <b-button
                        block
                        variant="secondary"
                        @click="deleteModal = !deleteModal"
                        >No, Cancel</b-button
                    >
                </b-col>
            </b-row>
        </b-modal>

        <!-- Edit Modal -->

        <b-modal title="Edit User" :hide-footer="true" v-model="editModal">
            <b-form @submit.prevent="editUserProfile">
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Name*</label>
                            <b-form-input
                                type="text"
                                placeholder="Enter Name"
                                required
                                v-model="editUser.name"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Email*</label>
                            <b-form-input
                                type="email"
                                placeholder="Enter Email"
                                required
                                v-model="editUser.email"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Phone*</label>
                            <b-form-input
                                placeholder="Enter Phone"
                                v-model="editUser.phone"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Select Role*</label>
                            <b-form-select required v-model="editUser.role">
                                <b-form-select-option :value="null"
                                    >Select Role</b-form-select-option
                                >
                                <b-form-select-option value="user"
                                    >User</b-form-select-option
                                >
                                <b-form-select-option value="admin"
                                    >Admin</b-form-select-option
                                >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" class="text-right">
                        <b-button block type="submit" variant="primary">{{
                            editProfileLoading ? "Please wait..." : "Edit User"
                        }}</b-button>
                    </b-col>
                </b-row>
            </b-form>

            <hr />

            <b-row>
                <b-col cols="12">
                    <h5>Edit Password</h5>
                </b-col>
            </b-row>

            <b-form @submit.prevent="editUserPassword" class="mt-3">
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>New Password*</label>
                            <b-form-input
                                type="password"
                                placeholder="Enter New Password"
                                required
                                v-model="editPassword.password"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Confirm Password*</label>
                            <b-form-input
                                type="password"
                                placeholder="Confirm Password"
                                required
                                v-model="editPassword.confirm"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-button variant="primary" type="submit" block>{{
                            editPasswordLoading
                                ? "Please wait..."
                                : "Edit Password"
                        }}</b-button>
                    </b-col>
                </b-row>
            </b-form>
        </b-modal>

        <!-- Add Modal -->

        <b-modal title="Add User" :hide-footer="true" v-model="addModal">
            <b-form @submit.prevent="addUser">
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Name*</label>
                            <b-form-input
                                type="text"
                                placeholder="Enter Name"
                                required
                                v-model="user.name"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Email*</label>
                            <b-form-input
                                v-model="user.email"
                                type="email"
                                placeholder="Enter Email"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Phone*</label>
                            <b-form-input
                                placeholder="Enter Phone"
                                v-model="user.phone"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group>
                            <label>Password*</label>
                            <b-form-input
                                type="password"
                                placeholder="Enter Password"
                                required
                                v-model="user.password"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group>
                            <label>Select Role*</label>
                            <b-form-select required v-model="user.role">
                                <b-form-select-option :value="null"
                                    >Select Role</b-form-select-option
                                >
                                <b-form-select-option value="user"
                                    >User</b-form-select-option
                                >
                                <b-form-select-option value="admin"
                                    >Admin</b-form-select-option
                                >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-button
                            block
                            variant="primary"
                            type="submit"
                            :disabled="loading"
                            >{{
                                loading ? "Please wait..." : "Add User"
                            }}</b-button
                        >
                    </b-col>
                </b-row>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mixins from "../mixins/global";
export default {
    name: "Users",
    mixins: [mixins],
    computed: {
        ...mapGetters(["getUsers"]),
        rows() {
            return this.items.length;
        },
        users() {
            const items = this.items;
            if (items) {
                return items.slice(
                    (this.currentPage - 1) * this.perPage,
                    this.currentPage * this.perPage
                );
            }
            return null;
        }
    },
    methods: {
        ...mapActions([
            "fetchUsers",
            "createUser",
            "updateUser",
            "deleteUser",
            "updatePassword"
        ]),
        filterByName(value) {
            if (value) {
                let users = this.getUsers;
                this.items = users.filter(
                    item =>
                        item.name.toLowerCase().indexOf(value.toLowerCase()) >
                        -1
                );
            } else {
                this.items = this.getUsers;
            }
        },
        filterByEmail(value) {
            if (value) {
                let users = this.getUsers;
                this.items = users.filter(
                    item =>
                        item.email.toLowerCase().indexOf(value.toLowerCase()) >
                        -1
                );
            } else {
                this.items = this.getUsers;
            }
        },
        filterByRole(value) {
            if (value) {
                let users = this.getUsers;
                if (value == "all") {
                    this.items = this.getUsers;
                } else {
                    this.items = users.filter(
                        item =>
                            item.role
                                .toLowerCase()
                                .indexOf(value.toLowerCase()) > -1
                    );
                }
            } else {
                this.items = this.getUsers;
            }
        },
        async addUser() {
            if (this.user.password.length < 6) {
                this.toast(
                    "Password should contain atleast 6 characters.",
                    "Add User",
                    "warning"
                );
                return;
            }
            this.loading = true;
            await this.createUser(this.user);
            this.loading = false;
            this.addModal = false;
        },
        async editUserProfile() {
            let id = this.editUser.id;
            var form_data = new FormData();

            for (var key in this.editUser) {
                form_data.append(key, this.editUser[key]);
            }
            this.editProfileLoading = true;
            const payload = {
                id: id,
                data: form_data
            };
            await this.updateUser(payload);
            this.editProfileLoading = false;
            this.editModal = false;
        },
        async removeUser(id) {
            this.deleteLoading = true;
            await this.deleteUser(id);
            this.deleteLoading = false;
            this.deleteModal = false;
        },
        async editUserPassword() {
            if (this.editPassword.password.length < 6) {
                this.toast(
                    "Password should contain atleast 6 characters.",
                    "Update Password",
                    "warning"
                );
                return;
            }
            if (this.editPassword.password !== this.editPassword.confirm) {
                this.toast("Password Mismatch", "Edit Password", "warning");
                return;
            }
            const payload = {
                id: this.editUser.id,
                data: {
                    password: this.editPassword.password
                }
            };
            this.editPasswordLoading = true;
            await this.updatePassword(payload);
            this.editPasswordLoading = false;
            this.editPassword.password = this.editPassword.confirm = null;
        },
        edit(user) {
            this.editUser.id = user.id;
            this.editUser.name = user.name;
            this.editUser.email = user.email;
            this.editUser.phone = user.phone;
            this.editUser.role = user.role;
            this.editModal = true;
        },
        remove(user) {
            this.userToDelete = user;
            this.deleteModal = true;
        }
    },
    created() {
        if (this.getUsers.length) {
            this.items = this.getUsers;
        } else {
            this.fetchUsers();
        }
    },
    data() {
        return {
            loading: false,
            deleteLoading: false,
            editProfileLoading: false,
            editPasswordLoading: false,
            editModal: false,
            addModal: false,
            deleteModal: false,
            currentPage: 1,
            perPage: 15,
            items: [],
            userToDelete: null,
            editPassword: {
                password: null,
                confirm: null
            },
            editUser: {
                name: null,
                email: null,
                phone: null,
                role: null
            },
            user: {
                id: null,
                name: null,
                email: null,
                phone: null,
                role: null,
                password: null
            },
            fields: [
                {
                    key: "name",
                    label: "Name",
                    sortable: true,
                    sortByFormatted: true
                },
                {
                    key: "email",
                    label: "Email",
                    sortable: true,
                    sortByFormatted: true
                },
                {
                    key: "phone",
                    label: "Phone",
                    sortable: true,
                    sortByFormatted: true
                },
                {
                    key: "role",
                    label: "Role",
                    sortable: true,
                    sortByFormatted: true
                },
                {
                    key: "actions"
                }
            ]
        };
    },

    watch: {
        getUsers(val) {
            if (val) {
                this.items = val;
            }
        }
    }
};
</script>
