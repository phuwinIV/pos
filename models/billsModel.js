import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const billSchema = new Schema(
   {
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
      orderItems: [
         {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            desc: { type: Array },
            product: {
               type: Schema.Types.ObjectId,
               required: true,
               ref: 'Product',
            },
         },
      ],
      itemsPrice: { type: Number, required: true },
      totalPrice: { type: Number, require: true, default: 0.0 },
      taxPrice: { type: Number, require: true },
      subTotal: { type: Number },
      paymentMethod: { type: String, require: true },
      isPaid: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   { timestamps: true }
);

const Bills = mongoose.model('Bills', billSchema);

export default Bills;
