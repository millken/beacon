# State coverage (final run)

| Family | Light | Dark | Mean diff | Range | Geometry checks |
|---|---:|---:|---:|---:|---|
| Button | 10 | 10 | 5.879% | 2.361%–13.48% | PASS |
| Slim Button | 5 | 5 | 6.03% | 2.623%–7.6% | PASS |
| Checkbox | 15 | 15 | 6.825% | 1.225%–17.245% | PASS |
| Input Field | 5 | 5 | 1.913% | 0.223%–11.792% | PASS |
| Toggle | 2 | 2 | 5.307% | 3.585%–7.736% | PASS |
| Combobox | 5 | 5 | 2.663% | 0.513%–12.611% | PASS |
| Dropdown | 5 | 5 | 2.143% | 0.402%–12.035% | PASS |
| Link | 9 | 9 | 4.609% | 1.852%–9.206% | PASS |
| Radio Button | 10 | 10 | 9.962% | 2.163%–23.611% | PASS |
| Search | 4 | 4 | 2.235% | 0.664%–11.814% | PASS |
| Tab | 3 | 3 | 4.99% | 4.626%–5.355% | PASS |
| Segmented Control | 3 | 3 | 7.608% | 2.044%–16.553% | PASS |
| Banner | 8 | 8 | 3.451% | 1.215%–9.162% | PASS |
| Alert | 1 | 1 | 9.563% | 9.392%–9.735% | PASS |
| Dialog | 1 | 1 | 3.224% | 3.182%–3.265% | FAIL: dialog, dialog-dark |

Every extracted state master has a matching native Pixso PNG and is embedded in the documentation. On/off duplicate aliases share their exact measured node and reference. Remaining pixel differences are reported in `diff/report.json`; no `needs-fix` state is described as visually exact.
