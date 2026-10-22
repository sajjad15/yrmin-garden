(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.getElementById('header');
  var themeToggle = document.getElementById('themeToggle');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  var STORAGE_KEY = 'yrmin-theme';

  /* ---------- الوضع الداكن/الفاتح ---------- */
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'light');
  }

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'light');
    themeToggle.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- قائمة الجوال ---------- */
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });

    // إغلاق القائمة عند الضغط على أي رابط
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    // إغلاق القائمة بزر Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------- ظل الهيدر عند النزول ---------- */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- تمييز الرابط النشط حسب القسم ---------- */
  var links = document.querySelectorAll('.nav__link');
  var sections = [];

  links.forEach(function (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ link: link, el: target });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        sections.forEach(function (s) {
          if (s.el === entry.target) s.link.classList.add('is-active');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s.el); });
  }
})();

/* ==========================================================
   المنيو التفاعلي
   عدّل الأصناف والأسعار من هنا فقط
   الصيغة: i('الاسم', السعر, السعرات, 'ملاحظة', 1)
   - السعرات: ضع 0 إذا لا توجد
   - الملاحظة: اتركها '' إذا لا توجد
   - الرقم 1 في آخر السطر = شارة «الأكثر مبيعاً» (اتركه فارغاً إن لم تردها)
   ========================================================== */
