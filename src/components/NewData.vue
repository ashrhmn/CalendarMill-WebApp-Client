<template>
  <div>
    <div>
      <p>New Data Entry</p>
      <div class="">
        <input
          @change="customerCheckOnChange(customerId)"
          type="checkbox"
          v-model="customerChecked"
        />
        <label for="customerId">ID :</label>
        <input
          v-model="customerId"
          name="customerId"
          :disabled="customerChecked"
        />
        <label for="customerName">Customer Name :</label>
        <input v-model="customerName" name="customerName" readonly />
        <label for="customerAddress">Address :</label>
        <input v-model="customerAddress" name="customerAddress" readonly />
        <br />
        <label for="customerPhone">Phone :</label>
        <input v-model="customerPhone" name="customerPhone" readonly />
        <label for="totalDue">Total Due : </label>
        <input type="text" v-model="totalDueOfCus" readonly />&nbsp;
        <button
          class="bg-blue-400 rounded hover:bg-blue-700 hover:text-white"
          v-if="viewAllDataBtn"
          @click="
            $router.push({
              name: 'CustomerData',
              params: { cid: customerId },
            })
          "
        >
          View All Data
        </button>
        <br />
        <br />
      </div>

      <div>
        <table class="mx-auto bg-green-300" border="1">
          <thead>
            <th>Item Name</th>
            <th>Price</th>
            <th>Amount(Meter)</th>
            <th>Amount(Yard)</th>
            <th>Item Price</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in this.items" :key="item.id">
              <td>
                <input v-model="item.name" readonly disabled />
              </td>
              <td>
                <input
                  @keypress="isNumber(event, item.price)"
                  @blur="calcItemPrice"
                  v-model="item.price"
                  class="text-right"
                />
              </td>
              <td>
                <input
                  @blur="calcItemPrice"
                  @keypress="isNumber(event, amountsMeter[index])"
                  v-model="amountsMeter[index]"
                  class="text-right"
                />
              </td>
              <td>
                <input
                  @blur="calcItemPrice"
                  v-model="amountsYard[index]"
                  readonly
                  disabled
                  class="text-right"
                />
              </td>
              <td>
                <input
                  v-model="itemPrices[index]"
                  readonly
                  disabled
                  class="text-right"
                />
              </td>
            </tr>
            <tr>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input value="Total :" readonly disabled />
              </td>
              <td>
                <input v-model="total" class="text-right" readonly disabled />
              </td>
            </tr>
            <tr>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input value="Discount :" readonly disabled />
              </td>
              <td>
                <input
                  @blur="calcItemPrice"
                  @keypress="isNumber(event, discount)"
                  v-model="discount"
                  class="text-right"
                />
              </td>
            </tr>
            <tr>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input value="Grand Total :" readonly disabled />
              </td>
              <td>
                <input
                  v-model="discountSubTotal"
                  class="text-right"
                  readonly
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input value="Paid Amount :" readonly disabled />
              </td>
              <td>
                <input
                  @keypress="isNumber(event, paidAmount)"
                  @change="calcItemPrice"
                  v-model="paidAmount"
                  class="text-right"
                />
              </td>
            </tr>
            <tr>
              <td>
                <button
                  class="bg-blue-500 text-white rounded hover:bg-blue-700 px-12"
                  @click="saveCustomerData"
                  :disabled="!customerChecked"
                >
                  Save
                </button>
              </td>
              <td>
                <button
                  class="bg-red-500 text-white rounded hover:bg-red-700 px-12"
                  @click="discardCustomerData"
                >
                  Discard
                </button>
              </td>
              <td>
                <input readonly disabled />
              </td>
              <td>
                <input value="Due :" readonly disabled />
              </td>
              <td>
                <input
                  v-model="dueAmount"
                  class="text-right"
                  readonly
                  disabled
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import DataDataService from "../services/DataDataService.js";
import CustomerDataService from "../services/CustomerDataService.js";
import ItemDataService from "../services/ItemDataService.js";

