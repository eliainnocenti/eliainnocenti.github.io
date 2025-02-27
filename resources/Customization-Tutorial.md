# Personal Website Customization Tutorial  
*Using the Academic Pages Template for GitHub Pages*

In this tutorial, you'll learn how to customize the Academic Pages template to create a personal website. We cover every aspect you can modify, how to update configurations and content, and whether to remove or simply comment out unused features. Follow the sections below for a detailed guide.

---

## 1. Global Configuration

### _config.yml
- **Objective:** Define site-wide settings such as the title, description, URL, theme, and plugins.
- **What to Modify:**
  - Site title and description.
  - URL settings (`baseurl`, `url`).
  - Social media links and other metadata.
- **How to Modify:**
  - Open `_config.yml` in your editor and update the YAML keys.  
    **Example:**
    ```yaml
    title: "John Doe's Website"
    description: "Welcome to my personal site."
    baseurl: ""
    url: "https://johndoe.github.io"
    social:
      twitter: "https://twitter.com/johndoe"
      github: "https://github.com/johndoe"
    ```
- **Removal/Commenting:**  
  - If you are not using certain features (e.g., comments), you can comment out the related lines by adding `#` in front of them, or remove them entirely if you're sure they won't be referenced elsewhere.

### _config_docker.yml
- **Objective:** Configure settings for Docker-based development.
- **What to Modify:**  
  - Update parameters if you plan to use Docker for local development.
- **How to Modify:**  
  - Edit the file as needed.
- **Removal/Commenting:**  
  - If you don’t plan to use Docker, you can either ignore or delete this file to simplify your repository.

---

## 2. Data Files and Static Content (_data)

### _data/authors.yml
- **Objective:** Store author details like name, bio, avatar, and social links.
- **What to Modify:**
  - Replace the sample data with your own personal information.
- **Example:**
  ```yaml
  - id: johndoe
    name: "John Doe"
    bio: "A passionate developer and designer."
    avatar: "/images/profile.png"
    social:
      linkedin: "https://linkedin.com/in/johndoe"
  ```

### _data/navigation.yml
- **Objective:** Define the navigation menu of your website.
- **What to Modify:**
  - Customize the list of menu items (add, remove, or rename items).
- **Example:**
  ```yaml
  - title: "About"
    url: /about/
  - title: "Portfolio"
    url: /portfolio/
  - title: "Blog"
    url: /blog/
  ```

### _data/ui-text.yml
- **Objective:** Personalize UI text such as labels, buttons, and prompts.
- **What to Modify:**
  - Update the strings to match your preferred language or tone.
- **Example:**
  ```yaml
  read_more: "Read More"
  contact: "Contact Me"
  ```

### _data/comments/ (and subdirectories)
- **Objective:** Manage data for comment systems.
- **What to Modify:**
  - Use these files if you plan to enable comments on your posts or pages.
- **Removal/Commenting:**  
  - If you’re not using comments, you can remove the entire `_data/comments` folder or disable comments via the settings in `_config.yml`.

---

## 3. Pages and Content (_pages)

- **Objective:** Store the main content pages of your website (e.g., About, CV, Portfolio, 404).
- **What to Modify:**
  - Update the content in each Markdown or HTML file to reflect your personal information.
- **Example:**
  - In `about.md`, update the biography:
    ```markdown
    ---
    title: "About Me"
    layout: default
    ---

    Hi, I'm John Doe, a web developer with a passion for design and innovation.
    ```
- **Removal/Commenting:**  
  - Delete pages that you don't need (such as `teaching.md` or `talks.md`) and remove their corresponding entries in `_data/navigation.yml` for a cleaner menu.
  - Alternatively, you can comment out the content temporarily if you're not yet ready to delete it.

---

## 4. Blog and Posts (_posts)

- **Objective:** Manage blog posts.
- **What to Modify:**
  - Create new posts or update existing ones following the naming convention `YYYY-MM-DD-title.md`.
- **Example:**
  - Create `_posts/2025-03-01-my-first-post.md` with:
    ```markdown
    ---
    title: "My First Blog Post"
    date: 2025-03-01
    layout: post
    ---

    Welcome to my blog!
    ```
- **Removal/Commenting:**  
  - If you decide not to maintain a blog, remove the sample posts in the `_posts` folder and update your navigation menu accordingly.

---

## 5. Portfolio (_portfolio)

- **Objective:** Showcase your projects.
- **What to Modify:**
  - Update the Markdown/HTML files with details, images, and links for your projects.
- **Example:**
  - In `_portfolio/portfolio-1.md`:
    ```markdown
    ---
    title: "Project One"
    date: 2025-02-20
    image: "/images/project1.png"
    url: "https://projectone.example.com"
    ---

    Description of Project One.
    ```
- **Removal/Commenting:**  
  - If you’re not using a portfolio section, delete the entire `_portfolio` folder and remove related links from your navigation menu.

---

## 6. Publications (_publications)

- **Objective:** List your academic publications.
- **What to Modify:**
  - Fill in your publication details in the provided Markdown files.
- **Example:**
  - In `_publications/2024-02-17-paper-title-number-4.md`:
    ```markdown
    ---
    title: "An Innovative Research Paper"
    date: 2024-02-17
    journal: "Journal of Innovations"
    ---

    Abstract and further details about the publication.
    ```
- **Removal/Commenting:**  
  - Remove this folder if you don’t have publications to display, and update `_data/navigation.yml` accordingly.

---

