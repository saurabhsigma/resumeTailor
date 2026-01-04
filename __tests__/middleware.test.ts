
import { middleware, config } from "../middleware";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({
    decrypt: jest.fn(),
}));

jest.mock("next/server", () => {
    const actual = jest.requireActual("next/server");
    return {
        ...actual,
        NextResponse: {
            next: jest.fn(() => ({ type: "next" })),
            redirect: jest.fn((url) => ({ type: "redirect", url })),
        },
    };
});

describe("Middleware", () => {
    let mockRequest: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            nextUrl: { pathname: "/" },
            cookies: { get: jest.fn() },
            url: "http://localhost:3000",
        };
    });

    it("should allow public access to root path", async () => {
        mockRequest.nextUrl.pathname = "/";
        await middleware(mockRequest as NextRequest);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("should allow public access to login path", async () => {
        mockRequest.nextUrl.pathname = "/login";
        await middleware(mockRequest as NextRequest);
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it("should redirect unauthenticated user from protected path", async () => {
        mockRequest.nextUrl.pathname = "/projects";
        await middleware(mockRequest as NextRequest);
        expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({ pathname: "/login" }));
    });

    it("should redirect authenticated user from login to projects", async () => {
        mockRequest.nextUrl.pathname = "/login";
        mockRequest.cookies.get.mockReturnValue({ value: "valid-session" });
        (decrypt as jest.Mock).mockResolvedValue({ user: { id: "123" } });

        await middleware(mockRequest as NextRequest);
        expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({ pathname: "/projects" }));
    });
});
