from __future__ import annotations

import contextlib
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright


PAGES_BASE_PATH = "/practice/quiz-web/"


class _SilentHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return


def _start_server(site_dir: Path) -> tuple[ThreadingHTTPServer, int, threading.Thread]:
    def handler(*args, **kwargs):
        return _SilentHandler(*args, directory=str(site_dir), **kwargs)

    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = int(server.server_address[1])
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, port, thread


def run_interaction_check(site_dir: Path) -> None:
    server, port, _ = _start_server(site_dir)
    base_url = f"http://127.0.0.1:{port}"

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True)
            page = context.new_page()

            page.goto(f"{base_url}{PAGES_BASE_PATH}", wait_until="networkidle")

            page.wait_for_selector("#quiz-topics option", timeout=10000)
            options = page.locator("#quiz-topics option")
            first_count = min(2, options.count())
            for idx in range(first_count):
                options.nth(idx).evaluate("el => el.selected = true")

            page.fill("#quiz-count", "3")
            page.click("#quiz-start")
            page.wait_for_selector("input[name='quiz-option']", timeout=10000)

            for _ in range(3):
                page.locator("input[name='quiz-option']").first.check()
                page.click("#quiz-next")
                page.wait_for_timeout(120)
                page.click("#quiz-next")
                page.wait_for_timeout(120)

            page.wait_for_selector("text=Review Mode", timeout=10000)
            page.click("#quiz-finalize")
            page.wait_for_selector("text=Final Stats", timeout=10000)

            with page.expect_download(timeout=10000):
                page.click("#quiz-export-json")
            with page.expect_download(timeout=10000):
                page.click("#quiz-export-csv")

            share_link = page.locator("#quiz-results a").first.get_attribute("href")
            if not share_link:
                raise RuntimeError("Missing share link in final results")

            context.close()
            browser.close()
    finally:
        with contextlib.suppress(Exception):
            server.shutdown()
        with contextlib.suppress(Exception):
            server.server_close()


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[2]
    run_interaction_check(root / "site")
    print("Quiz interaction E2E passed.")