## 7. Talks and Teaching (_talks, _teaching)

- **Objective:** Present details of your talks, presentations, or teaching experiences.
- **What to Modify:**
  - Edit the Markdown files with event details.
- **Example:**
  - In `_talks/2014-03-01-talk-3.md`:
    ```markdown
    ---
    title: "Talk on Web Development"
    date: 2014-03-01
    ---

    Details about the talk.
    ```
- **Removal/Commenting:**  
  - If these sections are not applicable, delete the `_talks` and `_teaching` folders and update your navigation links.

---

## 8. Layouts and Includes

### _layouts

- **Objective:** Define the structural templates for your pages.
- **What to Modify:**
  - Edit HTML and Liquid tags to change the layout (e.g., header, footer, sidebar).
- **Example:**
  - In `_layouts/default.html`:
    ```html
    <!DOCTYPE html>
    <html>
    <head>
        {% include head.html %}
    </head>
    <body>
        {% include nav_list.html %}
        {{ content }}
        {% include footer.html %}
    </body>
    </html>
    ```
- **Removal/Commenting:**  
  - You can comment out sections if you wish to temporarily disable parts of the layout. However, for long-term maintenance, it's better to remove unused code.

### _includes

- **Objective:** Store reusable components like headers, footers, navigation menus, and analytics scripts.
- **What to Modify:**
  - Update the components to fit your design and content.
- **Example:**
  - In `_includes/footer.html`:
    ```html
    <footer>
        <p>&copy; 2025 John Doe. All rights reserved.</p>
    </footer>
    ```
- **Removal/Commenting:**  
  - Remove or comment out includes that pertain to features you’re not using (e.g., analytics).

---

## 9. Styles and Scripts

### SCSS and CSS (_sass and assets/css)

- **Objective:** Customize the visual style of your website.
- **What to Modify:**
  - Change variables, mixins, and layout rules to update colors, fonts, and spacing.
- **Example:**
  - In `_sass/theme/_default.scss`, update a color variable:
    ```scss
    $primary-color: #3498db;
    ```
- **Removal/Commenting:**  
  - It’s often better to comment out unused style blocks during testing and remove them once you confirm they are unnecessary.

### JavaScript (assets/js)

- **Objective:** Manage interactive behavior.
- **What to Modify:**
  - Customize existing functions or add new ones.
- **Example:**
  - In `assets/js/_main.js`, modify a navigation toggle function:
    ```javascript
    function toggleNavigation() {
        // Custom toggle logic here
    }
    ```
- **Removal/Commenting:**  
  - Delete unused script files and ensure that references to them in HTML files (or includes) are also removed.

---

## 10. Media Files (images, fonts, etc.)

- **Objective:** Replace default images, logos, and icons with your own.
- **What to Modify:**
  - Update files in the `images/` and `assets/fonts/` directories.
- **Example:**
  - Replace `images/profile.png` with your own picture and update `_data/authors.yml` accordingly.
- **Removal/Commenting:**  
  - Delete any images or media files that you do not need to keep your repository lean.

---

## 11. Development Tools and Extras

### Docker Files (Dockerfile, docker-compose.yaml)

- **Objective:** Facilitate container-based local development.
- **What to Modify:**
  - Update Docker configurations if you plan to use them.
- **Removal/Commenting:**  
  - If Docker is not part of your workflow, remove these files to simplify the repository.

### Markdown Generator (markdown_generator)

- **Objective:** Automate creation of pages (e.g., publications, talks) from TSV files or notebooks.
- **What to Modify:**
  - Customize or run the scripts as needed.
- **Removal/Commenting:**  
  - Delete the `markdown_generator` folder if you’re not planning to use automated markdown generation.

### Talkmap

- **Objective:** Visualize the geographical distribution of your talks.
- **What to Modify:**
  - Adjust the provided scripts if you need this feature.
- **Removal/Commenting:**  
  - Remove the `talkmap` folder and related files (e.g., `talkmap.ipynb`, `talkmap.py`) if this feature isn’t required.

---

## 12. Dependencies and Documentation

### Gemfile

- **Objective:** Manage Ruby dependencies for building your Jekyll site.
- **What to Modify:**
  - Update gem versions if necessary.
- **Example:**
  - 
    ```ruby
    gem "jekyll", "~> 4.2.0"
    gem "github-pages", group: :jekyll_plugins
    ```
- **Removal/Commenting:**  
  - **Do not remove the Gemfile**; it is essential for site generation.

### README.md and CONTRIBUTING.md

- **Objective:** Provide documentation and guidelines for your project.
- **What to Modify:**
  - Update the text to reflect your project’s details.
- **Removal/Commenting:**  
  - These files don’t affect site functionality. Update them for clarity.

### LICENSE

- **Objective:** Declare the license for your project.
- **What to Modify:**
  - Change the license text if you wish to use a different license.
- **Removal/Commenting:**  
  - It’s best to keep a license file for legal clarity.

---

## Conclusion

This tutorial has provided a deep dive into every customizable part of the Academic Pages template. The general recommendations are:
- **Modify:** Update configuration files, content, and styles to reflect your personal information.
- **Remove:** Eliminate entire folders or files for features you don’t plan to use (e.g., Docker, Talkmap, blog posts).
- **Comment:** Temporarily disable code if you’re unsure; however, aim to clean up unused code for long-term maintenance.

Save this file (for example, as `CUSTOMIZATION_TUTORIAL.md`) in your repository to reference as you build your personalized website.