(function () {
  'use strict';

  var CURRENCY = 'ر.س';
  var BEST_LABEL = 'الأكثر مبيعاً';

  function i(name, price, cal, note, best) {
    return { name: name, price: price, cal: cal || 0, note: note || '', best: !!best };
  }

  var menu = [
    {
      id: 'breakfast', label: 'الفطور',
      groups: [
        { title: 'إفطار يرمين', items: [
          i('فول فخار', 19, 268),
          i('فول لبناني', 18, 287),
          i('فول جرة', 18, 311),
          i('عدس فخار', 18, 215),
          i('تونه تاوة', 22, 190),
          i('مقلقل دجاج', 24, 179),
          i('كبدة نعيمي', 29, 288, 'إضافة جبن 5 ريال', 1),
          i('فلافل', 15, 433, 'تقدم مع الحمص والطحينة'),
          i('حمسه حلوم', 32, 321, '', 1),
          i('لبنه', 15, 254),
          i('حمص', 18, 222),
          i('حمص بيروتي', 25, 222, '', 1),
          i('حمص باللحمة', 28, 345),
          i('عريكة', 30, 370),
          i('مطبق خضار', 14, 121),
          i('نواشف', 25, 178)
        ]},
        { title: 'ركن البيض', items: [
          i('شكشوكة عدني بالفخار', 19, 381),
          i('شكشوكة يرمين بالفخار', 19, 379),
          i('شكشوكة بالفخار', 15, 321),
          i('بيض مخصوص', 23, 366, '', 1),
          i('بيض عيون تركي', 23, 31),
          i('بيض أومليت', 17, 298)
        ]},
        { title: 'فرن يرمين', items: [
          i('لحم بعجين', 25, 450),
          i('منقوشة جبن بزعتر', 27, 293, '', 1),
          i('منقوشة جبنة', 17, 280),
          i('منقوشة زعتر', 17, 250),
          i('بيتزا مارجريتا', 27, 340),
          i('بيتزا خضار', 25, 360),
          i('بانكيك عسل ومربى', 19, 690),
          i('ساندوتش دجاج بالبيستو', 23, 421)
        ]},
        { title: 'مشروبات الفطور', items: [
          i('مشروب غازي', 5, 0, 'كولا، كولا لايت، سبرايت، فانتا'),
          i('شاي عادي', 5, 20),
          i('كرك يرمين', 8, 48),
          i('شاي كرك', 6, 48),
          i('أبريق كرك يرمين', 25, 288),
          i('أبريق كرك', 23, 288),
          i('أبريق شاي', 19, 120),
          i('قهوة تركي', 13, 11),
          i('عصير برتقال', 21, 49),
          i('عصير ليمون', 15, 45),
          i('عصير ليمون بالنعناع', 16, 59),
          i('مياه', 3, 0)
        ]}
      ]
    },

    {
      id: 'starters', label: 'مقبلات وسلطات',
      groups: [
        { title: 'الشوربات', items: [
          i('شوربة ثمار البحر', 37, 377, '', 1),
          i('شوربة العدس', 31, 186),
          i('شوربة الفطر بالكريمة', 32, 249)
        ]},
        { title: 'المازات الباردة', items: [
          i('لفائف الباذنجان', 31, 285),
          i('حمص', 29, 166),
          i('حمص تريو', 33, 250, 'حمص عادي، بالبيستو، بالشمندر'),
          i('متبل باذنجان', 28, 247),
          i('ورق عنب', 31, 240)
        ]},
        { title: 'السلطات', items: [
          i('تبولة', 32, 285),
          i('فتوش', 30, 350),
          i('حمص بيروتي', 25, 222, '', 1),
          i('سلطة السيزر', 32, 530),
          i('سلطة الروكا وجبنة البرميزان', 32, 210)
        ]},
        { title: 'المازات الساخنة', items: [
          i('عرايس الكباب والجبنة', 37, 534),
          i('بطاطا حرة', 37, 189),
          i('كبة مقلية', 40, 762),
          i('كبة صاجية', 40, 768),
          i('فتة الروبيان', 40, 610),
          i('فتة الباذنجان', 35, 583, '', 1),
          i('بطاطا مقلية', 15, 165),
          i('داينامت شريمب', 41, 323, '', 1),
          i('أصابع الجبنة المقلية', 33, 443)
        ]}
      ]
    },

    {
      id: 'sandwiches', label: 'سندويشات وبيتزا',
      groups: [
        { title: 'السندويشات والبرغر', items: [
          i('سلايدر برغر الدجاج', 37, 758),
          i('سلايدر برغر اللحم', 39, 597, '', 1),
          i('كساديا', 35, 394)
        ]},
        { title: 'البيتزا', items: [
          i('بيتزا مرغريتا', 37, 217),
          i('بيتزا خضار', 34, 234),
          i('بيتزا باربيكيو', 38, 274, '', 1),
          i('بيتزا بيبيروني', 39, 249)
        ]}
      ]
    },

    {
      id: 'mains', label: 'الأطباق الرئيسية',
      groups: [
        { title: 'الأطباق الرئيسية', items: [
          i('كبة لبنية', 40, 734, '', 1),
          i('شيش برك', 40, 769),
          i('أرز خروف شرقي', 47, 687),
          i('برياني لحم', 52, 384),
          i('برياني روبيان', 55, 326),
          i('برياني دجاج', 47, 351, '', 1),
          i('أرز برياني سادة', 25, 187),
          i('أرز أبيض', 15, 144),
          i('لازانيا بصلصة البيستو', 39, 876),
          i('فتوشيني بالدجاج والفطر', 49, 831, '', 1),
          i('ريزوتو بالدجاج والفطر', 49, 829)
        ]},
        { title: 'المشويات', items: [
          i('شيش طاووق', 47, 269, '', 1),
          i('أوصال لحم', 75, 370),
          i('كباب خشخاش', 65, 480),
          i('كباب اللحم', 61, 343),
          i('كباب دجاج', 41, 311),
          i('كستلاتة غنم', 95, 411, '', 1),
          i('مشاوي مشكل', 79, 357)
        ]}
      ]
    },

    {
      id: 'sweets', label: 'حلويات وأطفال',
      groups: [
        { title: 'الحلويات', items: [
          i('شيز كيك بالأوريو', 39, 767),
          i('شيز كيك بالفراولة', 39, 776, '', 1),
          i('بيلجيوم وافل', 30, 355),
          i('كريب', 30, 340),
          i('أم علي', 25, 427),
          i('كيك بالتمر', 27, 456, '', 1)
        ]},
        { title: 'زاوية الأطفال', items: [
          i('ميني بيتزا', 27, 286, 'مع البطاطا المقلية وعصير البرتقال'),
          i('نغتز الدجاج', 27, 217, 'مع البطاطا المقلية وعصير البرتقال')
        ]}
      ]
    },

    {
      id: 'drinks', label: 'المشروبات',
      groups: [
        { title: 'المياه', items: [
          i('مياه معدنية كبيرة', 5, 0),
          i('مياه معدنية صغيرة', 3, 0)
        ]},
        { title: 'مشروبات غازية', items: [
          i('كوكا كولا', 5, 105),
          i('كولا لايت', 5, 5),
          i('سبرايت', 5, 118),
          i('فانتا', 5, 146)
        ]},
        { title: 'عصائر طازجة', items: [
          i('عصير برتقال', 21, 49),
          i('ليموناضة بالنعناع', 16, 49),
          i('ليموناضة', 15, 45),
          i('كوكتيل', 19, 154)
        ]},
        { title: 'الكوكتيلات والعصائر الباردة', items: [
          i('فيرجن جامايكا', 19, 180),
          i('فيرجن موهيتو', 19, 180),
          i('سموثي فراولة', 19, 160),
          i('سموثي مانجو', 19, 179),
          i('سموثي التوت البري', 19, 187),
          i('سموثي ليمون وبطيخ', 19, 169)
        ]},
        { title: 'ميلك شيك', items: [
          i('فانيليا', 19, 367),
          i('شوكولاتة', 19, 434),
          i('كراميل', 19, 388),
          i('فراولة', 19, 294),
          i('توفي', 19, 357, 'قهوة، كراميل، شوكولاتة'),
          i('أوريو', 19, 289),
          i('كيت كات', 19, 365),
          i('كيندر', 19, 382),
          i('سبانيش شيك لاتية', 19, 250),
          i('فرابو شينو', 19, 230)
        ]}
      ]
    },

    {
      id: 'coffee', label: 'القهوة والشاي',
      groups: [
        { title: 'القهوة والشاي والزهورات', items: [
          i('إسبريسو سنجل', 10, 5),
          i('دبل إسبريسو', 13, 10),
          i('كافيه لاتيه', 19, 120),
          i('مكياتو', 12, 15),
          i('أمريكانو', 10, 18),
          i('يرمين سبيشل', 15, 55, 'دبل إسبريسو مع بوظة الفانيلا والمكسرات'),
          i('قهوة تركية', 13, 23),
          i('كابتشينو يرمين', 19, 70),
          i('كابتشينو', 18, 70),
          i('موكا', 19, 120),
          i('شوكولاتة ساخنة', 19, 125),
          i('سبانيش لاتيه', 19, 194),
          i('بوستاشيو لاتيه', 22, 202),
          i('إيطاليانو كوفي', 19, 166),
          i('روز لاتيه', 19, 176),
          i('كورتادو كوفي', 19, 130),
          i('فلات وايت', 19, 155),
          i('كوب شاي', 5, 25),
          i('أبريق شاي', 17, 89)
        ]}
      ]
    }
  ];

  var tabsEl = document.getElementById('menuTabs');
  var gridEl = document.getElementById('menuGrid');
  if (!tabsEl || !gridEl) return;

  var activeId = menu[0].id;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    menu.forEach(function (cat) {
      var btn = el('button', 'menu__tab', cat.label);
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', cat.id === activeId);
      btn.setAttribute('tabindex', cat.id === activeId ? '0' : '-1');
      btn.dataset.cat = cat.id;
      tabsEl.appendChild(btn);
    });
  }

  function buildItem(item) {
    var li = el('li', 'menu-item');

    var row = el('div', 'menu-item__row');
    row.appendChild(el('span', 'menu-item__name', item.name));
    if (item.best) row.appendChild(el('span', 'menu-item__badge', BEST_LABEL));
    row.appendChild(el('span', 'menu-item__dots'));

    var price = el('span', 'menu-item__price', String(item.price));
    price.appendChild(el('small', '', CURRENCY));
    row.appendChild(price);
    li.appendChild(row);

    if (item.note || item.cal) {
      var meta = el('div', 'menu-item__meta');
      if (item.note) meta.appendChild(el('span', '', item.note));
      if (item.cal) meta.appendChild(el('span', '', item.cal + ' سعرة'));
      li.appendChild(meta);
    }
    return li;
  }

  function buildGroup(group) {
    var box = el('section', 'menu-group');
    box.appendChild(el('h3', 'menu-group__title', group.title));
    var list = el('ul', 'menu-group__list');
    group.items.forEach(function (item) { list.appendChild(buildItem(item)); });
    box.appendChild(list);
    return box;
  }

  function renderGrid() {
    gridEl.innerHTML = '';
    var cat = menu.filter(function (c) { return c.id === activeId; })[0];
    cat.groups.forEach(function (g) { gridEl.appendChild(buildGroup(g)); });

    gridEl.classList.remove('is-switching');
    void gridEl.offsetWidth;
    gridEl.classList.add('is-switching');
  }

  function selectCategory(id) {
    activeId = id;
    renderTabs();
    renderGrid();
  }

  tabsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.menu__tab');
    if (btn) selectCategory(btn.dataset.cat);
  });

  /* التنقل بالأسهم (الصفحة RTL: السهم الأيسر = التالي) */
  tabsEl.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var index = menu.findIndex(function (c) { return c.id === activeId; });
    var step = e.key === 'ArrowLeft' ? 1 : -1;
    var next = (index + step + menu.length) % menu.length;
    selectCategory(menu[next].id);
    tabsEl.querySelector('[aria-selected="true"]').focus();
  });

  renderTabs();
  renderGrid();
})();

