(function () {

    // =========================================================
    // 1. 判断当前页面是否位于子目录
    // =========================================================

    const isAnnualMeetingPage =
        window.location.pathname.includes("/annuals/");

    const root = isAnnualMeetingPage ? "../" : "";


    // =========================================================
    // 2. 公共 Header
    //    完全保持原网站的 HTML 结构和 class
    // =========================================================

    const headerHTML = `
        <header class="banner-container">
            <img
                src="${root}assets/SSCI-logo.png"
                alt="SSCI Logo"
                class="banner-logo left"
            >

            <img
                src="${root}assets/singapore_p3.jpg"
                alt="Singapore Skyline Banner"
                class="banner"
            >

            <div class="overlay-text">
                Singapore Section of the Combustion Institute
            </div>

            <img
                src="${root}assets/CI-logo.png"
                alt="Combustion Institute Logo"
                class="banner-logo right"
            >
        </header>
    `;


    // =========================================================
    // 3. 公共 Navigation
    //
    // 以后新增/删除主栏目、子栏目，主要改这里
    // =========================================================

    const navigationHTML = `
        <nav class="navigation">
            <ul>

                <li>
                    <a href="${root}index.html" data-page="home">
                        Home
                    </a>
                </li>

                <li>
                    <a href="${root}about.html" data-page="about">
                        About
                    </a>
                </li>

                <li class="dropdown">

                    <a
                        href="javascript:void(0);"
                        data-page="events"
                    >
                        Events
                    </a>
                
                    <ul class="dropdown-menu">
                
                        <li>
                            <a href="${root}events.html#upcoming">
                                Upcoming Events
                            </a>
                        </li>
                
                        <li>
                            <a href="${root}events.html#past">
                                Past Events
                            </a>
                        </li>
                
                    </ul>
                
                </li>

                <li>
                    <a href="${root}membership.html" data-page="membership">
                        Membership
                    </a>
                </li>

                <li class="dropdown">

                    <a
                        href="javascript:void(0);"
                        data-page="collaboration"
                    >
                        Collaboration
                    </a>

                    <ul class="dropdown-menu">

                        <li>
                            <a href="${root}collaboration.html">
                                Young Researcher Exchange Programme
                            </a>
                        </li>

                    </ul>

                </li>

                <li>
                    <a href="${root}contacts.html" data-page="contacts">
                        Contact
                    </a>
                </li>

            </ul>
        </nav>
    `;


    // =========================================================
    // 4. 公共 Footer
    // =========================================================

    const footerHTML = `
        <footer>
            &copy; Singapore Section of the Combustion Institute
        </footer>
    `;


    // =========================================================
    // 5. 把 Header / Navigation / Footer 放入网页
    // =========================================================

    const headerTarget = document.getElementById("site-header");
    const navTarget = document.getElementById("site-nav");
    const footerTarget = document.getElementById("site-footer");


    if (headerTarget) {
        headerTarget.innerHTML = headerHTML;
    }

    if (navTarget) {
        navTarget.innerHTML = navigationHTML;
    }

    if (footerTarget) {
        footerTarget.innerHTML = footerHTML;
    }


    // =========================================================
    // 6. 自动判断当前页面
    // =========================================================

    const path = window.location.pathname.toLowerCase();

    let currentPage = "home";


    if (path.includes("about.html")) {

        currentPage = "about";

    } else if (
        path.includes("events.html") ||
        path.includes("annuals")
    ) {

        currentPage = "events";

    } else if (path.includes("membership.html")) {

        currentPage = "membership";

    } else if (path.includes("collaboration.html")) {

        currentPage = "collaboration";

    } else if (path.includes("contacts.html")) {

        currentPage = "contacts";

    }


    // =========================================================
    // 7. 自动给当前栏目添加 current
    // =========================================================

    const currentNavItem = document.querySelector(
        `[data-page="${currentPage}"]`
    );

    if (currentNavItem) {
        currentNavItem.classList.add("current");
    }

})();