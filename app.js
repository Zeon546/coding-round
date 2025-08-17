// Event Explorer App JavaScript

class EventExplorer {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.filters = {
            search: '',
            categories: [],
            city: '',
            startDate: '',
            endDate: '',
            minPrice: 0,
            maxPrice: 500,
            minRating: 0,
            eventType: 'all',
            sortBy: 'date'
        };
        
        this.init();
    }

    async init() {
        this.showLoading(true);
        await this.loadEvents();
        this.setupEventListeners();
        this.initializeFilters();
        this.applyFilters();
        this.showLoading(false);
    }

    async loadEvents() {
        try {
            // Load from the provided asset URL
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/218131951eb4309689f5696a8eb7112f/5e8915df-fc63-4bec-8758-8d4deadc33fe/8f2f1299.json');
            const data = await response.json();
            
            // Generate more diverse sample data based on the provided event
            this.events = this.generateSampleData(data);
            this.filteredEvents = [...this.events];
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = this.generateSampleData();
            this.filteredEvents = [...this.events];
        }
    }

    generateSampleData(baseData = []) {
        const categories = ['Music', 'Sports', 'Arts & Culture', 'Technology', 'Food & Drink', 'Networking', 'Family', 'Health & Wellness'];
        const cities = ['Milwaukee', 'Chicago', 'Madison', 'Minneapolis', 'Detroit', 'Cleveland', 'Indianapolis', 'Kansas City'];
        const venues = ['Lincoln Center', 'Convention Center', 'Art Museum', 'Stadium', 'Conference Hall', 'Community Center', 'Park Pavilion', 'Downtown Arena'];
        
        const sampleEvents = [
            ...baseData,
            {
                id: 2,
                name: 'Tech Innovation Summit',
                category: 'Technology',
                subcategory: 'Innovation',
                description: 'Join leading tech innovators for a day of inspiring talks, networking, and hands-on workshops. Learn about the latest trends in AI, blockchain, and emerging technologies.',
                startDateTime: '2025-08-25T09:00:00.000000',
                endDateTime: '2025-08-25T18:00:00.000000',
                venue: { name: 'Tech Center - Chicago', address: '123 Innovation Dr, Chicago', city: 'Chicago', capacity: 500 },
                price: { min: 75, max: 150, currency: 'USD' },
                organizer: 'Tech Events LLC',
                image: 'https://images.unsplash.com/400x300/?technology',
                tags: ['Technology', 'Innovation', 'Networking'],
                attendees: 234,
                rating: 4.7,
                isFeatured: true,
                isOnline: false,
                ageRestriction: 'All Ages',
                contactInfo: { email: 'info@techevents.com', phone: '(555) 123-4567' }
            },
            {
                id: 3,
                name: 'Food & Wine Festival',
                category: 'Food & Drink',
                subcategory: 'Festival',
                description: 'Savor the finest local cuisine and wines from award-winning restaurants and wineries. Experience culinary excellence with live music and entertainment.',
                startDateTime: '2025-09-15T12:00:00.000000',
                endDateTime: '2025-09-15T22:00:00.000000',
                venue: { name: 'Riverside Park - Madison', address: '456 River St, Madison', city: 'Madison', capacity: 2000 },
                price: { min: 0, max: 0, currency: 'USD' },
                organizer: 'Madison Events',
                image: 'https://images.unsplash.com/400x300/?food',
                tags: ['Food', 'Wine', 'Festival'],
                attendees: 1200,
                rating: 4.5,
                isFeatured: true,
                isOnline: false,
                ageRestriction: '21+',
                contactInfo: { email: 'events@madisonparks.com', phone: '(608) 555-0123' }
            },
            {
                id: 4,
                name: 'Virtual Art Workshop',
                category: 'Arts & Culture',
                subcategory: 'Workshop',
                description: 'Learn watercolor techniques from renowned artist Sarah Johnson in this interactive online workshop. All skill levels welcome.',
                startDateTime: '2025-08-30T14:00:00.000000',
                endDateTime: '2025-08-30T16:00:00.000000',
                venue: { name: 'Online Workshop', address: 'Virtual Event', city: 'Online', capacity: 100 },
                price: { min: 25, max: 25, currency: 'USD' },
                organizer: 'Creative Learning Hub',
                image: 'https://images.unsplash.com/400x300/?art',
                tags: ['Art', 'Workshop', 'Online'],
                attendees: 67,
                rating: 4.8,
                isFeatured: false,
                isOnline: true,
                ageRestriction: 'All Ages',
                contactInfo: { email: 'workshops@creative.com', phone: '(555) 987-6543' }
            },
            {
                id: 5,
                name: 'Family Fun Run',
                category: 'Family',
                subcategory: 'Sports',
                description: 'A 5K fun run for the whole family with activities for kids and refreshments for all. Prizes for all participants!',
                startDateTime: '2025-09-07T08:00:00.000000',
                endDateTime: '2025-09-07T12:00:00.000000',
                venue: { name: 'City Park - Minneapolis', address: '789 Park Ave, Minneapolis', city: 'Minneapolis', capacity: 800 },
                price: { min: 15, max: 30, currency: 'USD' },
                organizer: 'Healthy Living Foundation',
                image: 'https://images.unsplash.com/400x300/?running',
                tags: ['Family', 'Sports', 'Health'],
                attendees: 456,
                rating: 4.2,
                isFeatured: false,
                isOnline: false,
                ageRestriction: 'All Ages',
                contactInfo: { email: 'info@healthyliving.org', phone: '(612) 555-7890' }
            },
            {
                id: 6,
                name: 'Jazz Night Live',
                category: 'Music',
                subcategory: 'Jazz',
                description: 'An intimate evening of live jazz featuring local and touring musicians. Experience the smooth sounds of jazz in an authentic setting.',
                startDateTime: '2025-08-28T19:30:00.000000',
                endDateTime: '2025-08-28T23:00:00.000000',
                venue: { name: 'Blue Note Club - Detroit', address: '321 Music St, Detroit', city: 'Detroit', capacity: 200 },
                price: { min: 35, max: 65, currency: 'USD' },
                organizer: 'Motor City Music',
                image: 'https://images.unsplash.com/400x300/?jazz',
                tags: ['Music', 'Jazz', 'Live'],
                attendees: 145,
                rating: 4.6,
                isFeatured: true,
                isOnline: false,
                ageRestriction: '21+',
                contactInfo: { email: 'shows@bluenoteclub.com', phone: '(313) 555-2468' }
            },
            {
                id: 7,
                name: 'Wellness & Meditation Retreat',
                category: 'Health & Wellness',
                subcategory: 'Meditation',
                description: 'A peaceful day retreat focusing on mindfulness, meditation, and holistic wellness practices. Reconnect with your inner self.',
                startDateTime: '2025-09-12T10:00:00.000000',
                endDateTime: '2025-09-12T17:00:00.000000',
                venue: { name: 'Serenity Center - Cleveland', address: '654 Zen Way, Cleveland', city: 'Cleveland', capacity: 150 },
                price: { min: 80, max: 120, currency: 'USD' },
                organizer: 'Mindful Living Institute',
                image: 'https://images.unsplash.com/400x300/?meditation',
                tags: ['Wellness', 'Meditation', 'Retreat'],
                attendees: 89,
                rating: 4.9,
                isFeatured: false,
                isOnline: false,
                ageRestriction: 'All Ages',
                contactInfo: { email: 'retreat@mindful.com', phone: '(216) 555-1357' }
            },
            {
                id: 8,
                name: 'Business Networking Mixer',
                category: 'Networking',
                subcategory: 'Business',
                description: 'Connect with local business professionals in a relaxed atmosphere with appetizers and drinks. Expand your professional network.',
                startDateTime: '2025-08-26T17:30:00.000000',
                endDateTime: '2025-08-26T20:30:00.000000',
                venue: { name: 'Downtown Hotel - Indianapolis', address: '987 Business Blvd, Indianapolis', city: 'Indianapolis', capacity: 300 },
                price: { min: 20, max: 40, currency: 'USD' },
                organizer: 'Professional Network Group',
                image: 'https://images.unsplash.com/400x300/?networking',
                tags: ['Networking', 'Business', 'Professional'],
                attendees: 178,
                rating: 4.1,
                isFeatured: false,
                isOnline: false,
                ageRestriction: '18+',
                contactInfo: { email: 'events@profnetwork.com', phone: '(317) 555-9876' }
            },
            {
                id: 9,
                name: 'Tennis Championship',
                category: 'Sports',
                subcategory: 'Tennis',
                description: 'Watch the finest tennis players compete in this exciting championship tournament. Experience world-class tennis action.',
                startDateTime: '2025-09-20T10:00:00.000000',
                endDateTime: '2025-09-20T18:00:00.000000',
                venue: { name: 'Sports Complex - Kansas City', address: '123 Sports Way, Kansas City', city: 'Kansas City', capacity: 1500 },
                price: { min: 25, max: 75, currency: 'USD' },
                organizer: 'Kansas City Sports',
                image: 'https://images.unsplash.com/400x300/?tennis',
                tags: ['Sports', 'Tennis', 'Championship'],
                attendees: 892,
                rating: 4.4,
                isFeatured: false,
                isOnline: false,
                ageRestriction: 'All Ages',
                contactInfo: { email: 'tennis@kcsports.com', phone: '(816) 555-4321' }
            }
        ];

        return sampleEvents;
    }

    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filters.search = e.target.value;
                this.applyFilters();
            }, 300);
        });

        // Filter toggle (mobile)
        const filterToggle = document.getElementById('filterToggle');
        const filterSidebar = document.getElementById('filterSidebar');
        if (filterToggle && filterSidebar) {
            filterToggle.addEventListener('click', () => {
                filterSidebar.classList.toggle('show');
            });
        }

        // Clear filters
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Category filters
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.filters.categories.push(e.target.value);
                } else {
                    this.filters.categories = this.filters.categories.filter(cat => cat !== e.target.value);
                }
                this.applyFilters();
            });
        });

        // City filter
        const cityFilter = document.getElementById('cityFilter');
        if (cityFilter) {
            cityFilter.addEventListener('change', (e) => {
                this.filters.city = e.target.value;
                this.applyFilters();
            });
        }

        // Date filters
        const startDateFilter = document.getElementById('startDate');
        const endDateFilter = document.getElementById('endDate');
        
        if (startDateFilter) {
            startDateFilter.addEventListener('change', (e) => {
                this.filters.startDate = e.target.value;
                this.applyFilters();
            });
        }

        if (endDateFilter) {
            endDateFilter.addEventListener('change', (e) => {
                this.filters.endDate = e.target.value;
                this.applyFilters();
            });
        }

        // Price range filters
        const minPriceSlider = document.getElementById('minPrice');
        const maxPriceSlider = document.getElementById('maxPrice');
        
        if (minPriceSlider) {
            minPriceSlider.addEventListener('input', (e) => {
                this.filters.minPrice = parseInt(e.target.value);
                this.updatePriceDisplay();
                this.applyFilters();
            });
        }

        if (maxPriceSlider) {
            maxPriceSlider.addEventListener('input', (e) => {
                this.filters.maxPrice = parseInt(e.target.value);
                this.updatePriceDisplay();
                this.applyFilters();
            });
        }

        // Rating filter
        document.querySelectorAll('#ratingFilter .star').forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.filters.minRating = this.filters.minRating === rating ? 0 : rating;
                this.updateRatingDisplay(this.filters.minRating);
                this.applyFilters();
            });
        });

        // Event type filter
        document.querySelectorAll('.event-type-filter').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.eventType = e.target.value;
                this.applyFilters();
            });
        });

        // Sort filter
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const eventModal = document.getElementById('eventModal');
        if (eventModal) {
            eventModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__overlay')) {
                    this.closeModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Close sidebar when clicking outside (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('filterSidebar');
                const toggle = document.getElementById('filterToggle');
                
                if (sidebar && toggle && !sidebar.contains(e.target) && !toggle.contains(e.target) && sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                }
            }
        });
    }

    initializeFilters() {
        // Populate city filter
        const cities = [...new Set(this.events.map(event => event.venue.city))].sort();
        const cityFilter = document.getElementById('cityFilter');
        if (cityFilter) {
            // Clear existing options except the first one
            while (cityFilter.children.length > 1) {
                cityFilter.removeChild(cityFilter.lastChild);
            }
            
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                cityFilter.appendChild(option);
            });
        }

        // Initialize price display
        this.updatePriceDisplay();
        
        // Initialize rating display
        this.updateRatingDisplay(0);
    }

    updatePriceDisplay() {
        const display = document.getElementById('priceRangeDisplay');
        if (display) {
            display.textContent = `$${this.filters.minPrice} - $${this.filters.maxPrice}`;
        }
    }

    updateRatingDisplay(rating) {
        const stars = document.querySelectorAll('#ratingFilter .star');
        const display = document.getElementById('ratingDisplay');
        
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
        
        if (display) {
            display.textContent = rating === 0 ? 'Any Rating' : `${rating}+ Stars`;
        }
    }

    clearFilters() {
        this.filters = {
            search: '',
            categories: [],
            city: '',
            startDate: '',
            endDate: '',
            minPrice: 0,
            maxPrice: 500,
            minRating: 0,
            eventType: 'all',
            sortBy: 'date'
        };

        // Reset form elements
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        document.querySelectorAll('.category-filter').forEach(cb => cb.checked = false);
        
        const cityFilter = document.getElementById('cityFilter');
        if (cityFilter) cityFilter.value = '';
        
        const startDate = document.getElementById('startDate');
        if (startDate) startDate.value = '';
        
        const endDate = document.getElementById('endDate');
        if (endDate) endDate.value = '';
        
        const minPrice = document.getElementById('minPrice');
        if (minPrice) minPrice.value = 0;
        
        const maxPrice = document.getElementById('maxPrice');
        if (maxPrice) maxPrice.value = 500;
        
        const allTypeRadio = document.querySelector('input[name="eventType"][value="all"]');
        if (allTypeRadio) allTypeRadio.checked = true;
        
        const sortBy = document.getElementById('sortBy');
        if (sortBy) sortBy.value = 'date';

        this.updatePriceDisplay();
        this.updateRatingDisplay(0);
        this.applyFilters();
    }

    applyFilters() {
        this.filteredEvents = this.events.filter(event => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                if (!event.name.toLowerCase().includes(searchTerm) && 
                    !event.description.toLowerCase().includes(searchTerm) &&
                    !event.category.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.filters.categories.length > 0) {
                if (!this.filters.categories.includes(event.category)) {
                    return false;
                }
            }

            // City filter
            if (this.filters.city && event.venue.city !== this.filters.city) {
                return false;
            }

            // Date filters
            const eventDate = new Date(event.startDateTime);
            if (this.filters.startDate) {
                const startDate = new Date(this.filters.startDate);
                if (eventDate < startDate) {
                    return false;
                }
            }
            if (this.filters.endDate) {
                const endDate = new Date(this.filters.endDate);
                endDate.setHours(23, 59, 59, 999); // Include the entire end date
                if (eventDate > endDate) {
                    return false;
                }
            }

            // Price filter
            const minPrice = event.price.min || 0;
            if (minPrice < this.filters.minPrice || minPrice > this.filters.maxPrice) {
                return false;
            }

            // Rating filter
            if (event.rating < this.filters.minRating) {
                return false;
            }

            // Event type filter
            if (this.filters.eventType === 'online' && !event.isOnline) {
                return false;
            }
            if (this.filters.eventType === 'in-person' && event.isOnline) {
                return false;
            }

            return true;
        });

        this.sortEvents();
        this.renderEvents();
        this.updateEventsCount();
    }

    sortEvents() {
        this.filteredEvents.sort((a, b) => {
            switch (this.filters.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return (a.price.min || 0) - (b.price.min || 0);
                case 'rating':
                    return b.rating - a.rating;
                case 'date':
                default:
                    return new Date(a.startDateTime) - new Date(b.startDateTime);
            }
        });
    }

    renderEvents() {
        this.renderFeaturedEvents();
        this.renderAllEvents();
    }

    renderFeaturedEvents() {
        const featuredEvents = this.filteredEvents.filter(event => event.isFeatured);
        const container = document.getElementById('featuredCarousel');
        const section = document.getElementById('featuredEvents');
        
        if (!container || !section) return;
        
        if (featuredEvents.length === 0) {
            section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        container.innerHTML = featuredEvents.map(event => this.createEventCard(event, true)).join('');
    }

    renderAllEvents() {
        const container = document.getElementById('eventsGrid');
        const noResults = document.getElementById('noResults');
        
        if (!container || !noResults) return;
        
        if (this.filteredEvents.length === 0) {
            container.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }
        
        noResults.classList.add('hidden');
        container.innerHTML = this.filteredEvents.map(event => this.createEventCard(event, false)).join('');
    }

    createEventCard(event, isFeatured = false) {
        const startDate = new Date(event.startDateTime);
        const formattedDate = startDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const formattedTime = startDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        const priceText = event.price.min === 0 ? 'Free' : 
            event.price.min === event.price.max ? `$${event.price.min}` :
            `$${event.price.min} - $${event.price.max}`;
            
        const stars = '★'.repeat(Math.floor(event.rating)) + '☆'.repeat(5 - Math.floor(event.rating));
        
        const isFavorite = this.favorites.includes(event.id);
        
        return `
            <div class="event-card ${isFeatured ? 'event-card--featured' : ''}" data-event-id="${event.id}">
                <div class="event-card__image">
                    <div class="placeholder-image">📅 Event Image</div>
                    ${event.isFeatured ? '<div class="event-card__badge event-card__badge--featured">Featured</div>' : ''}
                    ${event.isOnline ? '<div class="event-card__badge">Online</div>' : ''}
                </div>
                <div class="event-card__content">
                    <div class="event-card__category">${event.category}</div>
                    <h3 class="event-card__title">${event.name}</h3>
                    <div class="event-card__date">${formattedDate} at ${formattedTime}</div>
                    <div class="event-card__location">
                        ${event.venue.name}, ${event.venue.city}
                        ${event.isOnline ? '<span class="online-indicator">Online Event</span>' : ''}
                    </div>
                    <div class="event-card__footer">
                        <div class="event-card__price">${priceText}</div>
                        <div class="event-card__rating">
                            <span class="event-card__stars">${stars}</span>
                            <span>${event.rating}</span>
                        </div>
                    </div>
                    <div class="event-card__attendees">${event.attendees} attendees</div>
                </div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-event-id="${event.id}" onclick="event.stopPropagation()">♥</button>
            </div>
        `;
    }

    updateEventsCount() {
        const count = this.filteredEvents.length;
        const total = this.events.length;
        const countElement = document.getElementById('eventsCount');
        if (countElement) {
            countElement.textContent = `Showing ${count} of ${total} events`;
        }
    }

    showEventDetail(eventId) {
        const event = this.events.find(e => e.id === parseInt(eventId));
        if (!event) return;

        const startDate = new Date(event.startDateTime);
        const endDate = new Date(event.endDateTime);
        const formattedStartDate = startDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        const formattedTime = `${startDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })} - ${endDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;

        const priceText = event.price.min === 0 ? 'Free' : 
            event.price.min === event.price.max ? `$${event.price.min}` :
            `$${event.price.min} - $${event.price.max}`;

        const stars = '★'.repeat(Math.floor(event.rating)) + '☆'.repeat(5 - Math.floor(event.rating));
        const isFavorite = this.favorites.includes(event.id);

        const modalContent = `
            <div class="event-detail__image">
                <div class="placeholder-image">📅 Event Image</div>
            </div>
            <div class="event-detail__content">
                <div class="event-detail__header">
                    <div class="event-detail__category">${event.category}</div>
                    <h1 class="event-detail__title">${event.name}</h1>
                    <div class="event-detail__rating">
                        <span class="event-detail__stars">${stars}</span>
                        <span>${event.rating} (${event.attendees} attendees)</span>
                    </div>
                </div>
                
                <div class="event-detail__meta">
                    <div class="event-detail__meta-item">
                        <div class="event-detail__meta-label">Date & Time</div>
                        <div class="event-detail__meta-value">${formattedStartDate}<br>${formattedTime}</div>
                    </div>
                    <div class="event-detail__meta-item">
                        <div class="event-detail__meta-label">Location</div>
                        <div class="event-detail__meta-value">
                            ${event.venue.name}<br>
                            ${event.venue.address}<br>
                            ${event.venue.city}
                            ${event.isOnline ? '<br><strong>Online Event</strong>' : ''}
                        </div>
                    </div>
                    <div class="event-detail__meta-item">
                        <div class="event-detail__meta-label">Price</div>
                        <div class="event-detail__meta-value">${priceText}</div>
                    </div>
                    <div class="event-detail__meta-item">
                        <div class="event-detail__meta-label">Organizer</div>
                        <div class="event-detail__meta-value">${event.organizer}</div>
                    </div>
                    <div class="event-detail__meta-item">
                        <div class="event-detail__meta-label">Contact</div>
                        <div class="event-detail__meta-value">
                            ${event.contactInfo.email}<br>
                            ${event.contactInfo.phone}
                        </div>
                    </div>
                    <div class="event-detail__meta-item">
                        <div class="event-detail__meta-label">Age Restriction</div>
                        <div class="event-detail__meta-value">${event.ageRestriction}</div>
                    </div>
                </div>
                
                <div class="event-detail__description">
                    <h3>About This Event</h3>
                    <p>${event.description}</p>
                </div>
                
                <div class="event-detail__actions">
                    <button class="btn btn--primary" onclick="alert('Ticket purchase functionality would be implemented here')">Buy Tickets</button>
                    <button class="btn btn--outline" onclick="alert('Add to calendar functionality would be implemented here')">Add to Calendar</button>
                    <button class="btn btn--outline" onclick="alert('Share functionality would be implemented here')">Share Event</button>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-event-id="${event.id}" onclick="window.app.toggleFavorite(${event.id}); this.textContent = this.classList.contains('active') ? '♥ Remove from Favorites' : '♥ Add to Favorites'">♥ ${isFavorite ? 'Remove from' : 'Add to'} Favorites</button>
                </div>
            </div>
        `;

        const eventDetail = document.getElementById('eventDetail');
        const eventModal = document.getElementById('eventModal');
        
        if (eventDetail && eventModal) {
            eventDetail.innerHTML = modalContent;
            eventModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    closeModal() {
        const eventModal = document.getElementById('eventModal');
        if (eventModal) {
            eventModal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    toggleFavorite(eventId) {
        const id = parseInt(eventId);
        if (this.favorites.includes(id)) {
            this.favorites = this.favorites.filter(favId => favId !== id);
        } else {
            this.favorites.push(id);
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.renderEvents(); // Re-render to update heart icons
        
        // Update modal if it's open
        const eventModal = document.getElementById('eventModal');
        if (eventModal && !eventModal.classList.contains('hidden')) {
            const currentEvent = this.events.find(e => e.id === id);
            if (currentEvent) {
                this.showEventDetail(id); // Refresh the modal
            }
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            if (show) {
                spinner.classList.remove('hidden');
            } else {
                spinner.classList.add('hidden');
            }
        }
    }
}

// Global app instance
let app;

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new EventExplorer();
    window.app = app; // Make it globally accessible for onclick handlers
    
    // Event delegation for event cards and favorite buttons
    document.addEventListener('click', (e) => {
        // Handle event card clicks
        if (e.target.closest('.event-card') && !e.target.closest('.favorite-btn')) {
            const card = e.target.closest('.event-card');
            const eventId = card.dataset.eventId;
            if (eventId) {
                app.showEventDetail(eventId);
            }
        }
        
        // Handle favorite button clicks
        if (e.target.closest('.favorite-btn')) {
            const button = e.target.closest('.favorite-btn');
            const eventId = button.dataset.eventId;
            if (eventId) {
                app.toggleFavorite(eventId);
            }
        }
    });
});