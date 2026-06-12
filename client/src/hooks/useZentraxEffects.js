import { useEffect } from "react";
import MODAL_DATA from "../data/propertyModalData";

function useZentraxEffects() {
	useEffect(() => {
		const cleanupFns = [];
		const observers = [];

		const loader = document.getElementById("loader");
		document.body.classList.add("loading");
		const loaderTimer = window.setTimeout(() => {
			if (loader) {
				loader.classList.add("hidden");
			}
			document.body.classList.remove("loading");
			revealInit();
		}, 2400);
		cleanupFns.push(() => window.clearTimeout(loaderTimer));

		const navbar = document.getElementById("navbar");
		const navLinks = document.querySelectorAll(".nav-links a");
		const sections = document.querySelectorAll("section[id]");

		const updateActiveNav = () => {
			let current = "";
			sections.forEach((sec) => {
				if (window.scrollY >= sec.offsetTop - 120) {
					current = sec.getAttribute("id") || "";
				}
			});

			navLinks.forEach((a) => {
				a.classList.remove("active");
				if (a.getAttribute("href") === `#${current}`) {
					a.classList.add("active");
				}
			});
		};

		const onScroll = () => {
			if (navbar) {
				if (window.scrollY > 60) {
					navbar.classList.add("scrolled");
				} else {
					navbar.classList.remove("scrolled");
				}
			}
			updateActiveNav();
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		cleanupFns.push(() => window.removeEventListener("scroll", onScroll));

		const hamburger = document.getElementById("hamburger");
		const mobileMenu = document.getElementById("mobileMenu");
		const onHamburgerClick = () => {
			if (mobileMenu) {
				mobileMenu.classList.toggle("open");
			}
		};

		if (hamburger) {
			hamburger.addEventListener("click", onHamburgerClick);
			cleanupFns.push(() => hamburger.removeEventListener("click", onHamburgerClick));
		}

		const mobileHandlers = [];
		if (mobileMenu) {
			mobileMenu.querySelectorAll("a").forEach((a) => {
				const closeMenu = () => mobileMenu.classList.remove("open");
				a.addEventListener("click", closeMenu);
				mobileHandlers.push(() => a.removeEventListener("click", closeMenu));
			});
		}
		cleanupFns.push(() => mobileHandlers.forEach((fn) => fn()));

		const smoothAnchorHandlers = [];
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			const handler = (e) => {
				const href = anchor.getAttribute("href");
				if (!href) {
					return;
				}
				const target = document.querySelector(href);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			};

			anchor.addEventListener("click", handler);
			smoothAnchorHandlers.push(() => anchor.removeEventListener("click", handler));
		});
		cleanupFns.push(() => smoothAnchorHandlers.forEach((fn) => fn()));

		function revealInit() {
			const reveals = document.querySelectorAll(".reveal");
			const revealObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const parent = entry.target.parentElement;
							if (!parent) {
								entry.target.classList.add("visible");
								revealObserver.unobserve(entry.target);
								return;
							}

							const siblings = Array.from(parent.querySelectorAll(".reveal:not(.visible)"));
							const idx = siblings.indexOf(entry.target);
							window.setTimeout(() => {
								entry.target.classList.add("visible");
							}, Math.min(idx * 80, 400));
							revealObserver.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
			);

			reveals.forEach((el) => revealObserver.observe(el));
			observers.push(revealObserver);
		}

		const animateCounter = (el) => {
			const target = parseInt(el.dataset.target || "0", 10);
			const duration = 1800;
			const start = performance.now();

			const step = (now) => {
				const elapsed = now - start;
				const progress = Math.min(elapsed / duration, 1);
				const ease = 1 - Math.pow(1 - progress, 3);
				el.textContent = String(Math.floor(ease * target));
				if (progress < 1) {
					requestAnimationFrame(step);
				} else {
					el.textContent = String(target);
				}
			};

			requestAnimationFrame(step);
		};

		const counterObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animateCounter(entry.target);
						counterObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.5 },
		);

		document.querySelectorAll(".stat-num, .hstat-num").forEach((el) => counterObserver.observe(el));
		observers.push(counterObserver);

		const track = document.getElementById("testiTrack");
		const dots = document.querySelectorAll(".dot");
		const prevBtn = document.getElementById("testPrev");
		const nextBtn = document.getElementById("testNext");
		const totalSlides = document.querySelectorAll(".testi-card").length;
		let currentSlide = 0;
		let autoplay;

		const goToSlide = (n) => {
			if (!track || totalSlides === 0) {
				return;
			}
			currentSlide = (n + totalSlides) % totalSlides;
			track.style.transform = `translateX(-${currentSlide * 100}%)`;
			dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
		};

		const startAutoplay = () => {
			autoplay = window.setInterval(() => goToSlide(currentSlide + 1), 5000);
		};

		const resetAutoplay = () => {
			if (autoplay) {
				window.clearInterval(autoplay);
			}
			startAutoplay();
		};

		const onPrev = () => {
			goToSlide(currentSlide - 1);
			resetAutoplay();
		};

		const onNext = () => {
			goToSlide(currentSlide + 1);
			resetAutoplay();
		};

		if (prevBtn) {
			prevBtn.addEventListener("click", onPrev);
			cleanupFns.push(() => prevBtn.removeEventListener("click", onPrev));
		}

		if (nextBtn) {
			nextBtn.addEventListener("click", onNext);
			cleanupFns.push(() => nextBtn.removeEventListener("click", onNext));
		}

		const dotHandlers = [];
		dots.forEach((d) => {
			const onDot = () => {
				goToSlide(parseInt(d.dataset.i || "0", 10));
				resetAutoplay();
			};
			d.addEventListener("click", onDot);
			dotHandlers.push(() => d.removeEventListener("click", onDot));
		});
		cleanupFns.push(() => dotHandlers.forEach((fn) => fn()));

		if (totalSlides > 1) {
			startAutoplay();
			cleanupFns.push(() => autoplay && window.clearInterval(autoplay));
		}

		const contactForm = document.getElementById("contactForm");
		const formStatus = document.getElementById("formStatus");
		const submitBtn = document.getElementById("submitBtn");

		const showStatus = (msg, type) => {
			if (!formStatus) {
				return;
			}
			formStatus.textContent = msg;
			formStatus.className = `form-status ${type}`;
			formStatus.style.display = "block";
		};

		const hideStatus = () => {
			if (formStatus) {
				formStatus.style.display = "none";
			}
		};

		const onContactSubmit = async (e) => {
			e.preventDefault();
			if (!contactForm) {
				return;
			}

			const data = {
				name: contactForm.name.value.trim(),
				email: contactForm.email.value.trim(),
				phone: contactForm.phone.value.trim(),
				service: contactForm.service.value,
				message: contactForm.message.value.trim(),
			};

			if (!data.name || !data.email || !data.message) {
				showStatus("Please fill in Name, Email and Project Brief.", "error");
				return;
			}

			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = "Sending...";
			}
			hideStatus();

			try {
				const res = await fetch("/api/contact", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});

				const result = await res.json();
				if (res.ok && result.success) {
					showStatus("Message Sent. We'll be in touch shortly.", "success");
					contactForm.reset();
				} else {
					showStatus(result.message || "Error saving data. Please try again.", "error");
				}
			} catch (error) {
				showStatus("Unable to reach server. Please ensure the backend is running.", "error");
			} finally {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = "Send Message";
				}
			}
		};

		if (contactForm) {
			contactForm.addEventListener("submit", onContactSubmit);
			cleanupFns.push(() => contactForm.removeEventListener("submit", onContactSubmit));
		}

		let cursor = null;
		let ring = null;
		let onMouseMove;
		let hoverHandlers = [];

		if (window.innerWidth > 1024) {
			cursor = document.createElement("div");
			cursor.style.cssText =
				"position: fixed; width: 8px; height: 8px; background: rgba(201,168,76,0.7); border-radius: 50%; pointer-events: none; z-index: 99999; transition: transform 0.15s ease, opacity 0.15s ease; transform: translate(-50%,-50%);";
			document.body.appendChild(cursor);

			ring = document.createElement("div");
			ring.style.cssText =
				"position: fixed; width: 36px; height: 36px; border: 1px solid rgba(201,168,76,0.35); border-radius: 50%; pointer-events: none; z-index: 99998; transition: transform 0.4s ease, left 0.08s linear, top 0.08s linear; transform: translate(-50%,-50%);";
			document.body.appendChild(ring);

			onMouseMove = (e) => {
				if (cursor && ring) {
					cursor.style.left = `${e.clientX}px`;
					cursor.style.top = `${e.clientY}px`;
					ring.style.left = `${e.clientX}px`;
					ring.style.top = `${e.clientY}px`;
				}
			};

			document.addEventListener("mousemove", onMouseMove);

			document.querySelectorAll("a, button").forEach((el) => {
				const onEnter = () => {
					if (cursor) {
						cursor.style.transform = "translate(-50%,-50%) scale(2)";
					}
				};
				const onLeave = () => {
					if (cursor) {
						cursor.style.transform = "translate(-50%,-50%) scale(1)";
					}
				};
				el.addEventListener("mouseenter", onEnter);
				el.addEventListener("mouseleave", onLeave);
				hoverHandlers.push(() => {
					el.removeEventListener("mouseenter", onEnter);
					el.removeEventListener("mouseleave", onLeave);
				});
			});

			cleanupFns.push(() => {
				if (onMouseMove) {
					document.removeEventListener("mousemove", onMouseMove);
				}
				hoverHandlers.forEach((fn) => fn());
				hoverHandlers = [];
				if (cursor && cursor.parentElement) {
					cursor.parentElement.removeChild(cursor);
				}
				if (ring && ring.parentElement) {
					ring.parentElement.removeChild(ring);
				}
			});
		}

		const modalOverlay = document.getElementById("propertyModal");
		const modalClose = document.getElementById("modalClose");
		const modalImg = document.getElementById("modalImg");
		const galleryPrev = document.getElementById("galleryPrev");
		const galleryNext = document.getElementById("galleryNext");
		const galleryCounter = document.getElementById("galleryCounter");
		const galleryThumbs = document.getElementById("galleryThumbs");
		const galleryDots = document.getElementById("galleryDots");

		let galleryImages = [];
		let galleryIndex = 0;
		let touchStartX = 0;
		let touchStartY = 0;

		const updateGalleryState = () => {
			if (!modalImg || !galleryCounter || !galleryThumbs || !galleryPrev || !galleryNext) {
				return;
			}
			const total = galleryImages.length || 1;
			const index = ((galleryIndex % total) + total) % total;
			modalImg.src = galleryImages[index] || "";
			modalImg.alt = galleryImages.length > 1 ? `Property photo ${index + 1}` : "Property image";
			galleryCounter.textContent = `${index + 1}/${total}`;
			galleryPrev.style.display = total > 1 ? "flex" : "none";
			galleryNext.style.display = total > 1 ? "flex" : "none";
			galleryCounter.style.display = total > 1 ? "block" : "none";
			galleryThumbs.style.display = total > 1 ? "flex" : "none";
			galleryDots.style.display = total > 1 ? "flex" : "none";

			galleryThumbs.querySelectorAll(".gallery-thumb").forEach((thumb) => {
				const thumbIndex = parseInt(thumb.dataset.i || "0", 10);
				thumb.classList.toggle("active", thumbIndex === index);
			});
			if (galleryDots) {
				galleryDots.querySelectorAll(".gallery-dot").forEach((dot) => {
					const dotIndex = parseInt(dot.dataset.i || "0", 10);
					dot.classList.toggle("active", dotIndex === index);
				});
			}
		};

		const renderGalleryThumbs = (images) => {
			if (!galleryThumbs) return;
			galleryThumbs.innerHTML = "";
			images.forEach((src, i) => {
				const thumb = document.createElement("button");
				thumb.type = "button";
				thumb.className = "gallery-thumb";
				thumb.dataset.i = String(i);
				thumb.setAttribute("aria-label", `View image ${i + 1}`);
				thumb.innerHTML = `<img src="${src}" alt="Property thumbnail ${i + 1}" />`;
				thumb.addEventListener("click", () => {
					galleryIndex = i;
					updateGalleryState();
				});
				galleryThumbs.appendChild(thumb);
			});
		};

		const renderGalleryDots = (images) => {
			if (!galleryDots) return;
			galleryDots.innerHTML = "";
			images.forEach((_, i) => {
				const dot = document.createElement("button");
				dot.type = "button";
				dot.className = "gallery-dot";
				dot.dataset.i = String(i);
				dot.setAttribute("aria-label", `Go to image ${i + 1}`);
				dot.addEventListener("click", () => {
					galleryIndex = i;
					updateGalleryState();
				});
				galleryDots.appendChild(dot);
			});
		};

		const changeGalleryImage = (direction) => {
			if (galleryImages.length <= 1) return;
			galleryIndex = (galleryIndex + direction + galleryImages.length) % galleryImages.length;
			updateGalleryState();
		};

		const onGalleryTouchStart = (e) => {
			if (e.touches && e.touches[0]) {
				touchStartX = e.touches[0].clientX;
				touchStartY = e.touches[0].clientY;
			}
		};

		const onGalleryTouchEnd = (e) => {
			if (!e.changedTouches || !e.changedTouches[0]) return;
			const deltaX = e.changedTouches[0].clientX - touchStartX;
			const deltaY = e.changedTouches[0].clientY - touchStartY;
			if (Math.abs(deltaX) > 40 && Math.abs(deltaY) < 60) {
				changeGalleryImage(deltaX > 0 ? -1 : 1);
			}
		};

		const openModal = (key) => {
			const d = MODAL_DATA[key];
			if (!d || !modalOverlay) {
				return;
			}

			const modalBadge = document.getElementById("modalBadge");
			const modalCat = document.getElementById("modalCat");
			const modalTitle = document.getElementById("modalTitle");
			const modalLocationText = document.getElementById("modalLocationText");
			const modalDesc = document.getElementById("modalDesc");
			const modalStatus = document.getElementById("modalStatus");
			const modalPrice = document.getElementById("modalPrice");

			if (!modalImg || !modalBadge || !modalCat || !modalTitle || !modalLocationText || !modalDesc || !modalStatus || !modalPrice) {
				return;
			}

			galleryImages = Array.isArray(d.images) && d.images.length ? d.images : [d.img || ""];
			galleryIndex = 0;
			renderGalleryThumbs(galleryImages);
			renderGalleryDots(galleryImages);
			updateGalleryState();

			modalBadge.textContent = d.badge;
			modalCat.textContent = d.cat;
			modalTitle.textContent = d.title;
			modalLocationText.textContent = d.location;
			modalDesc.textContent = d.desc;
			modalStatus.textContent = d.status;
			modalPrice.textContent = d.price;
			modalOverlay.classList.add("open");
			document.body.style.overflow = "hidden";
		};

		const closeModal = () => {
			if (modalOverlay) {
				modalOverlay.classList.remove("open");
			}
			document.body.style.overflow = "";
		};

		const onGalleryPrevClick = () => changeGalleryImage(-1);
		const onGalleryNextClick = () => changeGalleryImage(1);

		if (galleryPrev) {
			galleryPrev.addEventListener("click", onGalleryPrevClick);
			cleanupFns.push(() => galleryPrev.removeEventListener("click", onGalleryPrevClick));
		}

		if (galleryNext) {
			galleryNext.addEventListener("click", onGalleryNextClick);
			cleanupFns.push(() => galleryNext.removeEventListener("click", onGalleryNextClick));
		}

		if (modalImg) {
			modalImg.addEventListener("touchstart", onGalleryTouchStart, { passive: true });
			modalImg.addEventListener("touchend", onGalleryTouchEnd, { passive: true });
			cleanupFns.push(() => {
				modalImg.removeEventListener("touchstart", onGalleryTouchStart);
				modalImg.removeEventListener("touchend", onGalleryTouchEnd);
			});
		}

		const openModalHandlers = [];
		document.querySelectorAll(".open-modal").forEach((el) => {
			const onClick = (e) => {
				e.stopPropagation();
				openModal(el.dataset.modal);
			};
			el.addEventListener("click", onClick);
			openModalHandlers.push(() => el.removeEventListener("click", onClick));
		});

		const cardHandlers = [];
		document.querySelectorAll(".port-card[data-modal]").forEach((card) => {
			const onCardClick = () => openModal(card.dataset.modal);
			card.addEventListener("click", onCardClick);
			cardHandlers.push(() => card.removeEventListener("click", onCardClick));
		});

		const onModalClose = () => closeModal();
		if (modalClose) {
			modalClose.addEventListener("click", onModalClose);
			cleanupFns.push(() => modalClose.removeEventListener("click", onModalClose));
		}

		const onOverlayClick = (e) => {
			if (e.target === modalOverlay) {
				closeModal();
			}
		};

		if (modalOverlay) {
			modalOverlay.addEventListener("click", onOverlayClick);
			cleanupFns.push(() => modalOverlay.removeEventListener("click", onOverlayClick));
		}

		const onEsc = (e) => {
			if (e.key === "Escape") {
				closeModal();
			}
			if (e.key === "ArrowLeft") {
				changeGalleryImage(-1);
			}
			if (e.key === "ArrowRight") {
				changeGalleryImage(1);
			}
		};
		document.addEventListener("keydown", onEsc);
		cleanupFns.push(() => document.removeEventListener("keydown", onEsc));

		const modalEnquireBtn = document.querySelector(".modal-enquire-btn");
		const onEnquire = () => closeModal();
		if (modalEnquireBtn) {
			modalEnquireBtn.addEventListener("click", onEnquire);
			cleanupFns.push(() => modalEnquireBtn.removeEventListener("click", onEnquire));
		}

		cleanupFns.push(() => {
			openModalHandlers.forEach((fn) => fn());
			cardHandlers.forEach((fn) => fn());
		});

		/* Parallax removed for multi-slide hero — handled by CSS animation */
		const onHeroParallax = () => {
			/* noop — hero zoom/parallax now driven by CSS keyframes per slide */
		};
		window.addEventListener("scroll", onHeroParallax, { passive: true });
		cleanupFns.push(() => window.removeEventListener("scroll", onHeroParallax));

		return () => {
			observers.forEach((observer) => observer.disconnect());
			cleanupFns.forEach((fn) => fn());
			document.body.classList.remove("loading");
			document.body.style.overflow = "";
		};
	}, []);
}

export default useZentraxEffects;
