<template>
  <div>
    <p>Data View</p>
    <div>
      <input
        class="text-center"
        v-model="customerId"
        placeholder="Customer ID"
        @keypress="isIntegerNumber(event)"
      />&nbsp;
      <input
        class="text-center"
        v-model="fromDate"
        placeholder="Date from"
      />&nbsp;
      <input class="text-center" v-model="toDate" placeholder="To Date" />
      <button
        class="bg-green-500 text-white hover:bg-green-800 rounded"
        @click="getAllFilteredData"
      >
        Apply Filter
      </button>

      <div class="float-right pr-10">
        <div class="float-left">
          <input type="checkbox" name="dueColCheckbox" v-model="dueColVis" />
          <label for="dueColCheckbox"> Due</label>
        </div>
        <br />
        <div class="float-left">
          <input type="checkbox" name="rateColCheckbox" v-model="rateColVis" />
          <label for="rateColCheckbox"> Rate</label>
        </div>
        <br />
        <div class="float-left">
          <input
            type="checkbox"
            name="actionColCheckbox"
            v-model="actionColVis"
          />
          <label for="actionColCheckbox"> Actions</label>
        </div>
      </div>
    </div>

    <hr />

    <div>
      <button
        class="bg-blue-500 text-white rounded hover:bg-blue-800"
        @click="getAllCustomerData"
      >
        All Customer</button
      >&nbsp;
      <button
        class="bg-blue-500 text-white rounded hover:bg-blue-800"
        @click="getTodayData"
      >
        Today Data</button
      >&nbsp;
      <button
        class="bg-blue-500 text-white rounded hover:bg-blue-800"
        @click="getAllTimeData"
      >
        All Data
      </button>
    </div>

    <br />

    <hr v-if="singleCustomer" />

    <div v-if="singleCustomer">
      |
      <label for="customerName">Customer Name : </label>

      <input v-model="this.customer.name" name="customerName" readonly />|

      <label for="customerAddress">Customer Address : </label>

      <input v-model="this.customer.address" name="customerAddress" readonly />|

      <label for="customerPhone">Customer Phone : </label>

      <input v-model="this.customer.phone" name="customerPhone" readonly />|

      <br />
      <br />

      <label for="totalDue">Total Due : </label>
      <input type="text" v-model="totalDueOfCus" />&nbsp;

      <button
        @click="
          $router.push({
            name: 'NewEntry',
            params: { cid: customer.id },
          })
        "
        class="bg-blue-500 text-white rounded hover:bg-blue-800"
      >
        New Entry
      </button>
    </div>

    <hr v-if="singleCustomer" />
    <br v-if="singleCustomer" />

    <table class="mx-auto bg-green-300" border="1">
      <thead>
        <th v-if="!singleCustomer">Customer Name</th>
        <th>Date</th>
        <th>Type</th>
        <th>Item Name</th>
        <th>Amount(Meter)</th>
        <th>Amount(Yard)</th>
        <th v-if="rateColVis">Item Rate</th>
        <th>Price</th>
        <th v-if="singleCustomer && dueColVis">Due</th>
        <th v-if="actionColVis">Actions</th>
      </thead>
      <tbody>
        <tr v-for="(data, index) in allData" :key="data.d_id">
          <td v-if="!singleCustomer">
            <input class="w-60 text-center" v-model="data.c_name" readonly />
          </td>
          <td>
            <input class="w-24 text-center" v-model="data.d_date" readonly />
          </td>
          <td>
            <input
              class="w-24 text-center"
              v-if="data.d_type == 0"
              value="Purchase"
              readonly
            />
            <input
              class="w-24 text-center"
              v-if="data.d_type == 1"
              value="Discount"
              readonly
            />
            <input
              class="w-24 text-center"
              v-if="data.d_type == 2"
              value="Payment"
              readonly
            />
          </td>
          <td>
            <input
              class="w-50 text-center"
              v-if="data.d_type == 0"
              v-model="data.i_name"
              readonly
            />
          </td>
          <td>
            <input
              class="text-right"
              v-if="data.d_type == 0"
              v-model="amountMeter[index]"
              readonly
            />
          </td>
          <td>
            <input
              class="text-right"
              v-if="data.d_type == 0"
              v-model="data.d_amount"
              readonly
            />
          </td>
          <td v-if="rateColVis">
            <input
              class="w-20 text-right"
              v-if="data.d_type == 0"
              v-model="data.d_rate"
              readonly
            />
          </td>
          <td>
            <input
              :class="{ 'text-red-800': !isPurchase(data.d_type) }"
              class="text-right"
              v-model="this.prices[index]"
              readonly
            />
          </td>
          <td v-if="singleCustomer && dueColVis">
            <input class="text-right" v-model="this.dues[index]" />
          </td>
          <td
            class="bg-red-500 text-white hover:bg-red-800"
            v-if="actionColVis"
          >
            <button @click="deleteData(data.d_id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataDataService from "../services/DataDataService";
