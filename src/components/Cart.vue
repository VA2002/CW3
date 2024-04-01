<template>
  <div>
    <div id="Cartpage">
      <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <i
        @click="goBack"
        id="Back"
        class="fa-solid fa-arrow-left"
      ></i>
      <br>
      <div class="Cartitems">
        <br>
        <center>
          <h1>Your Cart</h1>
        </center>
        <!-- Render cart items -->
        <div v-if="cart && cart.length > 0">
          <div v-for="cartItem in cart" :key="cartItem._id" class="CartItem">
            <button class="Delete" @click="deleteFromCart(cartItem)">
              <i id="Trash" class="fa-solid fa-trash"></i>
            </button>
            <div class="Classesincart">
              <br>
              <div class="Cartsubject">
                &nbsp;&nbsp;
                <b>{{ cartItem.name }}</b>
              </div>
              <div class="Qty">
                &nbsp;&nbsp;&nbsp;&nbsp;
                <b>Qty:</b>
                <button id="Qtydown" :disabled="cartItem.cartqty === 1" @click="decQty(cartItem)">-</button>
                {{ cartItem.cartqty }}
                <button
                  id="Qtyup"
                  :disabled="cartItem.cartqty === 5"
                  @click="incQty(cartItem)"
                >+</button>
              </div>
              <div class="Cartprice">
                &nbsp;&nbsp;&nbsp;&nbsp;
                <b>Price:</b>
                £{{ cartItem.price * cartItem.cartqty }}
              </div>
              <br>
            </div>
          </div>
        </div>
        <!-- If cart is empty, display a message -->
        <div v-else>
          <br>
          <br>
          <center>
            <p style="font-size: 25px;">Uh oh! Looks like your cart is empty</p>
            <p style="font-size: 20px;">Add items to the cart to display them here</p>
          </center>
        </div>
      </div>
    </div>
    <div class="Total">
      <br>&nbsp;&nbsp;
      <b>To be paid&nbsp;:</b>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      £ {{totalAmt}}
      <br>
      <br>
      <br>
      <br>
      <center>
        <!-- Disable the button when cart is empty -->
        <button id="Checkoutbutton" @click="handleCheckoutButtonClick" :disabled="isCartEmpty">
          <i class="fa-solid fa-cash-register"></i>&nbsp;&nbsp;Checkout
        </button>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cart-Component",
  props: ["cart", "totalAmt"],

  methods: {
    goBack() {
      // Emit event to switch to Lesson component
      this.$emit("change-component", "Lesson");
    },
    incQty(cartItem) {
      if (cartItem.cartqty < 5 && cartItem.space > 0) {
        cartItem.cartqty++;
        cartItem.space--;
        // Emit an event to notify the parent component (App.vue) about the change in cart
        this.$emit("update-cart", this.cart);
        this.$emit("update-total", this.calculateTotalAmt());
      }
    },
    decQty(cartItem) {
      if (cartItem.cartqty > 1) {
        cartItem.cartqty--;
        cartItem.space++;
        // Emit an event to notify the parent component (App.vue) about the change in cart
        this.$emit("update-cart", this.cart);
        this.$emit("update-total", this.calculateTotalAmt());
      }
    },

    handleCheckoutButtonClick() {
      // Emit event to switch to Checkout component
      this.$emit("change-component", "Checkout");
    },
    deleteFromCart(cartItem) {
      // Implement logic to delete item from cart
      // Emit event or perform any other necessary action
      console.log(cartItem);
      this.$emit("delete-from-cart", cartItem);
      // Calculate the total amount after deleting the item
      const newTotalAmt = this.calculateTotalAmt();
      // Emit an event to notify the parent component (App.vue) about the change in totalAmt
      this.$emit("update-total", newTotalAmt);
    },
    calculateTotalAmt() {
      return this.cart.reduce(
        (total, cartItem) => total + cartItem.price * cartItem.cartqty,
        0
      );
    },
    dynamicTotalAmt() {
      return this.cart.reduce(
        (total, cartItem) => total + cartItem.price * cartItem.cartqty,
        0
      );
    }
  },
  computed: {
    isCartEmpty() {
      return !this.cart || this.cart.length === 0;
    }
  },
  watch: {
    // Watch for changes in the cart prop and update totalAmt accordingly
    cart: {
      handler: function() {
        // Emit event to notify parent about the change in totalAmt
        this.$emit("update-total", this.dynamicTotalAmt());
      },
      deep: true // Watch for changes in nested properties of cart items
    }
  }
};
</script>

<style>
/* Your styles here */
</style>
