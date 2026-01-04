import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { Client } from "@/models/Client";
import { Project } from "@/models/Project";
import { Milestone } from "@/models/Milestone";
import { Invoice } from "@/models/Invoice";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectToDatabase();

        // Check if demo user exists
        let user = await User.findOne({ email: "demo@example.com" });

        if (!user) {
            const passwordHash = await bcrypt.hash("password", 10);
            user = await User.create({
                name: "Demo Freelancer",
                email: "demo@example.com",
                passwordHash,
            });
        }

        // Create Clients
        const client1 = await Client.create({
            userId: user._id,
            name: "Acme Corp",
            company: "Acme Inc.",
            email: "contact@acme.com",
            phone: "+1 555 0199",
            notes: "Big enterprise client. Likes blue.",
        });

        const client2 = await Client.create({
            userId: user._id,
            name: "Startup Studio",
            company: "Studio X",
            email: "hello@studio.x",
            notes: "Fast paced, pays in crypto (kidding, USD).",
        });

        // Create Projects
        const project1 = await Project.create({
            userId: user._id,
            clientId: client1._id,
            title: "Corporate Website Redesign",
            status: "active",
            startDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
            paymentType: "fixed",
            scope: "Full redesign of the corporate marketing site.",
        });

        const project2 = await Project.create({
            userId: user._id,
            clientId: client2._id,
            title: "Mobile App MVP",
            status: "active",
            startDate: new Date(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 days
            paymentType: "hourly",
            scope: "MVP for the new social app.",
        });

        // Create Milestones
        await Milestone.create({
            projectId: project1._id,
            title: "Wireframes",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            status: "completed",
        });

        await Milestone.create({
            projectId: project1._id,
            title: "Visual Design",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: "pending",
        });

        await Milestone.create({
            projectId: project2._id,
            title: "Core API Setup",
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            status: "pending",
        });

        // Create Invoices
        await Invoice.create({
            projectId: project1._id,
            amount: 5000,
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            status: "sent",
            notes: "50% Upfront",
        });

        await Invoice.create({
            projectId: project2._id,
            amount: 1200,
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue
            status: "overdue",
            notes: "Weekly Sprint 1",
        });

        return NextResponse.json({ message: "Seed successful", user: "demo@example.com", password: "password" });
    } catch (error) {
        return NextResponse.json({ error: "Seed failed", details: error }, { status: 500 });
    }
}