import CustomerDataService from "../services/CustomerDataService";
export default {
  props: {
    cid: { required: false },
  },
  data() {
    return {
      allData: [],
      prices: [],
      amountMeter: [],
      due: 0,
      dues: [],
      //   multipleCustomer: true,
      singleCustomer: false,

      customerId: "",
      fromDate: "",
      toDate: "",
      customer: {
        name: "",
        address: "",
        phone: "",
      },
      dueColVis: false,
      rateColVis: false,
      actionColVis: false,
      totalDueOfCus: 0,
    };
  },
  methods: {
    getAllCustomerData() {
      this.customerId = "";
      this.dueColVis = false;
      this.getAllFilteredData();
    },
    getTodayData() {
      this.fromDate = this.decodeDate(this.dateToday());
      this.toDate = this.decodeDate(this.dateToday());
      this.dueColVis = false;
      this.getAllFilteredData();
    },
    getAllTimeData() {
      this.fromDate = "01-01-1901";
      this.toDate = "31-12-2099";
      this.dueColVis = true;
      this.getAllFilteredData();
    },
    getCustomer(id) {
      CustomerDataService.get(id)
        .then((response) => {
          this.customer = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAllData() {
      this.prices = [];
      this.amountMeter = [];
      DataDataService.getAll()
        .then((response) => {
          this.allData = response.data;
          console.log(response.data);
          for (let i = 0; i < this.allData.length; ++i) {
            this.prices.push(
              (this.allData[i].d_amount * this.allData[i].d_rate).toFixed(2)
            );
            this.allData[i].d_date = this.decodeDate(this.allData[i].d_date);
            console.log("Encoded: " + this.encodeDate(this.allData[i].d_date));

            this.amountMeter[i] = (this.allData[i].d_amount / 1.094).toFixed(2);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAllFilteredData() {
      this.prices = [];
      this.amountMeter = [];
      this.due = 0;
      this.dues = [];
      if (this.customerId == "") {
        this.customerId = 0;
        this.singleCustomer = false;
      } else {
        this.singleCustomer = true;
        this.dueColVis = true;
        this.getCustomer(this.customerId);
      }
      if (this.fromDate == "") {
        this.fromDate = "01-01-1901";
      }
      if (this.toDate == "") {
        this.toDate = "31-12-2099";
      }
      DataDataService.getByCustomerDate(
        this.customerId,
        this.encodeDate(this.fromDate),
        this.encodeDate(this.toDate)
      )
        .then((response) => {
          this.allData = response.data;
          console.log(response.data);
          for (let i = 0; i < this.allData.length; ++i) {
            this.prices.push(
              (this.allData[i].d_amount * this.allData[i].d_rate).toFixed(2)
            );
            this.allData[i].d_date = this.decodeDate(this.allData[i].d_date);
            if (this.allData[i].d_type == "0") {
              this.due += parseFloat(this.prices[i]);
            } else {
              this.due -= parseFloat(this.prices[i]);
            }

            this.dues.push(this.due.toFixed(2));

            this.amountMeter[i] = (this.allData[i].d_amount / 1.094).toFixed(2);
          }
          this.getDue(this.customerId);
        })
        .catch((error) => {
          console.log(error);
        });
      // if (this.customerId == "0") {
      //   this.customerId = "";
      // }
    },
    isPurchase(type) {
      if (!type) {
        return true;
      }
    },
    isIntegerNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    decodeDate(date) {
      date = date.toString();
      var year =
        date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3);
      var month = date.charAt(4) + date.charAt(5);
      var day = date.charAt(6) + date.charAt(7);
      return day + "-" + month + "-" + year;
    },

    encodeDate(date) {
      date = date.toString();
      var year =
        date.charAt(6) + date.charAt(7) + date.charAt(8) + date.charAt(9);
      var month = date.charAt(3) + date.charAt(4);
      var day = date.charAt(0) + date.charAt(1);
      return year + "" + month + "" + day;
    },
    dateToday() {
      var today = new Date();
      var dd = today.getDate();

      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }
      return yyyy + "" + mm + "" + dd;
    },
    getDue(id) {
      if (!this.singleCustomer) {
        this.dueColVis = false;
      }
      let data = null;
      DataDataService.getByCustomer(id)
        .then((response) => {
          data = response.data;
          console.log(data);
          this.totalDueOfCus = 0.0;
          for (let i = 0; i < data.length; ++i) {
            if (data[i].d_type == "0") {
              this.totalDueOfCus += parseFloat(
                parseFloat(data[i].d_rate) * parseFloat(data[i].d_amount)
              );
            } else {
              this.totalDueOfCus -= parseFloat(
                parseFloat(data[i].d_rate) * parseFloat(data[i].d_amount)
              );
            }
          }
          this.totalDueOfCus = this.totalDueOfCus.toFixed(1);
          console.log("Due Total : ", this.totalDueOfCus);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteData(id) {
      if (confirm("Are you sure want to delete this data?")) {
        DataDataService.delete(id)
          .then((response) => {
            console.log(response.data);
            alert("Selected data deleted successfully");
            this.getAllFilteredData();
          })
          .catch((error) => {
            alert("Delete error");
            console.log(error);
          });
      } else {
      }
    },
  },
  created() {
    if (this.cid) {
      this.customerId = this.cid;
      this.dueColVis = true;
      // this.getAllTimeData();
      this.getAllFilteredData();
      this.getDue(this.customerId);
    }
  },
  mounted() {
    if (!this.cid) {
      this.dueColVis = true;
      this.getAllData();
      this.getDue(this.customerId);
    }
  },
};
</script>