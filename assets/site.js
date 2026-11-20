(function () {

    // =========================================================
    // 1. Detect whether the page is inside a sub-folder (annuals/)
    //    Links and images get a "../" prefix in that case.
    // =========================================================

    const isAnnualMeetingPage =
        window.location.pathname.includes("/annuals/");

    // Pages such as 404.html set window.SSCI_ROOT = "/" because they can be shown at any path
    const root = window.SSCI_ROOT || (isAnnualMeetingPage ? "../" : "");


    // =========================================================
    // 2. Navigation menu
    //
    // To add, remove or rename a menu item, edit this block.
    // Each item needs a "page" id that matches the logic in section 6.
    // An item with "children" becomes a dropdown (Events).
    // =========================================================

    const navItems = [
        { label: "Home", href: "index.html", page: "home" },
        { label: "About", href: "about.html", page: "about" },
        { label: "Membership", href: "membership.html", page: "membership" },
        {
            label: "Events",
            href: "annual-meetings.html",
            page: "events",
            children: [
                { label: "Annual Meetings", href: "annual-meetings.html" },
                { label: "Webinars", href: "webinars.html" },
                { label: "Other Events", href: "events.html" }
            ]
        },
        {
            label: "Award",
            href: "young-investigator-award.html",
            page: "award",
            children: [
                { label: "Young Investigator Award", href: "young-investigator-award.html" },
                { label: "Best Presentation and Poster Awards", href: "best-presentation-awards.html" }
            ]
        },
        { label: "Collaboration", href: "collaboration.html", page: "collaboration" },
        { label: "Contact", href: "contacts.html", page: "contacts" }
    ];

    const navListHTML = navItems.map(function (item) {
        if (item.children) {
            const childrenHTML = item.children.map(function (c) {
                return `<li><a href="${root}${c.href}">${c.label}</a></li>`;
            }).join("");

            return `
                <li class="dropdown">
                    <a href="${root}${item.href}" data-page="${item.page}">${item.label}</a>
                    <ul class="dropdown-menu">${childrenHTML}</ul>
                </li>`;
        }

        return `
            <li>
                <a href="${root}${item.href}" data-page="${item.page}">${item.label}</a>
            </li>`;
    }).join("");


    // =========================================================
    // 3. Header (logo, site name, navigation, mobile menu button)
    // =========================================================

    const headerHTML = `
        <a class="skip-link" href="#main-content">Skip to main content</a>
        <header class="site-header">
            <div class="site-header-inner">
                <a class="brand" href="${root}index.html">
                    <img src="${root}assets/SSCI-logo-header.png" alt="SSCI logo">
                    <span class="brand-text">
                        <span class="brand-full">Singapore Section of the Combustion Institute <span class="brand-abbr">(SSCI)</span></span>
                        <span class="brand-short">SSCI</span>
                    </span>
                </a>

                <button class="nav-toggle" type="button"
                        aria-label="Open menu" aria-expanded="false" aria-controls="site-menu">
                    <span></span><span></span><span></span>
                </button>

                <nav class="navigation" id="site-menu" aria-label="Main">
                    <ul>${navListHTML}</ul>
                </nav>
            </div>
        </header>
    `;


    // =========================================================
    // 4. Footer
    //
    // To change the contact email or footer links, edit this block.
    // =========================================================

    const footerHTML = `
        <footer class="site-footer">
            <div class="footer-inner">
                <div class="footer-brand">
                    <strong>Singapore Section of the Combustion Institute</strong>
                    <p>Fostering and promoting research in combustion science in Singapore and beyond.
                       A section of <a href="https://www.combustioninstitute.org" target="_blank" rel="noopener">The Combustion Institute</a>.</p>
                </div>

                <div>
                    <h4>About</h4>
                    <ul class="footer-links">
                        <li><a href="${root}about.html">About the SSCI</a></li>
                        <li><a href="${root}membership.html">Membership</a></li>
                        <li><a href="${root}collaboration.html">Collaboration</a></li>
                        <li><a href="${root}contacts.html">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4>Events and Awards</h4>
                    <ul class="footer-links">
                        <li><a href="${root}annual-meetings.html">Annual Meetings</a></li>
                        <li><a href="${root}webinars.html">Webinars</a></li>
                        <li><a href="${root}events.html">Other Events</a></li>
                        <li><a href="${root}young-investigator-award.html">Young Investigator Award</a></li>
                        <li><a href="${root}best-presentation-awards.html">Best Presentation and Poster Awards</a></li>
                    </ul>
                </div>

                <div>
                    <h4>Contact</h4>
                    <p><a href="mailto:office@ssci-combustion.org">office@ssci-combustion.org</a></p>
                    <p><a href="https://www.linkedin.com/company/singapore-section-of-the-combustion-institute" target="_blank" rel="noopener">SSCI on LinkedIn</a></p>
                    <p><a href="https://www.combustioninstitute.org/index.php" target="_blank" rel="noopener">The Combustion Institute</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; ${new Date().getFullYear()} Singapore Section of the Combustion Institute
            </div>
        </footer>
    `;


    // =========================================================
    // 5. Put header and footer into the page
    //    The navigation lives inside the header, so the old
    //    #site-nav placeholder is left empty.
    // =========================================================

    const headerTarget = document.getElementById("site-header");
    const footerTarget = document.getElementById("site-footer");

    if (headerTarget) {
        headerTarget.innerHTML = headerHTML;
    }

    if (footerTarget) {
        footerTarget.innerHTML = footerHTML;
    }

    // Target for the "Skip to main content" link
    const mainEl = document.querySelector("main");
    if (mainEl && !mainEl.id) {
        mainEl.id = "main-content";
    }


    // =========================================================
    // 6. Work out which menu item is the current page
    // =========================================================

    const path = window.location.pathname.toLowerCase();

    let currentPage = "home";

    if (path.includes("about.html")) {
        currentPage = "about";
    } else if (
        path.includes("events.html") ||
        path.includes("webinars.html") ||
        path.includes("annual-meetings.html") ||
        path.includes("annuals")
    ) {
        currentPage = "events";
    } else if (path.includes("membership.html")) {
        currentPage = "membership";
    } else if (path.includes("young-investigator-award.html") || path.includes("best-presentation-awards.html")) {
        currentPage = "award";
    } else if (path.includes("collaboration.html")) {
        currentPage = "collaboration";
    } else if (path.includes("contacts.html")) {
        currentPage = "contacts";
    }

    const currentNavItem = document.querySelector(
        `[data-page="${currentPage}"]`
    );

    if (currentNavItem) {
        currentNavItem.classList.add("current");
    }


    // =========================================================
    // 7. Mobile menu open / close
    // =========================================================

    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");

    if (header && toggle) {
        toggle.addEventListener("click", function () {
            const open = header.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        // Close the menu after choosing a link
        header.querySelectorAll(".navigation a").forEach(function (a) {
            a.addEventListener("click", function () {
                header.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // =========================================================
    // 8. Protected email addresses
    //    Elements like <span data-email-user="chair" data-email-domain="ssci-combustion"
    //    data-email-tld="org"></span> become a mailto link here, so the full address is not in the page
    //    source (this keeps it away from simple spam crawlers).
    // =========================================================

    document.querySelectorAll("[data-email-user]").forEach(function (el) {
        const address = el.dataset.emailUser + "@" + el.dataset.emailDomain + "." + el.dataset.emailTld;
        const link = document.createElement("a");
        link.href = "mailto:" + address;
        link.textContent = address;
        el.replaceWith(link);
        // The no-JavaScript text next to it is not needed once the link exists
        const fallback = link.parentElement && link.parentElement.querySelector("noscript");
        if (fallback) { fallback.remove(); }
    });

})();
