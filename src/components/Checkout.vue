<template>
  <!--Checkout page-->
  <div id="Checkoutpage">
    <!-- Back to the cart page -->
    <i @click="goBack" id="Back" class="fa-solid fa-arrow-left"></i>
    <br>
    <center>
      <!-- Box for a form where user details are asked -->
      <div class="Theform">
        <br>
        <h1>Enter Your Details</h1>
        <br>
        <form @submit.prevent="handleSubmit">
          <!--Input fields for user details-->
          <input id="FName" type="text" placeholder="First Name (Student)*" v-model.trim="fname" required>
          <input id="MName" type="text" placeholder="Middle Name (Student)" v-model.trim="mname">
          <input id="LName" type="text" placeholder="Last Name (Student)*" v-model.trim="lname" required>
          <br><br>
          <input id="StudentID" type="text" placeholder="Student ID (SHSXXXXXX)*" v-model.trim="studentid" required>
          <br><br>
          <input id="Phone" type="text" placeholder="Phone*" v-model.trim="phone" required>
          <br><br>
          <input id="Email" type="email" placeholder="Student Email Address*" v-model.trim="email" required>
          <br><br>
          <input id="Cardnumber" type="text" placeholder="Credit/Debit Card Number*" v-model.trim="cardno" required>
          <input id="CardCVV" type="text" placeholder="CVV*" v-model.trim="cvv" required>
          <br><br>
          Card Expiration Date:
          <input id="Cardexpiry" type="date" placeholder="Expiration Date*" v-model="cardexp" required>
          <br><br><br>
          <!-- Submit button which is disabled if required areas are left empty -->
          <button id="Submitform" type="submit" :disabled="isFormInvalid">Submit</button>
        </form>
      </div>
    </center>
  </div>
</template>

<script>
//Vue instance
export default {
  //Component name
  name: "Checkout-Component",
  //Props called from parent component
  props: ["cart", "totalAmt"],
  //Form data object
  data() {
    return {
      fname: "",
      mname: "",
      lname: "",
      studentid: "",
      phone: "",
      email: "",
      cardno: "",
      cardexp: "",
      cvv: ""
    };
  },
  computed: {
    //Validation of form
    isFormInvalid() {
      return !this.fname || !this.lname || !this.studentid || !this.phone || !this.email || !this.cardno || !this.cardexp || !this.cvv;
    }
  },
  methods: {
    goBack() {
      //Emit event to change component to Cart
      this.$emit("change-component", "Cart");
    },
    handleSubmit() {
      //Check if form is valid
      if (
        this.fname !== "" &&
        this.lname !== "" &&
        this.studentid !== "" &&
        this.phone !== "" &&
        this.email !== "" &&
        this.cardno !== "" &&
        this.cardexp !== "" &&
        this.cvv !== ""
      ) {
        //Construct submission object
        const submission = {
          fname: this.fname,
          mname: this.mname,
          lname: this.lname,
          studentid: this.studentid,
          phone: this.phone,
          email: this.email,
          cardno: this.cardno,
          cardexp: this.cardexp,
          cvv: this.cvv,
          cartitems: this.cart, 
          payment: this.totalAmt 
        };
        //Call the handleFormSubmission method with the submission data
        this.handleFormSubmission(submission);
      } else {
        //Handle invalid form submission
        console.log("Form is invalid. Please fill in all required fields.");
      }
    },
    handleFormSubmission(submission) {
      //Make a POST request to submit the form data
      fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submission)
      })
        .then(response => {
          if (!response.ok) {
            alert("Error");
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          //Handle success response
          alert("Submitted");
          console.log("Order placed successfully:", data);
          //Update lesson space after order submission
          this.cart.forEach(item => {
            this.updateLessonSpace(item._id, item.cartqty);
          });
          //Optionally, perform any other action
        })
        .catch(error => {
          //Handle error
          console.error("Error placing order:", error);
        });
    },
    updateLessonSpace(lessonId, cartQty) {
      //Fetch the lesson details for the given lessonId
      fetch(`http://localhost:3000/collection/Lessons/${lessonId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(lesson => {
          //Calculate the new space value based on the cart quantity
          const newSpaceVal = lesson.space - cartQty;
          //Update the lesson space using a PUT request
          fetch(`http://localhost:3000/collection/Lessons/${lessonId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ space: newSpaceVal })
          })
            .then(response => response.json())
            .then(data => {
              console.log("Lesson space updated successfully: ", data);
            })
            .catch(error => {
              console.error("Error updating lesson space: ", error);
            });
        })
        .catch(error => {
          console.error("ERROR:", error);
        });
    }
  }
};
</script>

<style>
</style>