import DataView from "./DataView.vue";
export default {
  components: { DataView },
  props: {
    cid: { required: false },
  },
  data() {
    return {
      customerChecked: false,
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerId: "",

      item: null,
      items: [],
      name: "",
      price: "",
      amount: "",
      amountsMeter: [],
      amountsYard: [],
      itemPrices: [],

      total: 0,
      discount: 0,

      discountSubTotal: 0,

      paidAmount: 0,

      dueAmount: 0,

      renderComponent: true,

      totalDueOfCus: 0,
      viewAllDataBtn: true,
    };
  },
  methods: {
    getDue(id) {
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
    customerCheckOnChange(id) {
      console.log(this.customerChecked);
      // this.customerChecked = !this.customerChecked;

      this.getDue(this.customerId);

      if (id == "") {
        this.customerChecked = false;

        this.totalDueOfCus = 0;
        return;
      }

      if (this.customerChecked) {
        CustomerDataService.get(id)
          .then((response) => {
            if (response.data) {
              this.customerName = response.data.name;
              this.customerAddress = response.data.address;
              this.customerPhone = response.data.phone;
              this.customerId = response.data.id;
              this.viewAllDataBtn = true;
            } else {
              this.customerName = "";
              this.customerAddress = "";
              this.customerPhone = "";
              this.viewAllDataBtn = false;
              this.customerChecked = false;
            }
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.customerName = "";
        this.customerAddress = "";
        this.customerPhone = "";
        this.viewAllDataBtn = false;
      }
    },
    loadUserById(id) {
      CustomerDataService.get(id)
        .then((response) => {
          if (response.data) {
            this.customerName = response.data.name;
            this.customerAddress = response.data.address;
            this.customerPhone = response.data.phone;
            this.customerId = response.data.id;
          } else {
            this.customerName = "";
            this.customerAddress = "";
            this.customerPhone = "";
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getItems() {
      this.amountsMeter = [];
      this.amountsYard = [];
      this.itemPrices = [];
      ItemDataService.getAll()
        .then((response) => {
          this.items = response.data;
          console.log(response.data);
          for (let i = 0; i < this.items.length; ++i) {
            this.amountsMeter.push(0);
            this.amountsYard.push(0);
            this.itemPrices.push(0);
          }
          console.log(this.amountsMeter);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    isNumber(evt, data) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        if (data.indexOf('.')!='-1') {
          if (charCode == 46) {
            evt.preventDefault();
          }
          return true;
        } else {
          return true;
        }
      }
    },
    // addCustomerData(index) {
    //   let id = this.items[index].id;
    //   for (let i = 0; i < this.customerData.length; ++i) {
    //     if (this.customerData[i].itemId == id) {
    //       this.customerData[i].amount =
    //         parseFloat(this.amountsMeter[index]) +
    //         parseFloat(this.customerData[i].amount);
    //       this.customerData[i].itemPrice =
    //         this.customerData[i].price * this.customerData[i].amount;
    //       console.log(this.customerData[i]);
    //       return;
    //     }
    //   }
    //   this.data = {
    //     itemId: this.items[index].id,
    //     itemName: this.items[index].name,
    //     amount: this.amountsMeter[index],
    //     price: this.items[index].price,
    //     itemPrice: this.amountsMeter[index] * this.items[index].price,
    //   };

    //   this.customerData.push(this.data);

    //   console.log(this.customerData);
    // },
    calcItemPrice() {
      this.total = 0;
      for (let i = 0; i < this.itemPrices.length; ++i) {
        this.amountsYard[i] = (this.amountsMeter[i] * 1.094).toFixed(2);
        this.itemPrices[i] = (
          this.items[i].price * this.amountsYard[i]
        ).toFixed(2);
        this.total += parseFloat(this.itemPrices[i]);
      }
      this.total = this.total.toFixed(2);
      this.discountSubTotal = this.total - this.discount;
      this.dueAmount = this.discountSubTotal - this.paidAmount;
    },
    discardCustomerData() {
      this.amountsMeter = [];
      this.amountsYard = [];
      this.itemPrices = [];
      this.discount = 0;
      this.paidAmount = 0;
      this.getItems();
      this.calcItemPrice();
    },
    saveCustomerData() {
      console.log("save btn");
      //purchase
      for (let i = 0; i < this.amountsMeter.length; ++i) {
        if (this.amountsMeter[i]) {
          DataDataService.create({
            date: this.dateToday(),
            customerId: this.customerId,
            itemId: this.items[i].id,
            amount: (this.amountsMeter[i] * 1.094).toFixed(2),
            rate: this.items[i].price,
            type: 0,
          })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }

      //payment
      if (this.paidAmount) {
        DataDataService.create({
          date: this.dateToday(),
          customerId: this.customerId,
          itemId: 0,
          amount: this.paidAmount,
          rate: 1,
          type: 2,
        })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      //discount
      if (this.discount) {
        DataDataService.create({
          date: this.dateToday(),
          customerId: this.customerId,
          itemId: 0,
          amount: this.discount,
          rate: 1,
          type: 1,
        })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      alert("Data Saved");

      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });

      // window.location.reload();
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
  },
  created() {
    if (this.cid) {
      this.customerId = this.cid;
      this.customerChecked = true;
      this.customerCheckOnChange(this.customerId);
      this.getDue(this.customerId);
    } else {
      this.viewAllDataBtn = false;
    }
    this.getItems();
  },
};
</script>