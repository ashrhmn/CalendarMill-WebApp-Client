<template>
  <div>
    <div>
      <h1 class="text-2xl hover:text-3xl">Item List</h1>
    </div>
    <div>
      <table class="mx-auto bg-green-300" border="1">
        <thead>
          <th>Item Name</th>
          <th>Price</th>
          <th>Action</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in this.items" :key="item.id">
            <td>
              <input v-model="item.name" />
            </td>
            <td>
              <input @keypress="isNumber(event,item.price)" v-model="item.price" />
            </td>
            <td>
              <button class="bg-blue-300 rounded" @click="updateData(index)">
                Update</button
              >&nbsp;
              <button class="bg-red-400 rounded" @click="deleteData(item.id)">
                Delete
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <input v-model="name" />
            </td>
            <td>
              <input @keypress="isNumber(event,price)" v-model="price" />
            </td>
            <td>
              <button class="bg-blue-300 rounded" @click="addData">Add</button
              >&nbsp;
              <button class="bg-yellow-300 rounded" @click="updateAll">
                Batch Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import ItemDataService from "../services/ItemDataService";
export default {
  data() {
    return {
      item: null,
      items: [],
      name: "",
      price: "",
    };
  },
  methods: {
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
        if (data.indexOf(".")!='-1') {
          if (charCode == 46) {
            evt.preventDefault();
          }
          return true;
        } else {
          return true;
        }
      }
    },
    getItems() {
      ItemDataService.getAll()
        .then((response) => {
          this.items = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateData(index) {
      ItemDataService.create(this.items[index])
        .then((response) => {
          this.getItems();
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteData(id) {
      ItemDataService.delete(id)
        .then((response) => {
          console.log(response.data);
          this.getItems();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addData() {
      ItemDataService.create({
        name: this.name,
        price: this.price,
      })
        .then((response) => {
          console.log(response.data);
          this.getItems();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateAll() {
      console.log(this.items.length);
      for (var item of this.items) {
        ItemDataService.create(item)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        // console.log(item.price);
      }
      this.getItems();
    },
  },
  mounted() {
    this.getItems();
  },
};
</script>