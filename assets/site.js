(function () {

    // =========================================================
    // 1. Detect whether the page is inside a sub-folder (annuals/)
    //    Links and images get a "../" prefix in that case.
    // =========================================================

    const isAnnualMeetingPage =
        window.location.pathname.includes("/annuals/");

    const root = isAnnualMeetingPage ? "../" : "";


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
        { label: "Membership", href: "membership.html", page: "membership" },
        { label: "Award", href: "young-investigator-award.html", page: "award" },
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
                    <h4>Explore</h4>
                    <ul class="footer-links">
                        <li><a href="${root}about.html">About</a></li>
                        <li><a href="${root}annual-meetings.html">Annual Meetings</a></li>
                        <li><a href="${root}membership.html">Membership</a></li>
                        <li><a href="${root}young-investigator-award.html">Young Investigator Award</a></li>
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
    } else if (path.includes("young-investigator-award.html")) {
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

})();
