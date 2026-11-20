import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class RuneAppTests(unittest.TestCase):

    def test_all_files_exist(self):
        for name in ("index.html","style.css","app.js"):
            self.assertTrue((ROOT/name).is_file())

    def test_rune_count(self):
        js = (ROOT/"app.js").read_text()
        block = js.split("const runes = [",1)[1]
        block = block.split("];",1)[0]
        entries = re.findall(
            r'^\s*\["[ᚠ-ᛟ]',
            block,
            re.MULTILINE
        )
        self.assertEqual(len(entries),24)

    def test_canvas_and_modes(self):
        html = (ROOT/"index.html").read_text()
        for expected in (
            'id="pad"',
            'id="learn"',
            'id="draw"',
            'id="spell"'
        ):
            self.assertIn(expected,html)

    def test_no_external_dependencies(self):
        html = (ROOT/"index.html").read_text()
        self.assertNotIn("https://",html)
        self.assertNotIn("http://",html)

if __name__ == "__main__":
    unittest.main()
