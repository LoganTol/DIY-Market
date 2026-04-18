# ProPlans Blueprint Marketplace - Project brain

## System Architecture & Context
* **Project Name:** ProPlans Blueprint Marketplace
* **Design System:** Home Depot-inspired (Industrial, Bold, Functional)
* **Core Tech:** HTML5, CSS3 (Variables-based), Font Awesome 6.4.0

## Global Styles
The project uses the following CSS variables extracted from `style.css`.

### Colors
* `--primary: #F96302` (The signature Orange)
* `--primary-dark: #d85400`
* `--primary-light: #fff0e5`
* `--text-main: #1C1C1C`
* `--text-muted: #595959`
* `--bg-main: #FFFFFF`
* `--bg-alt: #F4F5F7`
* `--bg-dark: #222222`
* `--border-color: #E2E4E7`

### Typography
* `Outfit`: MUST be used for all headings (`h1`, `h2`, `h3`, `h4`, etc.).
* `Inter`: MUST be used for all body text.

## Component Standards
The following is the standard HTML structure of a "Trending Project" plan card. Use this pattern to replicate future feature additions:

```html
<div class="plan-card">
    <div class="plan-image" style="background-image: url('assets/deck_plan.png');">
        <span class="plan-category">Outdoor</span>
    </div>
    <div class="plan-details">
        <div class="plan-title-row">
            <h3>12x16 Multi-Level Deck</h3>
            <span class="plan-price">$29</span>
        </div>
        <p class="plan-author">by <strong>Mike Builds</strong></p>
        <div class="plan-meta">
            <span><i class="fa-solid fa-star"></i> 4.9 (124)</span>
            <span><i class="fa-solid fa-file-pdf"></i> PDF + Cut List</span>
        </div>
    </div>
</div>
```

## Communication Protocol
* Always provide a technical plan before modifying core CSS files like `style.css`. Wait for the user's approval or implicit agreement before proceeding.

## Rules for the Agent
* **No Redundancy:** Do not create new CSS files; always extend the existing `style.css`.
* **Asset Discipline:** All new images or icons must be referenced relative to the `assets/` folder.
* **Tone:** Maintain a professional, contractor-grade utility aesthetic in all UI additions.
