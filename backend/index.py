"""ASGI entry for Vercel (re-exports the FastAPI app from main)."""

from main import app

__all__ = ["app"]
