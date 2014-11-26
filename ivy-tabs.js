(function() {
    "use strict";
    var ember$$default = Ember;

    var components$ivy$tab$list$$default = ember$$default.Component.extend({
      tagName: 'ul',
      attributeBindings: ['aria-multiselectable', 'role'],
      classNames: ['ivy-tab-list'],

      init: function() {
        this._super();
        ember$$default.run.once(this, this._registerWithTabsContainer);
      },

      willDestroy: function() {
        this._super();
        ember$$default.run.once(this, this._unregisterWithTabsContainer);
      },

      /**
       * Tells screenreaders that only one tab can be selected at a time.
       *
       * @property aria-multiselectable
       * @type String
       * @default 'false'
       */
      'aria-multiselectable': 'false',

      /**
       * The `role` attribute of the tab list element.
       *
       * See http://www.w3.org/TR/wai-aria/roles#tablist
       *
       * @property role
       * @type String
       * @default 'tablist'
       */
      role: 'tablist',

      /**
       * Gives focus to the selected tab.
       *
       * @method focusSelectedTab
       */
      focusSelectedTab: function() {
        this.get('selectedTab').$().focus();
      },

      /**
       * Event handler for navigating tabs via arrow keys. The left (or up) arrow
       * selects the previous tab, while the right (or down) arrow selects the next
       * tab.
       *
       * @method navigateOnKeyDown
       * @param {Event} event
       */
      navigateOnKeyDown: ember$$default.on('keyDown', function(event) {
        switch (event.keyCode) {
        case 37: /* left */
        case 38: /* up */
          this.selectPreviousTab();
          break;
        case 39: /* right */
        case 40: /* down */
          this.selectNextTab();
          break;
        default:
          return;
        }

        event.preventDefault();
        ember$$default.run.scheduleOnce('afterRender', this, this.focusSelectedTab);
      }),

      /**
       * Adds a tab to the `tabs` array.
       *
       * @method registerTab
       * @param {ivy.tabs.IvyTabComponent} tab
       */
      registerTab: function(tab) {
        this.get('tabs').pushObject(tab);
      },

      /**
       * Selects the next tab in the list, if any.
       *
       * @method selectNextTab
       */
      selectNextTab: function() {
        var index = this.get('selected-index') + 1;
        if (index === this.get('tabs.length')) { index = 0; }
        this.selectTabByIndex(index);
      },

      /**
       * Selects the previous tab in the list, if any.
       *
       * @method selectPreviousTab
       */
      selectPreviousTab: function() {
        var index = this.get('selected-index') - 1;
        if (index === -1) { index = this.get('tabs.length') - 1; }
        this.selectTabByIndex(index);
      },

      'selected-index': ember$$default.computed.alias('tabsContainer.selected-index'),

      /**
       * The currently-selected `ivy-tab` instance.
       *
       * @property selectedTab
       * @type ivy.tabs.IvyTabComponent
       */
      selectedTab: ember$$default.computed(function() {
        return this.get('tabs').objectAt(this.get('selected-index'));
      }).property('selected-index', 'tabs.[]'),

      /**
       * Select the given tab.
       *
       * @method selectTab
       * @param {ivy.tabs.IvyTabComponent} tab
       */
      selectTab: function(tab) {
        this.selectTabByIndex(this.get('tabs').indexOf(tab));
      },

      /**
       * Select the tab at `index`.
       *
       * @method selectTabByIndex
       * @param {Number} index
       */
      selectTabByIndex: function(index) {
        this.set('selected-index', index);
      },

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type ivy.tabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: ember$$default.computed.alias('parentView').readOnly(),

      /**
       * Removes a tab from the `tabs` array.
       *
       * @method unregisterTab
       * @param {ivy.tabs.IvyTabComponent} tab
       */
      unregisterTab: function(tab) {
        this.get('tabs').removeObject(tab);
        if (tab.get('isSelected')) { this.selectPreviousTab(); }
      },

      _initTabs: ember$$default.on('init', function() {
        this.set('tabs', ember$$default.A());
      }),

      _registerWithTabsContainer: function() {
        this.get('tabsContainer').registerTabList(this);
      },

      _unregisterWithTabsContainer: function() {
        this.get('tabsContainer').unregisterTabList(this);
      }
    });

    var components$ivy$tab$panel$$default = ember$$default.Component.extend({
      attributeBindings: ['aria-labelledby', 'role'],
      classNames: ['ivy-tab-panel'],
      classNameBindings: ['active'],

      init: function() {
        this._super();
        ember$$default.run.once(this, this._registerWithTabsContainer);
      },

      willDestroy: function() {
        this._super();
        ember$$default.run.once(this, this._unregisterWithTabsContainer);
      },

      /**
       * Tells screenreaders which tab labels this panel.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby
       *
       * @property aria-labelledby
       * @type String
       * @readOnly
       */
      'aria-labelledby': ember$$default.computed.alias('tab.elementId').readOnly(),

      /**
       * See http://www.w3.org/TR/wai-aria/roles#tabpanel
       *
       * @property role
       * @type String
       * @default 'tabpanel'
       */
      role: 'tabpanel',

      /**
       * Accessed as a className binding to apply the panel's `activeClass` CSS
       * class to the element when the panel's `isSelected` property is true.
       *
       * @property active
       * @type String
       * @readOnly
       */
      active: ember$$default.computed(function() {
        if (this.get('isSelected')) { return this.get('activeClass'); }
      }).property('isSelected'),

      /**
       * The CSS class to apply to a panel's element when its `isSelected` property
       * is `true`.
       *
       * @property activeClass
       * @type String
       * @default 'active'
       */
      activeClass: 'active',

      /**
       * The index of this panel in the `ivy-tabs` component.
       *
       * @property index
       * @type Number
       */
      index: ember$$default.computed(function() {
        return this.get('tabPanels').indexOf(this);
      }).property('tabPanels.[]'),

      /**
       * Whether or not this panel's associated tab is selected.
       *
       * @property isSelected
       * @type Boolean
       * @readOnly
       */
      isSelected: ember$$default.computed.alias('tab.isSelected').readOnly(),

      /**
       * If `false`, this panel will appear hidden in the DOM. This is an alias to
       * `isSelected`.
       *
       * @property isVisible
       * @type Boolean
       * @readOnly
       */
      isVisible: ember$$default.computed.alias('isSelected').readOnly(),

      /**
       * The `ivy-tab` associated with this panel.
       *
       * @property tab
       * @type ivy.tabs.IvyTabComponent
       */
      tab: ember$$default.computed(function() {
        var tabs = this.get('tabs');
        if (tabs) { return tabs.objectAt(this.get('index')); }
      }).property('tabs.[]', 'index'),

      /**
       * The `ivy-tab-list` component this panel belongs to.
       *
       * @property tabList
       * @type ivy.tabs.IvyTabListComponent
       * @readOnly
       */
      tabList: ember$$default.computed.alias('tabsContainer.tabList').readOnly(),

      /**
       * The array of all `ivy-tab-panel` instances within the `ivy-tabs`
       * component.
       *
       * @property tabPanels
       * @type Array | ivy.tabs.IvyTabPanelComponent
       * @readOnly
       */
      tabPanels: ember$$default.computed.alias('tabsContainer.tabPanels').readOnly(),

      /**
       * The array of all `ivy-tab` instances within the `ivy-tab-list` component.
       *
       * @property tabs
       * @type Array | ivy.tabs.IvyTabComponent
       * @readOnly
       */
      tabs: ember$$default.computed.alias('tabList.tabs').readOnly(),

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type ivy.tabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: ember$$default.computed.alias('parentView').readOnly(),

      _registerWithTabsContainer: function() {
        this.get('tabsContainer').registerTabPanel(this);
      },

      _unregisterWithTabsContainer: function() {
        this.get('tabsContainer').unregisterTabPanel(this);
      }
    });

    var components$ivy$tab$$default = ember$$default.Component.extend({
      tagName: 'li',
      attributeBindings: ['aria-controls', 'aria-expanded', 'aria-selected', 'role', 'selected', 'tabindex'],
      classNames: ['ivy-tab'],
      classNameBindings: ['active'],

      init: function() {
        this._super();
        ember$$default.run.once(this, this._registerWithTabList);
      },

      willDestroy: function() {
        this._super();
        ember$$default.run.once(this, this._unregisterWithTabList);
      },

      /**
       * Tells screenreaders which panel this tab controls.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-controls
       *
       * @property aria-controls
       * @type String
       * @readOnly
       */
      'aria-controls': ember$$default.computed.alias('tabPanel.elementId').readOnly(),

      /**
       * Tells screenreaders whether or not this tab's panel is expanded.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-expanded
       *
       * @property aria-expanded
       * @type String
       * @readOnly
       */
      'aria-expanded': ember$$default.computed.alias('aria-selected').readOnly(),

      /**
       * Tells screenreaders whether or not this tab is selected.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-selected
       *
       * @property aria-selected
       * @type String
       */
      'aria-selected': ember$$default.computed(function() {
        return this.get('isSelected') + ''; // coerce to 'true' or 'false'
      }).property('isSelected'),

      /**
       * The `role` attribute of the tab element.
       *
       * See http://www.w3.org/TR/wai-aria/roles#tab
       *
       * @property role
       * @type String
       * @default 'tab'
       */
      role: 'tab',

      /**
       * The `selected` attribute of the tab element. If the tab's `isSelected`
       * property is `true` this will be the literal string 'selected', otherwise
       * it will be `undefined`.
       *
       * @property selected
       * @type String
       */
      selected: ember$$default.computed(function() {
        if (this.get('isSelected')) { return 'selected'; }
      }).property('isSelected'),

      /**
       * Makes the selected tab keyboard tabbable, and prevents tabs from getting
       * focus when clicked with a mouse.
       *
       * @property tabindex
       * @type Number
       */
      tabindex: ember$$default.computed(function() {
        if (this.get('isSelected')) { return 0; }
      }).property('isSelected'),

      /**
       * Accessed as a className binding to apply the tab's `activeClass` CSS class
       * to the element when the tab's `isSelected` property is true.
       *
       * @property active
       * @type String
       * @readOnly
       */
      active: ember$$default.computed(function() {
        if (this.get('isSelected')) { return this.get('activeClass'); }
      }).property('isSelected'),

      /**
       * The CSS class to apply to a tab's element when its `isSelected` property
       * is `true`.
       *
       * @property activeClass
       * @type String
       * @default 'active'
       */
      activeClass: 'active',

      /**
       * The index of this tab in the `ivy-tab-list` component.
       *
       * @property index
       * @type Number
       */
      index: ember$$default.computed(function() {
        return this.get('tabs').indexOf(this);
      }).property('tabs.[]'),

      /**
       * Whether or not this tab is selected.
       *
       * @property isSelected
       * @type Boolean
       */
      isSelected: ember$$default.computed(function() {
        return this.get('tabList.selectedTab') === this;
      }).property('tabList.selectedTab'),

      /**
       * Called when the user clicks on the tab. Selects this tab.
       *
       * @method select
       */
      select: ember$$default.on('click', function() {
        this.get('tabList').selectTab(this);
      }),

      /**
       * The `ivy-tab-list` component this tab belongs to.
       *
       * @property tabList
       * @type ivy.tabs.IvyTabListComponent
       * @readOnly
       */
      tabList: ember$$default.computed.alias('parentView').readOnly(),

      /**
       * The `ivy-tab-panel` associated with this tab.
       *
       * @property tabPanel
       * @type ivy.tabs.IvyTabPanelComponent
       */
      tabPanel: ember$$default.computed(function() {
        return this.get('tabPanels').objectAt(this.get('index'));
      }).property('tabPanels.[]', 'index'),

      /**
       * The array of all `ivy-tab-panel` instances within the `ivy-tabs`
       * component.
       *
       * @property tabPanels
       * @type Array | ivy.tabs.IvyTabPanelComponent
       * @readOnly
       */
      tabPanels: ember$$default.computed.alias('tabsContainer.tabPanels').readOnly(),

      /**
       * The array of all `ivy-tab` instances within the `ivy-tab-list` component.
       *
       * @property tabs
       * @type Array | ivy.tabs.IvyTabComponent
       * @readOnly
       */
      tabs: ember$$default.computed.alias('tabList.tabs').readOnly(),

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type ivy.tabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: ember$$default.computed.alias('tabList.tabsContainer').readOnly(),

      _registerWithTabList: function() {
        this.get('tabList').registerTab(this);
      },

      _unregisterWithTabList: function() {
        this.get('tabList').unregisterTab(this);
      }
    });

    var components$ivy$tabs$$default = ember$$default.Component.extend({
      classNames: ['ivy-tabs'],

      init: function() {
        this._super();
        this._initTabPanels();
      },

      /**
       * @deprecated Use selected-index instead.
       * @property selectedIndex
       */
      selectedIndex: ember$$default.computed(function(key, value) {
        ember$$default.deprecate('Usage of `selectedIndex` is deprecated, use `selected-index` instead.');

        if (arguments.length > 1) {
          this.set('selected-index', value);
          return value;
        } else {
          return this.get('selected-index');
        }
      }),

      /**
       * Set this to the index of the tab you'd like to be selected. Usually it is
       * bound to a controller property that is used as a query parameter, but can
       * be bound to anything.
       *
       * @property selected-index
       * @type Number
       * @default 0
       */
      'selected-index': 0,

      /**
       * Registers the `ivy-tab-list` instance.
       *
       * @method registerTabList
       * @param {ivy.tabs.IvyTabListComponent} tabList
       */
      registerTabList: function(tabList) {
        this.set('tabList', tabList);
      },

      /**
       * Adds a panel to the `tabPanels` array.
       *
       * @method registerTabPanel
       * @param {ivy.tabs.IvyTabPanelComponent} tabPanel
       */
      registerTabPanel: function(tabPanel) {
        this.get('tabPanels').pushObject(tabPanel);
      },

      /**
       * Removes the `ivy-tab-list` component.
       *
       * @method unregisterTabList
       * @param {ivy.tabs.IvyTabListComponent} tabList
       */
      unregisterTabList: function(tabList) {
        this.set('tabList', null);
      },

      /**
       * Removes a panel from the `tabPanels` array.
       *
       * @method unregisterTabPanel
       * @param {ivy.tabs.IvyTabPanelComponent} tabPanel
       */
      unregisterTabPanel: function(tabPanel) {
        this.get('tabPanels').removeObject(tabPanel);
      },

      _initTabPanels: function() {
        this.set('tabPanels', ember$$default.A());
      }
    });

    var initializer$$default = {
      name: 'ivy-tabs',

      initialize: function(container) {
        container.register('component:ivy-tab', components$ivy$tab$$default);
        container.register('component:ivy-tab-list', components$ivy$tab$list$$default);
        container.register('component:ivy-tab-panel', components$ivy$tab$panel$$default);
        container.register('component:ivy-tabs', components$ivy$tabs$$default);
      }
    };

    var ivy$tabs$umd$$IvyTabs = {
      'IvyTabComponent': components$ivy$tab$$default,
      'IvyTabListComponent': components$ivy$tab$list$$default,
      'IvyTabPanelComponent': components$ivy$tab$panel$$default,
      'IvyTabsComponent': components$ivy$tabs$$default,
      'initializer': initializer$$default
    };

    /* global define module window */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return ivy$tabs$umd$$IvyTabs; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = ivy$tabs$umd$$IvyTabs;
    } else if (typeof this !== 'undefined') {
      this['IvyTabs'] = ivy$tabs$umd$$IvyTabs;
    }
}).call(this);

//# sourceMappingURL=ivy-tabs.js.map