# zhasminangelova.com

Personal portfolio for Zhasmina Angelova, cloud engineer in London. A one-page, hand-built site that tells the story of a career change from hospitality into AWS cloud engineering, in an aurora borealis style with an interactive cloud network.

## Features

- Interactive hero network: draggable "star" nodes for each skill, with a card that explains where each one was used
- Show my path: an animated aurora line that tells the career story in seven steps
- Skill filters for FinOps, Observability, Infrastructure as code, AWS and Code
- Journey timeline that lights up as you scroll
- Flip cards that translate hospitality skills into cloud skills
- Bento grid with small live visuals and an exam countdown
- Interactive architecture diagram and a mini glossary search for the AWS Services Glossary project
- Quick menu (Ctrl K, Cmd K or /) to jump to sections, play the path, copy the email or open profiles
- Scroll progress bar, active section in the menu, cursor light on desktop
- Responsive, keyboard accessible, and respects the reduced motion setting

## Project Structure

```
site/
├── index.html    page content and structure
├── style.css     all styles (base, aurora glass theme, effects)
├── script.js     all interactivity
└── README.md
```

## Code Structure

| Layer | File | What it does |
|-------|------|--------------|
| 1. Content | index.html | Sections: hero, journey, flip cards, what I do, project, toolkit, contact |
| 2. Base styles | style.css | Layout, typography, components |
| 3. Theme | style.css | Aurora glass colours, aurora curtains, stars, glass panels |
| 4. Interaction | script.js | Hero network, path, filters, scroll effects, quick menu, glossary |

## Getting Started

1. Clone the repository:
   `git clone https://github.com/ZhAngelova/zhasminangelova.com.git`
2. Move into the folder:
   `cd zhasminangelova.com`
3. Start a local server:
   `python3 -m http.server 8000`
4. Open `http://localhost:8000` in your browser.

## Usage

- Hero: drag the stars, tap one to read about it, or press Show my path
- Quick menu: press Ctrl K (Windows), Cmd K (Mac) or / and type, for example "path" or "email"
- Journey: scroll down to watch the route light up

## Deployment

Static hosting on AWS: Amazon S3 (private bucket) behind Amazon CloudFront with Origin Access Control, an ACM certificate for HTTPS, and Route 53 for the domain. Infrastructure defined in Terraform, deployed by GitHub Actions using OIDC (no stored AWS keys).

## Built With

- HTML5, CSS3, JavaScript (no frameworks, no build step)
- Canvas API for the hero network
- Google Fonts: Instrument Serif and Instrument Sans

## Author

Zhasmina Angelova
GitHub: https://github.com/ZhAngelova
LinkedIn: https://www.linkedin.com/in/zhasmina-angelova/
