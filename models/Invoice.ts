import mongoose, { Schema, model, models } from "mongoose";

const InvoiceSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
        projectId: { type: Schema.Types.ObjectId, ref: "Project" },
        number: { type: String, required: true },
        date: { type: Date, required: true },
        dueDate: { type: Date, required: true },
        items: [
            {
                description: String,
                quantity: Number,
                rate: Number,
                amount: Number
            }
        ],
        total: { type: Number, required: true },
        status: { type: String, enum: ["draft", "sent", "paid", "overdue"], default: "draft" },
        notes: String,
    },
    { timestamps: true }
);

export const Invoice = models.Invoice || model("Invoice", InvoiceSchema);