/* ==========================================================
   الموقع والتواصل والفوتر
   ========================================================== */
(function () {
  'use strict';

  /* ---------- رقم واتساب (بصيغة دولية بدون + وبدون صفر) ---------- */
  var WHATSAPP = '966591443391';

  /* ---------- سنة الحقوق ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- مفتوح الآن / مغلق (بتوقيت الرياض) ---------- */
  var statusEl = document.getElementById('openStatus');

  function updateStatus() {
    if (!statusEl) return;
    var parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Riyadh'
    }).formatToParts(new Date());

    var h = 0, m = 0;
    parts.forEach(function (p) {
      if (p.type === 'hour') h = parseInt(p.value, 10) % 24;
      if (p.type === 'minute') m = parseInt(p.value, 10);
    });

    var now = h * 60 + m;
    var openAt = 5 * 60 + 30;    // 05:30
    var closeAt = 1 * 60 + 30;   // 01:30 بعد منتصف الليل
    var isOpen = now >= openAt || now < closeAt;

    statusEl.hidden = false;
    statusEl.textContent = isOpen ? 'مفتوح الآن' : 'مغلق الآن، نفتح 05:30 صباحاً';
    statusEl.classList.toggle('is-open', isOpen);
    statusEl.classList.toggle('is-closed', !isOpen);
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- نموذج التواصل: يفتح واتساب برسالة جاهزة ---------- */
  var form = document.getElementById('contactForm');
  var errorEl = document.getElementById('formError');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.elements.name;
    var phone = form.elements.phone;
    var message = form.elements.message;
    var fields = [name, phone, message];
    var firstInvalid = null;

    fields.forEach(function (f) {
      var bad = !f.value.trim();
      f.classList.toggle('is-invalid', bad);
      if (bad && !firstInvalid) firstInvalid = f;
    });

    if (firstInvalid) {
      errorEl.textContent = 'عبّئ جميع الحقول قبل الإرسال.';
      errorEl.hidden = false;
      firstInvalid.focus();
      return;
    }

    errorEl.hidden = true;

    var text =
      'مرحباً مطعم يرمين،\n' +
      'الاسم: ' + name.value.trim() + '\n' +
      'الجوال: ' + phone.value.trim() + '\n' +
      'الرسالة: ' + message.value.trim();

    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    form.reset();
  });

  /* إزالة تمييز الخطأ عند الكتابة */
  form.addEventListener('input', function (e) {
    e.target.classList.remove('is-invalid');
  });
})();