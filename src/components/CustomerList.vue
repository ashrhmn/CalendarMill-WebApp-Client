<template>
  <div>
    <div>
      <label class="inline-flex items-center mt-3 py-2">
        <input
          type="checkbox"
          class="form-checkbox h-5 w-5 text-teal-600"
          v-model="checked"
          @change="edit"
        /><span class="ml-2 text-gray-700">Edit</span> </label
      >&nbsp;
      <input
        class="py-2 w-80 border-2 border-green-500"
        v-model="query"
      />&nbsp;
      <button class="border-2 border-black px-10 py-2 rounded" @click="search">
        Search</button
      >&nbsp;
      <button
        class="border-2 border-black px-10 py-2 rounded"
        @click="clearSearch"
      >
        Clear
      </button>
    </div>
    <div>
      <table class="bg-green-300 mx-auto">
        <thead>
          <th v-if="!editable">ID</th>
          <th>Name</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Due</th>
          <th v-if="editable">Edit</th>
          <th>Action</th>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in customers" :key="customer.id">
            <td v-if="!editable">
              <input
                class="w-12 text-center"
                v-model="customer.id"
                :readonly="!editable"
              />
            </td>
            <td>
              <input
                class="w-80 text-center"
                v-model="customer.name"
                :readonly="!editable"
              />
            </td>
            <td>
              <input
                class="w-80 text-center"
                v-model="customer.address"
                :readonly="!editable"
              />
            </td>
            <td>
              <input
                class="text-center"
                v-model="customer.phone"
                :readonly="!editable"
              />
            </td>
            <td>
              <input class="text-center" v-model="dues[index]" readonly />
            </td>
            <td v-if="editable">
              <button
                class="bg-blue-300 rounded"
                @click="updateData(customer.id, index)"
              >
                Update</button
              >&nbsp;
              <button
                class="bg-red-400 rounded"
                @click="deleteCustomer(customer.id)"
              >
                Delete
              </button>
            </td>
            <td>
              <button
                class="bg-blue-300 rounded border-2 border-black"
                @click="
                  $router.push({
                    name: 'NewEntry',
                    params: { cid: customer.id },
                  })
                "
              >
                New Entry</button
              >&nbsp;
              <button
                class="bg-yellow-300 rounded border-2 border-black"
                @click="
                  $router.push({
                    name: 'CustomerData',
                    params: { cid: customer.id },
                  })
                "
              >
                All Data
              </button>
            </td>
          </tr>
          <tr v-if="editable">
            <td>
              <input class="w-80 text-center" v-model="name" />
            </td>
            <td>
              <input class="w-80 text-center" v-model="address" />
            </td>
            <td>
              <input class="text-center" v-model="phone" />
            </td>
            <td>
              <button
                class="px-10 bg-green-600 rounded text-white"
                @click="addCustomer"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>



<script>
import CustomerDataService from "../services/CustomerDataService";
import DataDataService from "../services/DataDataService";

export default {
  data() {
    return {
      customers: [],
      customer: null,
      editable: false,
      query: "",
      checked: false,

      //for new customers
      name: "",
      address: "",
      phone: "",
      dues: [],
    };
  },
  methods: {
    getCustomer(id) {
      CustomerDataService.get(id)
        .then((response) => {
          this.customer = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getCustomers() {
      CustomerDataService.getAll()
        .then((response) => {
          this.customers = response.data;
          console.log(response.data);
          for (let i = 0; i < this.customers.length; ++i) {
            this.dues.push("0");
          }
          this.updateDue();
          // for(let i=0;i<this.customers.length;++i){
          //   this.dues[i]=(this.getDue(this.customers[i].id))
          // }
          // console.log('Dues : ',this.dues)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    edit() {
      if (this.checked) {
        this.editable = true;
      } else {
        this.editable = false;
      }
    },
    search() {
      CustomerDataService.searchCustomer(this.query)
        .then((response) => {
          this.customers = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clearSearch() {
      this.query = "";
      this.getCustomers();
    },
    updateData(id, index) {
      CustomerDataService.create(this.customers[index])
        .then((r) => {
          console.log(r.data);
          this.getCustomers();
          this.editable = false;
          this.checked = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addCustomer() {
      this.customer = {
        name: this.name,
        address: this.address,
        phone: this.phone,
      };

      //customers.push(this.customer)

      console.log("phone : " + this.phone);

      CustomerDataService.create(this.customer)
        .then((response) => {
          console.log(response.data);
          this.getCustomers();
          this.editable = false;
          this.checked = false;

          this.name = "";
          this.address = "";
          this.phone = "";
        })
        .catch((error) => {
          console.log(error);
        });
    },

    deleteCustomer(id) {
      CustomerDataService.delete(id)
        .then((response) => {
          console.log(response.data);
          this.getCustomers();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    updateDue() {
      for (let i = 0; i < this.customers.length; ++i) {
        let data = null;
        DataDataService.getByCustomer(this.customers[i].id)
          .then((response) => {
            data = response.data;
            // console.log(data);
            let totalDueOfCus = 0.0;
            for (let i = 0; i < data.length; ++i) {
              if (data[i].d_type == "0") {
                totalDueOfCus += parseFloat(
                  parseFloat(data[i].d_rate) * parseFloat(data[i].d_amount)
                );
              } else {
                totalDueOfCus -= parseFloat(
                  parseFloat(data[i].d_rate) * parseFloat(data[i].d_amount)
                );
              }
            }
            totalDueOfCus = totalDueOfCus.toFixed(1);
            console.log("Due Total : ", totalDueOfCus);
            this.dues[i] = totalDueOfCus;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  mounted() {
    this.getCustomers();
    // this.updateDue();
  },
};
</script>

