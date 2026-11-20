import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class RuneHallTests(unittest.TestCase):

    def test_dashboard_exists(self):
        html = (ROOT / "index.html").read_text()
        self.assertIn('id="runeHall"', html)
        self.assertIn('id="masteredCount"', html)
        self.assertIn('id="masteryBar"', html)

    def test_copy_button_exists(self):
        html = (ROOT / "index.html").read_text()
        self.assertIn('id="copyRunes"', html)

    def test_script_loaded(self):
        html = (ROOT / "index.html").read_text()
        self.assertIn('src="rune-hall.js"', html)

    def test_mastery_logic_exists(self):
        js = (ROOT / "rune-hall.js").read_text()
        self.assertIn("runeMastery", js)
        self.assertIn("updateHall", js)
        self.assertIn("masteredCount", js)

    def test_existing_modes_preserved(self):
        html = (ROOT / "index.html").read_text()
        for mode in ("learn","draw","spell"):
            self.assertIn(
                f'data-tab="{mode}"',html
            )

if __name__ == "__main__":
    unittest.main()
