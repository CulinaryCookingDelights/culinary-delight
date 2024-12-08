// Footer Component
class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="footer-content">
                    <div class="footer-branding">
                        <h3>Culinary Delight</h3>
                        <p class="footer-tagline">Bringing the joy of cooking to your kitchen</p>
                        <div class="footer-social">
                            <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <div class="footer-links-section">
                        <div class="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="recipes.html">Recipes</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Cookbook</a></li>
                            </ul>
                        </div>
                        <div class="footer-links">
                            <h4>Categories</h4>
                            <ul>
                                <li><a href="#">Main Course</a></li>
                                <li><a href="#">Appetizers</a></li>
                                <li><a href="#">Desserts</a></li>
                                <li><a href="#">Soups</a></li>
                                <li><a href="#">Salads</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="footer-copyright">
                    <p>&copy; 2024 Culinary Delights. All rights reserved.</p>
                </div>
            </footer>
        `;
    }
}

customElements.define('site-footer', Footer);
