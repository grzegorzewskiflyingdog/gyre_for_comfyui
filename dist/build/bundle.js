
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function append_styles(target, style_sheet_id, styles) {
        const append_styles_to = get_root_for_style(target);
        if (!append_styles_to.getElementById(style_sheet_id)) {
            const style = element('style');
            style.id = style_sheet_id;
            style.textContent = styles;
            append_stylesheet(append_styles_to, style);
        }
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately before the component is updated after any state change.
     *
     * The first time the callback runs will be before the initial `onMount`
     *
     * https://svelte.dev/docs#run-time-svelte-beforeupdate
     */
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let layer_image_preview="data:image/jpeg;base64,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";

    /* src\FormElement.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\FormElement.svelte";

    function add_css$5(target) {
    	append_styles(target, "svelte-7ajgrg", ".svelte-7ajgrg.svelte-7ajgrg{box-sizing:border-box}.element-preview.svelte-7ajgrg.svelte-7ajgrg{position:relative;margin-bottom:20px}.element-preview.svelte-7ajgrg .editElementButton.svelte-7ajgrg{display:none;position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;background-color:rgb(51, 51, 51);width:50px;text-align:center}.element-preview.svelte-7ajgrg:hover .editElementButton.svelte-7ajgrg{display:block}.element-preview.svelte-7ajgrg select.svelte-7ajgrg{margin-right:10px;background-color:black;color:white;padding:5px;display:inline-block}.element-preview.svelte-7ajgrg input.svelte-7ajgrg,textarea.svelte-7ajgrg.svelte-7ajgrg{background:none;position:relative;display:inline-block;color:white;margin:0}.textInput.svelte-7ajgrg.svelte-7ajgrg,.textarea.svelte-7ajgrg.svelte-7ajgrg{width:280px}.element-preview.svelte-7ajgrg label.svelte-7ajgrg{min-width:110px;display:inline-block}.element-preview.svelte-7ajgrg .textarea_label.svelte-7ajgrg{vertical-align:top}.element-preview.svelte-7ajgrg .layer_image_label.svelte-7ajgrg{vertical-align:60px}.element-preview.svelte-7ajgrg .slider_label.svelte-7ajgrg{vertical-align:10px}.element-properties.svelte-7ajgrg.svelte-7ajgrg{background-color:rgb(51, 51, 51);padding:10px;display:block;position:relative}.element-properties.svelte-7ajgrg label.svelte-7ajgrg{min-width:110px;display:inline-block}.element-properties.svelte-7ajgrg input.svelte-7ajgrg,textarea.svelte-7ajgrg.svelte-7ajgrg{background:none;position:relative;display:inline-block;color:white;margin:0}.formLine.svelte-7ajgrg.svelte-7ajgrg{display:block;margin-bottom:10px}.element-properties.svelte-7ajgrg .formClose.svelte-7ajgrg{position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;width:20px}.slidervalue.svelte-7ajgrg.svelte-7ajgrg{vertical-align:10px;margin-right:10px}.element-properties.svelte-7ajgrg button.svelte-7ajgrg{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:15px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.element-properties.svelte-7ajgrg .delete.svelte-7ajgrg{background-color:red;color:white}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUVsZW1lbnQuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtRWxlbWVudC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XHJcblxyXG4gICAgZXhwb3J0IGxldCBlbGVtZW50O1xyXG4gICAgZXhwb3J0IGxldCBzaG93UHJvcGVydGllcz1mYWxzZVxyXG4gICAgaW1wb3J0IHtsYXllcl9pbWFnZV9wcmV2aWV3fSBmcm9tIFwiLi9pbWFnZXNcIlxyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcclxuICAgIGxldCB2YWx1ZT0xXHJcbiAgICBcclxuICAgIC8vIEZ1bmN0aW9uIHRvIGltbWVkaWF0ZWx5IHVwZGF0ZSB0aGUgcGFyZW50IGNvbXBvbmVudFxyXG4gICAgZnVuY3Rpb24gdXBkYXRlRWxlbWVudCh1cGRhdGVkUHJvcHMpIHtcclxuICAgICAgICBlbGVtZW50PXsgLi4uZWxlbWVudCwgLi4udXBkYXRlZFByb3BzIH1cclxuICAgICAgICBkaXNwYXRjaCgndXBkYXRlJywgZWxlbWVudClcclxuICAgICAgICBpZiAoZWxlbWVudC50eXBlPT09XCJzbGlkZXJcIiB8fCBlbGVtZW50LnR5cGU9PT1cIm51bWJlclwiKSB2YWx1ZT1lbGVtZW50LmRlZmF1bHRcclxuICAgIH1cclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgb3B0aW9uIHVwZGF0ZXMgZm9yIGRyb3Bkb3duc1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlT3B0aW9uQ2hhbmdlKGV2ZW50LCBpbmRleCwga2V5KSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZE9wdGlvbnMgPSBbLi4uZWxlbWVudC5vcHRpb25zXTtcclxuICAgICAgICB1cGRhdGVkT3B0aW9uc1tpbmRleF1ba2V5XSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB1cGRhdGVFbGVtZW50KHsgb3B0aW9uczogdXBkYXRlZE9wdGlvbnMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGEgbmV3IG9wdGlvbiB0byB0aGUgZHJvcGRvd25cclxuICAgIGZ1bmN0aW9uIGFkZE9wdGlvbigpIHtcclxuICAgICAgICB1cGRhdGVFbGVtZW50KHsgb3B0aW9uczogWy4uLmVsZW1lbnQub3B0aW9ucywgeyB0ZXh0OiAnJywga2V5OiAnJyB9XSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgYW4gb3B0aW9uIGZyb20gdGhlIGRyb3Bkb3duXHJcbiAgICBmdW5jdGlvbiByZW1vdmVPcHRpb24oaW5kZXgpIHtcclxuICAgICAgICBjb25zdCB1cGRhdGVkT3B0aW9ucyA9IGVsZW1lbnQub3B0aW9ucy5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KTtcclxuICAgICAgICB1cGRhdGVFbGVtZW50KHsgb3B0aW9uczogdXBkYXRlZE9wdGlvbnMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb3BlblByb3BlcnRpZXMoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goJ29wZW5Qcm9wZXJ0aWVzJyx7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNsb3NlUHJvcGVydGllcygpIHtcclxuICAgICAgICBkaXNwYXRjaCgnY2xvc2VQcm9wZXJ0aWVzJyx7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXCJkZWxldGVcIix7fSlcclxuICAgIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48ZGl2IGNsYXNzPVwiZWxlbWVudC1wcmV2aWV3XCI+XHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImVkaXRFbGVtZW50QnV0dG9uXCIgb246Y2xpY2s9e29wZW5Qcm9wZXJ0aWVzfT5FZGl0PC9kaXY+XHJcbiAgICA8IS0tIEVsZW1lbnQgcHJldmlldyBiYXNlZCBvbiB0eXBlIC0tPlxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGU9PT1cImxheWVyX2ltYWdlXCJ9IFxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJsYXllcl9pbWFnZV9sYWJlbFwiPntlbGVtZW50Lm5hbWV9OjwvbGFiZWw+XHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktbWlzc2luZy1hdHRyaWJ1dGUgLS0+XHJcbiAgICAgICAgPGltZyBuYW1lPVwie2VsZW1lbnQubmFtZX1cIiBzcmM9XCJ7bGF5ZXJfaW1hZ2VfcHJldmlld31cIj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3RleHQnfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0ZXh0SW5wdXRcIiBwbGFjZWhvbGRlcj1cIntlbGVtZW50LnBsYWNlaG9sZGVyfVwiICB2YWx1ZT1cIntlbGVtZW50LmRlZmF1bHR9XCIvPlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ3RleHRhcmVhJ31cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9IGNsYXNzPVwidGV4dGFyZWFfbGFiZWxcIj57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJ0ZXh0YXJlYVwiIHBsYWNlaG9sZGVyPVwie2VsZW1lbnQucGxhY2Vob2xkZXJ9XCIgbmFtZT1cIntlbGVtZW50Lm5hbWV9XCI+e2VsZW1lbnQuZGVmYXVsdH08L3RleHRhcmVhPlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ2NoZWNrYm94J31cclxuICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtlbGVtZW50LmRlZmF1bHQ9PT1cInRydWVcIn0gIC8+IHtlbGVtZW50LmxhYmVsfVxyXG4gICAgICAgIDwvbGFiZWw+XHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAnZHJvcGRvd24nfVxyXG4gICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIGNsYXNzPVwiZHJvcGRvd25cIj5cclxuICAgICAgICAgICAgeyNlYWNoIGVsZW1lbnQub3B0aW9ucyBhcyBvcHRpb259XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb24udmFsdWV9PntvcHRpb24udGV4dH0gPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgIHs6ZWxzZSBpZiBlbGVtZW50LnR5cGUgPT09ICdzbGlkZXInfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJzbGlkZXJfbGFiZWxcIj57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNsaWRlcnZhbHVlXCI+e3ZhbHVlfTwvc3Bhbj48aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtlbGVtZW50Lm1pbn0gbWF4PXtlbGVtZW50Lm1heH0gc3RlcD17ZWxlbWVudC5zdGVwfSB2YWx1ZT1cIntlbGVtZW50LmRlZmF1bHR9XCIgbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgb246Y2hhbmdlPXsoZSkgPT4ge3ZhbHVlPWUudGFyZ2V0LnZhbHVlfX0vPlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcid9XHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj17ZWxlbWVudC5taW59IG1heD17ZWxlbWVudC5tYXh9IHN0ZXA9e2VsZW1lbnQuc3RlcH0gdmFsdWU9XCJ7ZWxlbWVudC5kZWZhdWx0fVwiIG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIC8+XHJcbiAgICB7L2lmfSAgICBcclxuPC9kaXY+XHJcbnsjaWYgc2hvd1Byb3BlcnRpZXN9XHJcbjxkaXYgY2xhc3M9XCJlbGVtZW50LXByb3BlcnRpZXNcIiA+XHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm1DbG9zZVwiIG9uOmNsaWNrPXtjbG9zZVByb3BlcnRpZXN9Plg8L2Rpdj5cclxuICAgIHsjaWYgZWxlbWVudC50eXBlICE9PSAnbGF5ZXJfaW1hZ2UnIH1cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxhYmVsXCI+TGFiZWw6PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImxhYmVsXCIgdmFsdWU9e2VsZW1lbnQubGFiZWx9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IGxhYmVsOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJuYW1lXCI+IE5hbWU6IDwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgIHZhbHVlPXtlbGVtZW50Lm5hbWV9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBuYW1lOiBlLnRhcmdldC52YWx1ZSB9KSB9IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwiZGVmYXVsdFwiPiBEZWZhdWx0IHZhbHVlOiA8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJkZWZhdWx0XCIgdmFsdWU9e2VsZW1lbnQuZGVmYXVsdH0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgZGVmYXVsdDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+ICAgIFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cImhpZGRlblwiPkhpZGRlbjogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJoaWRkZW5cIiBiaW5kOmNoZWNrZWQ9e2VsZW1lbnQuaGlkZGVufSAgLz4gSGlkZSBJbnB1dCBpbiBmb3JtXHJcbiAgICAgICAgPC9kaXY+ICAgICAgIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAndGV4dCcgfHwgZWxlbWVudC50eXBlID09PSAndGV4dGFyZWEnfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cInBsYWNlaG9sZGVyXCI+IFBsYWNlaG9sZGVyOiA8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJwbGFjZWhvbGRlclwiIHZhbHVlPXtlbGVtZW50LnBsYWNlaG9sZGVyfSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBwbGFjZWhvbGRlcjogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+ICBcclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ2xheWVyX2ltYWdlJyB9XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwibmFtZVwiPiBOYW1lOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXtlbGVtZW50Lm5hbWV9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBuYW1lOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJmcm9tX3NlbGVjdGlvblwiPlBpeGVsIERhdGE6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiZnJvbV9zZWxlY3Rpb25cIiBiaW5kOmNoZWNrZWQ9e2VsZW1lbnQuZnJvbV9zZWxlY3Rpb259ICAvPiBGcm9tIFNlbGVjdGlvblxyXG4gICAgICAgIDwvZGl2PiAgICAgIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnZHJvcGRvd24nfVxyXG4gICAgICAgIHsjZWFjaCBlbGVtZW50Lm9wdGlvbnMgYXMgb3B0aW9uLCBpbmRleH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidGV4dFwiPk9wdGlvbiBUZXh0OjwvbGFiZWw+IDxpbnB1dCBuYW1lPVwidGV4dFwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e29wdGlvbi50ZXh0fSBvbjppbnB1dD17KGUpID0+IGhhbmRsZU9wdGlvbkNoYW5nZShlLCBpbmRleCwgJ3RleHQnKX0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImtleVwiPk9wdGlvbiBWYWx1ZTo8L2xhYmVsPiA8aW5wdXQgbmFtZT1cInZhbHVlXCIgdHlwZT1cInRleHRcIiB2YWx1ZT17b3B0aW9uLnZhbHVlfSBvbjppbnB1dD17KGUpID0+IGhhbmRsZU9wdGlvbkNoYW5nZShlLCBpbmRleCwgJ3ZhbHVlJyl9IC8+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKSA9PiByZW1vdmVPcHRpb24oaW5kZXgpfT5SZW1vdmUgT3B0aW9uPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXthZGRPcHRpb259PkFkZCBPcHRpb248L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3NsaWRlcicgfHwgZWxlbWVudC50eXBlID09PSAnbnVtYmVyJ31cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm1pblwiPiBNaW46IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwibWluXCIgdHlwZT1cIm51bWJlclwiIHZhbHVlPXtlbGVtZW50Lm1pbn0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgbWluOiBlLnRhcmdldC52YWx1ZSB9KX0gLz4gIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm1heFwiPiBNYXg6PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJtYXhcIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e2VsZW1lbnQubWF4fSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBtYXg6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PiBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInN0ZXBcIj4gU3RlcDogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJzdGVwXCIgdHlwZT1cIm51bWJlclwiIHZhbHVlPXtlbGVtZW50LnN0ZXB9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IHN0ZXA6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgPC9kaXY+XHJcbiAgICB7L2lmfVxyXG4gICAgPGRpdj48YnV0dG9uIG9uOmNsaWNrPXsoKSA9PiBkZWxldGVFbGVtZW50KCl9IGNsYXNzPVwiZGVsZXRlXCI+RGVsZXRlPC9idXR0b24+PC9kaXY+XHJcblxyXG48L2Rpdj5cclxuey9pZn1cclxuXHJcbjxzdHlsZT5cclxuICAgICoge1xyXG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcblxyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyB7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IC5lZGl0RWxlbWVudEJ1dHRvbiB7XHJcbiAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgcmlnaHQ6MHB4O1xyXG4gICAgICAgIHRvcDogMHB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBwYWRkaW5nOiA1cHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDUxLCA1MSwgNTEpO1xyXG4gICAgICAgIHdpZHRoOjUwcHg7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC5lbGVtZW50LXByZXZpZXc6aG92ZXIgLmVkaXRFbGVtZW50QnV0dG9uIHtcclxuICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgc2VsZWN0IHtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDsgICBcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyBpbnB1dCx0ZXh0YXJlYSB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIGNvbG9yOndoaXRlO1xyXG4gICAgICAgIG1hcmdpbjogMDtcclxuICAgIH1cclxuICAgIC50ZXh0SW5wdXQsLnRleHRhcmVhIHtcclxuICAgICAgICB3aWR0aDogMjgwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IGxhYmVsIHtcclxuICAgICAgICBtaW4td2lkdGg6IDExMHB4O1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLnRleHRhcmVhX2xhYmVsIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyAubGF5ZXJfaW1hZ2VfbGFiZWwge1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiA2MHB4O1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyAuc2xpZGVyX2xhYmVsIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogMTBweDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1MSwgNTEsIDUxKTtcclxuICAgICAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgICAgIGRpc3BsYXk6YmxvY2s7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMgbGFiZWwge1xyXG4gICAgICAgIG1pbi13aWR0aDogMTEwcHg7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyBpbnB1dCx0ZXh0YXJlYSB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIGNvbG9yOndoaXRlO1xyXG4gICAgICAgIG1hcmdpbjogMDtcclxuICAgIH0gICAgXHJcbiAgICAuZm9ybUxpbmUge1xyXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIC5mb3JtQ2xvc2Uge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICByaWdodDowcHg7XHJcbiAgICAgICAgdG9wOiAwcHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgICAgICB3aWR0aDogMjBweDtcclxuICAgIH0gICAgXHJcbiBcclxuICAgIC5zbGlkZXJ2YWx1ZSB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IDEwcHg7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfSBcclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMgYnV0dG9uIHtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgbWluLXdpZHRoOiA3MHB4O1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIC5kZWxldGUge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB9ICAgICAgIFxyXG48L3N0eWxlPlxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUpJLDRCQUFFLENBQ0UsVUFBVSxDQUFFLFVBRWhCLENBQ0EsNENBQWlCLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsYUFBYSxDQUFFLElBQ25CLENBQ0EsOEJBQWdCLENBQUMsZ0NBQW1CLENBQ2hDLE9BQU8sQ0FBRSxJQUFJLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsTUFBTSxHQUFHLENBQ1QsR0FBRyxDQUFFLEdBQUcsQ0FDUixNQUFNLENBQUUsT0FBTyxDQUNmLE9BQU8sQ0FBRSxHQUFHLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDakMsTUFBTSxJQUFJLENBQ1YsVUFBVSxDQUFFLE1BQ2hCLENBRUEsOEJBQWdCLE1BQU0sQ0FBQyxnQ0FBbUIsQ0FDdEMsT0FBTyxDQUFFLEtBQ2IsQ0FDQSw4QkFBZ0IsQ0FBQyxvQkFBTyxDQUNwQixZQUFZLENBQUUsSUFBSSxDQUNsQixnQkFBZ0IsQ0FBRSxLQUFL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 */");
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    // (50:4) {#if element.type==="layer_image"}
    function create_if_block_12$1(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let img;
    	let img_name_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			img = element("img");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "layer_image_label svelte-7ajgrg");
    			add_location(label, file$4, 50, 8, 1699);
    			attr_dev(img, "name", img_name_value = /*element*/ ctx[0].name);
    			if (!src_url_equal(img.src, img_src_value = layer_image_preview)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-7ajgrg");
    			add_location(img, file$4, 52, 8, 1839);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*element*/ 1 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*element*/ 1 && img_name_value !== (img_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(img, "name", img_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(50:4) {#if element.type===\\\"layer_image\\\"}",
    		ctx
    	});

    	return block;
    }

    // (75:40) 
    function create_if_block_11$1(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let input;
    	let input_min_value;
    	let input_max_value;
    	let input_step_value;
    	let input_value_value;
    	let input_name_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$4, 75, 8, 3237);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = input_value_value = /*element*/ ctx[0].default;
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-7ajgrg");
    			add_location(input, file$4, 76, 8, 3297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*element*/ 1 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*element*/ 1 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty & /*element*/ 1 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*element*/ 1 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty & /*element*/ 1 && input_value_value !== (input_value_value = /*element*/ ctx[0].default) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*element*/ 1 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(input, "name", input_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(75:40) ",
    		ctx
    	});

    	return block;
    }

    // (72:40) 
    function create_if_block_10$1(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let span;
    	let t3;
    	let input;
    	let input_min_value;
    	let input_max_value;
    	let input_step_value;
    	let input_value_value;
    	let input_name_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			span = element("span");
    			t3 = text(/*value*/ ctx[2]);
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "slider_label svelte-7ajgrg");
    			add_location(label, file$4, 72, 8, 2897);
    			attr_dev(span, "class", "slidervalue svelte-7ajgrg");
    			add_location(span, file$4, 73, 8, 2978);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = input_value_value = /*element*/ ctx[0].default;
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-7ajgrg");
    			add_location(input, file$4, 73, 48, 3018);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t3);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[10], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*element*/ 1 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*value*/ 4) set_data_dev(t3, /*value*/ ctx[2]);

    			if (dirty & /*element*/ 1 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty & /*element*/ 1 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*element*/ 1 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty & /*element*/ 1 && input_value_value !== (input_value_value = /*element*/ ctx[0].default)) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*element*/ 1 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(input, "name", input_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(72:40) ",
    		ctx
    	});

    	return block;
    }

    // (65:42) 
    function create_if_block_9$1(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let select;
    	let select_name_value;
    	let each_value_1 = /*element*/ ctx[0].options;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$4, 65, 4, 2581);
    			attr_dev(select, "name", select_name_value = /*element*/ ctx[0].name);
    			attr_dev(select, "class", "dropdown svelte-7ajgrg");
    			add_location(select, file$4, 66, 8, 2641);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*element*/ 1 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*element*/ 1) {
    				each_value_1 = /*element*/ ctx[0].options;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*element*/ 1 && select_name_value !== (select_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(select, "name", select_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(65:42) ",
    		ctx
    	});

    	return block;
    }

    // (61:42) 
    function create_if_block_8$2(ctx) {
    	let label;
    	let input;
    	let input_checked_value;
    	let t0;
    	let t1_value = /*element*/ ctx[0].label + "";
    	let t1;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(input, "type", "checkbox");
    			input.checked = input_checked_value = /*element*/ ctx[0].default === "true";
    			attr_dev(input, "class", "svelte-7ajgrg");
    			add_location(input, file$4, 62, 12, 2436);
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$4, 61, 8, 2415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && input_checked_value !== (input_checked_value = /*element*/ ctx[0].default === "true")) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*element*/ 1 && t1_value !== (t1_value = /*element*/ ctx[0].label + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(61:42) ",
    		ctx
    	});

    	return block;
    }

    // (58:42) 
    function create_if_block_7$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let textarea;
    	let textarea_placeholder_value;
    	let textarea_name_value;
    	let textarea_value_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			textarea = element("textarea");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "textarea_label svelte-7ajgrg");
    			add_location(label, file$4, 58, 8, 2165);
    			attr_dev(textarea, "class", "textarea svelte-7ajgrg");
    			attr_dev(textarea, "placeholder", textarea_placeholder_value = /*element*/ ctx[0].placeholder);
    			attr_dev(textarea, "name", textarea_name_value = /*element*/ ctx[0].name);
    			textarea.value = textarea_value_value = /*element*/ ctx[0].default;
    			add_location(textarea, file$4, 59, 8, 2248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, textarea, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*element*/ 1 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*element*/ 1 && textarea_placeholder_value !== (textarea_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(textarea, "placeholder", textarea_placeholder_value);
    			}

    			if (dirty & /*element*/ 1 && textarea_name_value !== (textarea_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(textarea, "name", textarea_name_value);
    			}

    			if (dirty & /*element*/ 1 && textarea_value_value !== (textarea_value_value = /*element*/ ctx[0].default)) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(textarea);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(58:42) ",
    		ctx
    	});

    	return block;
    }

    // (55:4) {#if element.type === 'text'}
    function create_if_block_6$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let input;
    	let input_placeholder_value;
    	let input_value_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$4, 55, 8, 1950);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "textInput svelte-7ajgrg");
    			attr_dev(input, "placeholder", input_placeholder_value = /*element*/ ctx[0].placeholder);
    			input.value = input_value_value = /*element*/ ctx[0].default;
    			add_location(input, file$4, 56, 8, 2010);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*element*/ 1 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*element*/ 1 && input_placeholder_value !== (input_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*element*/ 1 && input_value_value !== (input_value_value = /*element*/ ctx[0].default) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(55:4) {#if element.type === 'text'}",
    		ctx
    	});

    	return block;
    }

    // (68:12) {#each element.options as option}
    function create_each_block_1$2(ctx) {
    	let option;
    	let t0_value = /*option*/ ctx[26].text + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*option*/ ctx[26].value;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-7ajgrg");
    			add_location(option, file$4, 68, 16, 2753);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && t0_value !== (t0_value = /*option*/ ctx[26].text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*element*/ 1 && option_value_value !== (option_value_value = /*option*/ ctx[26].value)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(68:12) {#each element.options as option}",
    		ctx
    	});

    	return block;
    }

    // (80:0) {#if showProperties}
    function create_if_block$3(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let if_block0 = /*element*/ ctx[0].type !== 'layer_image' && create_if_block_5$2(ctx);
    	let if_block1 = (/*element*/ ctx[0].type === 'text' || /*element*/ ctx[0].type === 'textarea') && create_if_block_4$2(ctx);
    	let if_block2 = /*element*/ ctx[0].type === 'layer_image' && create_if_block_3$2(ctx);
    	let if_block3 = /*element*/ ctx[0].type === 'dropdown' && create_if_block_2$3(ctx);
    	let if_block4 = (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "X";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(div0, "class", "formClose svelte-7ajgrg");
    			add_location(div0, file$4, 82, 4, 3572);
    			attr_dev(button, "class", "delete svelte-7ajgrg");
    			add_location(button, file$4, 143, 9, 6863);
    			attr_dev(div1, "class", "svelte-7ajgrg");
    			add_location(div1, file$4, 143, 4, 6858);
    			attr_dev(div2, "class", "element-properties svelte-7ajgrg");
    			add_location(div2, file$4, 80, 0, 3471);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t5);
    			if (if_block4) if_block4.m(div2, null);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*closeProperties*/ ctx[8], false, false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[24], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*element*/ ctx[0].type !== 'layer_image') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$2(ctx);
    					if_block0.c();
    					if_block0.m(div2, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*element*/ ctx[0].type === 'text' || /*element*/ ctx[0].type === 'textarea') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$2(ctx);
    					if_block1.c();
    					if_block1.m(div2, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*element*/ ctx[0].type === 'layer_image') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$2(ctx);
    					if_block2.c();
    					if_block2.m(div2, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*element*/ ctx[0].type === 'dropdown') {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2$3(ctx);
    					if_block3.c();
    					if_block3.m(div2, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_1$3(ctx);
    					if_block4.c();
    					if_block4.m(div2, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(80:0) {#if showProperties}",
    		ctx
    	});

    	return block;
    }

    // (84:4) {#if element.type !== 'layer_image' }
    function create_if_block_5$2(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let input1_value_value;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let input2;
    	let input2_value_value;
    	let t8;
    	let div3;
    	let label3;
    	let t10;
    	let input3;
    	let t11;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Label:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Name:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Default value:";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Hidden:";
    			t10 = space();
    			input3 = element("input");
    			t11 = text(" Hide Input in form");
    			attr_dev(label0, "for", "label");
    			attr_dev(label0, "class", "svelte-7ajgrg");
    			add_location(label0, file$4, 85, 12, 3718);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "label");
    			input0.value = input0_value_value = /*element*/ ctx[0].label;
    			attr_dev(input0, "class", "svelte-7ajgrg");
    			add_location(input0, file$4, 86, 12, 3765);
    			attr_dev(div0, "class", "formLine svelte-7ajgrg");
    			add_location(div0, file$4, 84, 8, 3682);
    			attr_dev(label1, "for", "name");
    			attr_dev(label1, "class", "svelte-7ajgrg");
    			add_location(label1, file$4, 89, 12, 3942);
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*element*/ ctx[0].name;
    			attr_dev(input1, "class", "svelte-7ajgrg");
    			add_location(input1, file$4, 90, 8, 3986);
    			attr_dev(div1, "class", "formLine svelte-7ajgrg");
    			add_location(div1, file$4, 88, 8, 3906);
    			attr_dev(label2, "for", "default");
    			attr_dev(label2, "class", "svelte-7ajgrg");
    			add_location(label2, file$4, 93, 12, 4151);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "default");
    			input2.value = input2_value_value = /*element*/ ctx[0].default;
    			attr_dev(input2, "class", "svelte-7ajgrg");
    			add_location(input2, file$4, 94, 8, 4207);
    			attr_dev(div2, "class", "formLine svelte-7ajgrg");
    			add_location(div2, file$4, 92, 8, 4115);
    			attr_dev(label3, "for", "hidden");
    			attr_dev(label3, "class", "svelte-7ajgrg");
    			add_location(label3, file$4, 97, 12, 4394);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "name", "hidden");
    			attr_dev(input3, "class", "svelte-7ajgrg");
    			add_location(input3, file$4, 98, 12, 4445);
    			attr_dev(div3, "class", "formLine svelte-7ajgrg");
    			add_location(div3, file$4, 96, 8, 4358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, label3);
    			append_dev(div3, t10);
    			append_dev(div3, input3);
    			input3.checked = /*element*/ ctx[0].hidden;
    			append_dev(div3, t11);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input_handler*/ ctx[11], false, false, false, false),
    					listen_dev(input1, "change", /*change_handler_1*/ ctx[12], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_1*/ ctx[13], false, false, false, false),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[14])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].label) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*element*/ 1 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].name) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty & /*element*/ 1 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].default) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}

    			if (dirty & /*element*/ 1) {
    				input3.checked = /*element*/ ctx[0].hidden;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(84:4) {#if element.type !== 'layer_image' }",
    		ctx
    	});

    	return block;
    }

    // (102:4) {#if element.type === 'text' || element.type === 'textarea'}
    function create_if_block_4$2(ctx) {
    	let div;
    	let label;
    	let t1;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Placeholder:";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "for", "placeholder");
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$4, 103, 12, 4680);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "placeholder");
    			input.value = input_value_value = /*element*/ ctx[0].placeholder;
    			attr_dev(input, "class", "svelte-7ajgrg");
    			add_location(input, file$4, 104, 8, 4738);
    			attr_dev(div, "class", "formLine svelte-7ajgrg");
    			add_location(div, file$4, 102, 8, 4644);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler_2*/ ctx[15], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && input_value_value !== (input_value_value = /*element*/ ctx[0].placeholder) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(102:4) {#if element.type === 'text' || element.type === 'textarea'}",
    		ctx
    	});

    	return block;
    }

    // (108:4) {#if element.type === 'layer_image' }
    function create_if_block_3$2(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Pixel Data:";
    			t4 = space();
    			input1 = element("input");
    			t5 = text(" From Selection");
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-7ajgrg");
    			add_location(label0, file$4, 109, 12, 4989);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			input0.value = input0_value_value = /*element*/ ctx[0].name;
    			attr_dev(input0, "class", "svelte-7ajgrg");
    			add_location(input0, file$4, 110, 12, 5037);
    			attr_dev(div0, "class", "formLine svelte-7ajgrg");
    			add_location(div0, file$4, 108, 8, 4953);
    			attr_dev(label1, "for", "from_selection");
    			attr_dev(label1, "class", "svelte-7ajgrg");
    			add_location(label1, file$4, 113, 12, 5212);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "from_selection");
    			attr_dev(input1, "class", "svelte-7ajgrg");
    			add_location(input1, file$4, 114, 12, 5275);
    			attr_dev(div1, "class", "formLine svelte-7ajgrg");
    			add_location(div1, file$4, 112, 8, 5176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			input1.checked = /*element*/ ctx[0].from_selection;
    			append_dev(div1, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler_2*/ ctx[16], false, false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[17])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].name) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*element*/ 1) {
    				input1.checked = /*element*/ ctx[0].from_selection;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(108:4) {#if element.type === 'layer_image' }",
    		ctx
    	});

    	return block;
    }

    // (118:4) {#if element.type === 'dropdown'}
    function create_if_block_2$3(ctx) {
    	let t0;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*element*/ ctx[0].options;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			button.textContent = "Add Option";
    			attr_dev(button, "class", "svelte-7ajgrg");
    			add_location(button, file$4, 127, 8, 6055);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addOption*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*removeOption, element, handleOptionChange*/ 81) {
    				each_value = /*element*/ ctx[0].options;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(118:4) {#if element.type === 'dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (119:8) {#each element.options as option, index}
    function create_each_block$3(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let input1_value_value;
    	let t5;
    	let button;
    	let mounted;
    	let dispose;

    	function input_handler_3(...args) {
    		return /*input_handler_3*/ ctx[18](/*index*/ ctx[28], ...args);
    	}

    	function input_handler_4(...args) {
    		return /*input_handler_4*/ ctx[19](/*index*/ ctx[28], ...args);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[20](/*index*/ ctx[28]);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Option Text:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Option Value:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			button = element("button");
    			button.textContent = "Remove Option";
    			attr_dev(label0, "for", "text");
    			attr_dev(label0, "class", "svelte-7ajgrg");
    			add_location(label0, file$4, 120, 16, 5552);
    			attr_dev(input0, "name", "text");
    			attr_dev(input0, "type", "text");
    			input0.value = input0_value_value = /*option*/ ctx[26].text;
    			attr_dev(input0, "class", "svelte-7ajgrg");
    			add_location(input0, file$4, 120, 55, 5591);
    			attr_dev(div0, "class", "formLine svelte-7ajgrg");
    			add_location(div0, file$4, 119, 12, 5512);
    			attr_dev(label1, "for", "key");
    			attr_dev(label1, "class", "svelte-7ajgrg");
    			add_location(label1, file$4, 123, 16, 5773);
    			attr_dev(input1, "name", "value");
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*option*/ ctx[26].value;
    			attr_dev(input1, "class", "svelte-7ajgrg");
    			add_location(input1, file$4, 123, 55, 5812);
    			attr_dev(button, "class", "svelte-7ajgrg");
    			add_location(button, file$4, 124, 16, 5941);
    			attr_dev(div1, "class", "formLine svelte-7ajgrg");
    			add_location(div1, file$4, 122, 12, 5733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			append_dev(div1, t5);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input_handler_3, false, false, false, false),
    					listen_dev(input1, "input", input_handler_4, false, false, false, false),
    					listen_dev(button, "click", click_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*element*/ 1 && input0_value_value !== (input0_value_value = /*option*/ ctx[26].text) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*element*/ 1 && input1_value_value !== (input1_value_value = /*option*/ ctx[26].value) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(119:8) {#each element.options as option, index}",
    		ctx
    	});

    	return block;
    }

    // (130:4) {#if element.type === 'slider' || element.type === 'number'}
    function create_if_block_1$3(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_value_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let input1_value_value;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let input2;
    	let input2_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Min:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Max:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Step:";
    			t7 = space();
    			input2 = element("input");
    			attr_dev(label0, "for", "min");
    			attr_dev(label0, "class", "svelte-7ajgrg");
    			add_location(label0, file$4, 131, 12, 6226);
    			attr_dev(input0, "name", "min");
    			attr_dev(input0, "type", "number");
    			input0.value = input0_value_value = /*element*/ ctx[0].min;
    			attr_dev(input0, "class", "svelte-7ajgrg");
    			add_location(input0, file$4, 132, 12, 6271);
    			attr_dev(div0, "class", "formLine svelte-7ajgrg");
    			add_location(div0, file$4, 130, 8, 6190);
    			attr_dev(label1, "for", "max");
    			attr_dev(label1, "class", "svelte-7ajgrg");
    			add_location(label1, file$4, 135, 12, 6446);
    			attr_dev(input1, "name", "max");
    			attr_dev(input1, "type", "number");
    			input1.value = input1_value_value = /*element*/ ctx[0].max;
    			attr_dev(input1, "class", "svelte-7ajgrg");
    			add_location(input1, file$4, 136, 12, 6491);
    			attr_dev(div1, "class", "formLine svelte-7ajgrg");
    			add_location(div1, file$4, 134, 8, 6410);
    			attr_dev(label2, "for", "step");
    			attr_dev(label2, "class", "svelte-7ajgrg");
    			add_location(label2, file$4, 139, 12, 6665);
    			attr_dev(input2, "name", "step");
    			attr_dev(input2, "type", "number");
    			input2.value = input2_value_value = /*element*/ ctx[0].step;
    			attr_dev(input2, "class", "svelte-7ajgrg");
    			add_location(input2, file$4, 140, 12, 6712);
    			attr_dev(div2, "class", "formLine svelte-7ajgrg");
    			add_location(div2, file$4, 138, 8, 6629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input_handler_5*/ ctx[21], false, false, false, false),
    					listen_dev(input1, "input", /*input_handler_6*/ ctx[22], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_7*/ ctx[23], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*element*/ 1 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].min) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*element*/ 1 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].max) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty & /*element*/ 1 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].step) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(130:4) {#if element.type === 'slider' || element.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let if_block2_anchor;
    	let mounted;
    	let dispose;
    	let if_block0 = /*element*/ ctx[0].type === "layer_image" && create_if_block_12$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*element*/ ctx[0].type === 'text') return create_if_block_6$2;
    		if (/*element*/ ctx[0].type === 'textarea') return create_if_block_7$2;
    		if (/*element*/ ctx[0].type === 'checkbox') return create_if_block_8$2;
    		if (/*element*/ ctx[0].type === 'dropdown') return create_if_block_9$1;
    		if (/*element*/ ctx[0].type === 'slider') return create_if_block_10$1;
    		if (/*element*/ ctx[0].type === 'number') return create_if_block_11$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);
    	let if_block2 = /*showProperties*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Edit";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div0, "class", "editElementButton svelte-7ajgrg");
    			add_location(div0, file$4, 47, 4, 1537);
    			attr_dev(div1, "class", "element-preview svelte-7ajgrg");
    			add_location(div1, file$4, 45, 0, 1440);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*openProperties*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*element*/ ctx[0].type === "layer_image") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_12$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			}

    			if (/*showProperties*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();

    			if (if_block1) {
    				if_block1.d();
    			}

    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormElement', slots, []);
    	let { element } = $$props;
    	let { showProperties = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let value = 1;

    	// Function to immediately update the parent component
    	function updateElement(updatedProps) {
    		$$invalidate(0, element = { ...element, ...updatedProps });
    		dispatch('update', element);
    		if (element.type === "slider" || element.type === "number") $$invalidate(2, value = element.default);
    	}

    	// Function to handle option updates for dropdowns
    	function handleOptionChange(event, index, key) {
    		const updatedOptions = [...element.options];
    		updatedOptions[index][key] = event.target.value;
    		updateElement({ options: updatedOptions });
    	}

    	// Add a new option to the dropdown
    	function addOption() {
    		updateElement({
    			options: [...element.options, { text: '', key: '' }]
    		});
    	}

    	// Remove an option from the dropdown
    	function removeOption(index) {
    		const updatedOptions = element.options.filter((_, i) => i !== index);
    		updateElement({ options: updatedOptions });
    	}

    	function openProperties() {
    		dispatch('openProperties', {});
    	}

    	function closeProperties() {
    		dispatch('closeProperties', {});
    	}

    	function deleteElement() {
    		dispatch("delete", {});
    	}

    	$$self.$$.on_mount.push(function () {
    		if (element === undefined && !('element' in $$props || $$self.$$.bound[$$self.$$.props['element']])) {
    			console.warn("<FormElement> was created without expected prop 'element'");
    		}
    	});

    	const writable_props = ['element', 'showProperties'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormElement> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => {
    		$$invalidate(2, value = e.target.value);
    	};

    	const input_handler = e => updateElement({ label: e.target.value });
    	const change_handler_1 = e => updateElement({ name: e.target.value });
    	const input_handler_1 = e => updateElement({ default: e.target.value });

    	function input3_change_handler() {
    		element.hidden = this.checked;
    		$$invalidate(0, element);
    	}

    	const input_handler_2 = e => updateElement({ placeholder: e.target.value });
    	const change_handler_2 = e => updateElement({ name: e.target.value });

    	function input1_change_handler() {
    		element.from_selection = this.checked;
    		$$invalidate(0, element);
    	}

    	const input_handler_3 = (index, e) => handleOptionChange(e, index, 'text');
    	const input_handler_4 = (index, e) => handleOptionChange(e, index, 'value');
    	const click_handler = index => removeOption(index);
    	const input_handler_5 = e => updateElement({ min: e.target.value });
    	const input_handler_6 = e => updateElement({ max: e.target.value });
    	const input_handler_7 = e => updateElement({ step: e.target.value });
    	const click_handler_1 = () => deleteElement();

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('showProperties' in $$props) $$invalidate(1, showProperties = $$props.showProperties);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		element,
    		showProperties,
    		layer_image_preview,
    		dispatch,
    		value,
    		updateElement,
    		handleOptionChange,
    		addOption,
    		removeOption,
    		openProperties,
    		closeProperties,
    		deleteElement
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('showProperties' in $$props) $$invalidate(1, showProperties = $$props.showProperties);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		showProperties,
    		value,
    		updateElement,
    		handleOptionChange,
    		addOption,
    		removeOption,
    		openProperties,
    		closeProperties,
    		deleteElement,
    		change_handler,
    		input_handler,
    		change_handler_1,
    		input_handler_1,
    		input3_change_handler,
    		input_handler_2,
    		change_handler_2,
    		input1_change_handler,
    		input_handler_3,
    		input_handler_4,
    		click_handler,
    		input_handler_5,
    		input_handler_6,
    		input_handler_7,
    		click_handler_1
    	];
    }

    class FormElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { element: 0, showProperties: 1 }, add_css$5);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormElement",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get element() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showProperties() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showProperties(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const metadata = writable({
        tags: [],
        forms: { default: {elements:{}}},
        rules: [],
        mappings: []
    });

    /* src\FormBuilder.svelte generated by Svelte v3.59.2 */
    const file$3 = "src\\FormBuilder.svelte";

    function add_css$4(target) {
    	append_styles(target, "svelte-1hwnlto", ".formBuilder.svelte-1hwnlto.svelte-1hwnlto{padding:10px;color:white;width:470px;display:block}.formBuilder.svelte-1hwnlto h1.svelte-1hwnlto{font-size:18px}.draggable.svelte-1hwnlto.svelte-1hwnlto{cursor:grab}.form.svelte-1hwnlto.svelte-1hwnlto{border-radius:5px;background-color:black;width:450px;padding:10px;color:white;font:\"Segoe UI\", Roboto, system-ui;font-size:14px;margin-bottom:10px}.formBuilder.svelte-1hwnlto .add_field_select_label.svelte-1hwnlto{display:inline-block}.formBuilder.svelte-1hwnlto .add_field_select.svelte-1hwnlto{margin-right:10px;background-color:black;color:white;padding:5px;display:inline-block}.formBuilder.svelte-1hwnlto button.svelte-1hwnlto{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:15px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUJ1aWxkZXIuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtQnVpbGRlci5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICBpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XHJcbiAgaW1wb3J0IEZvcm1FbGVtZW50IGZyb20gJy4vRm9ybUVsZW1lbnQuc3ZlbHRlJztcclxuICBpbXBvcnQgeyBtZXRhZGF0YX0gZnJvbSAnLi9zdG9yZXMvbWV0YWRhdGEnXHJcbiAgaWYgKCEkbWV0YWRhdGEuZm9ybXMpICRtZXRhZGF0YS5mb3Jtcz17fVxyXG5cclxuICBleHBvcnQgbGV0IGZvcm1fa2V5PSdkZWZhdWx0JyAgLy8gc3VwcG9ydCBmb3IgbXVsdGlwbGUgZm9ybXMgKGUuZy4gd2l6YXJkcykgaW4gdGhlIGZ1dHVyZVxyXG4gIGlmICghJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XSkgJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XT17ZWxlbWVudHM6W119XHJcbiAgaWYgKCEkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldLmVsZW1lbnRzKSAkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldLmVsZW1lbnRzPVtdXHJcbiAgbGV0IGZvcm1FbGVtZW50cyA9ICRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0uZWxlbWVudHNcclxuICBsZXQgZHJhZ1N0YXJ0SW5kZXg9LTFcclxuICBsZXQgc2hvd1Byb3BlcnRpZXNJZHg9LTFcclxuICBsZXQgc2VsZWN0ZWRUeXBlO1xyXG4gIGZ1bmN0aW9uIGFkZEVsZW1lbnQodHlwZSkge1xyXG4gICAgaWYgKCF0eXBlKSByZXR1cm5cclxuICAgIGxldCBuYW1lPVwidmFsdWVfXCIrTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDUpXHJcbiAgICBcclxuICAgIGxldCBuZXdFbGVtZW50ID0ge1xyXG4gICAgICBuYW1lOiBuYW1lLCAvLyBVbmlxdWUgSUQgZm9yIGtleSB0cmFja2luZyBhbmQgcmVhY3Rpdml0eVxyXG4gICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICBsYWJlbDogbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSksXHJcbiAgICAgIG5hbWU6IG5hbWUsIC8vIEV4YW1wbGUgbmFtaW5nIGNvbnZlbnRpb25cclxuICAgICAgb3B0aW9uczogdHlwZSA9PT0gJ2Ryb3Bkb3duJyA/IFt7IHRleHQ6ICdPcHRpb24gMScsIGtleTogJzEnIH1dIDogW10sXHJcbiAgICAgIGRlZmF1bHQ6IFwiXCJcclxuICAgIH1cclxuICAgIGlmICh0eXBlPT09XCJzbGlkZXJcIiB8fCB0eXBlPT09XCJudW1iZXJcIikge1xyXG4gICAgICBuZXdFbGVtZW50Lm1pbj0xXHJcbiAgICAgIG5ld0VsZW1lbnQubWF4PTIwXHJcbiAgICAgIG5ld0VsZW1lbnQuc3RlcD0xXHJcbiAgICAgIG5ld0VsZW1lbnQuZGVmYXVsdD0xXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZT09PVwiY2hlY2tib3hcIikge1xyXG4gICAgICBuZXdFbGVtZW50LmRlZmF1bHQ9ZmFsc2VcclxuICAgIH1cclxuICAgIGlmICh0eXBlPT09XCJ0ZXh0XCIgfHwgdHlwZT09PVwidGV4dGFyZWFcIikge1xyXG4gICAgICBuZXdFbGVtZW50LnBsYWNlaG9sZGVyPVwiXCJcclxuICAgIH1cclxuICAgIGZvcm1FbGVtZW50cy5wdXNoKG5ld0VsZW1lbnQpXHJcbiAgICBmb3JtRWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbiAgICBzaG93UHJvcGVydGllc0lkeD1mb3JtRWxlbWVudHMubGVuZ3RoLTFcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZURyYWdTdGFydChldmVudCwgaW5kZXgpIHtcclxuICAgIGRyYWdTdGFydEluZGV4ID0gaW5kZXg7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVEcmFnT3ZlcihldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gTmVjZXNzYXJ5IHRvIGFsbG93IGRyb3BwaW5nXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVEcm9wKGV2ZW50LCBkcm9wSW5kZXgpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoZHJhZ1N0YXJ0SW5kZXggPT09IGRyb3BJbmRleCkgcmV0dXJuXHJcbiAgICBcclxuICAgIGNvbnN0IGRyYWdnZWRJdGVtID0gZm9ybUVsZW1lbnRzW2RyYWdTdGFydEluZGV4XTtcclxuICAgIGNvbnN0IHJlbWFpbmluZ0l0ZW1zID0gZm9ybUVsZW1lbnRzLmZpbHRlcigoXywgaW5kZXgpID0+IGluZGV4ICE9PSBkcmFnU3RhcnRJbmRleClcclxuICAgIGNvbnN0IHJlb3JkZXJlZEl0ZW1zID0gW1xyXG4gICAgICAgIC4uLnJlbWFpbmluZ0l0ZW1zLnNsaWNlKDAsIGRyb3BJbmRleCksXHJcbiAgICAgICAgZHJhZ2dlZEl0ZW0sXHJcbiAgICAgICAgLi4ucmVtYWluaW5nSXRlbXMuc2xpY2UoZHJvcEluZGV4KVxyXG4gICAgXVxyXG4gICAgLy8gUmVhc3NpZ24gdGhlIHJlb3JkZXJlZCBpdGVtcyBiYWNrIHRvIGZvcm1FbGVtZW50c1xyXG4gICAgZm9ybUVsZW1lbnRzID0gcmVvcmRlcmVkSXRlbXNcclxuICAgIGZvcm1FbGVtZW50cz1mb3JtRWxlbWVudHNcclxuICAgIC8vIFJlc2V0IGRyYWdnZWQgaW5kZXhcclxuICAgIGRyYWdTdGFydEluZGV4ID0gLTFcclxufVxyXG5cclxuICBmdW5jdGlvbiByZW1vdmVFbGVtZW50KGluZGV4KSB7XHJcbiAgICBmb3JtRWxlbWVudHMudXBkYXRlKGVsZW1lbnRzID0+IGVsZW1lbnRzLmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpKTtcclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuXHJcblxyXG48ZGl2IGNsYXNzPVwiZm9ybUJ1aWxkZXJcIj5cclxuPGgxPkVkaXQgZm9ybTwvaDE+XHJcbjxkaXYgY2xhc3M9XCJmb3JtXCI+XHJcbiAgeyNlYWNoIGZvcm1FbGVtZW50cyBhcyBlbGVtZW50LCBpbmRleCAoZWxlbWVudC5uYW1lKX1cclxuICAgIDxkaXZcclxuICAgICAgY2xhc3M9XCJkcmFnZ2FibGVcIlxyXG4gICAgICBkcmFnZ2FibGU9XCJ0cnVlXCJcclxuICAgICAgb246ZHJhZ3N0YXJ0PXsoKSA9PiBoYW5kbGVEcmFnU3RhcnQoZXZlbnQsIGluZGV4KX1cclxuICAgICAgb246ZHJhZ292ZXI9e2hhbmRsZURyYWdPdmVyfVxyXG4gICAgICBvbjpkcm9wPXsoKSA9PiBoYW5kbGVEcm9wKGV2ZW50LCBpbmRleCl9PlxyXG4gICAgICA8Rm9ybUVsZW1lbnQge2VsZW1lbnR9IFxyXG4gICAgICAgIG9uOnJlbW92ZT17KCkgPT4gcmVtb3ZlRWxlbWVudChpbmRleCl9ICBcclxuICAgICAgICBvbjpvcGVuUHJvcGVydGllcz17KCkgPT4ge3Nob3dQcm9wZXJ0aWVzSWR4PWluZGV4IH19IFxyXG4gICAgICAgIG9uOmNsb3NlUHJvcGVydGllcz17KCkgPT4ge3Nob3dQcm9wZXJ0aWVzSWR4PS0xIH19XHJcbiAgICAgICAgb246dXBkYXRlPXsoZSkgPT4geyBmb3JtRWxlbWVudHNbaW5kZXhdPWUuZGV0YWlsIH19XHJcbiAgICAgICAgb246ZGVsZXRlPXsoZSkgPT4geyBmb3JtRWxlbWVudHMuc3BsaWNlKHNob3dQcm9wZXJ0aWVzSWR4LDEpO2Zvcm1FbGVtZW50cz1mb3JtRWxlbWVudHM7c2hvd1Byb3BlcnRpZXNJZHg9LTEgfX1cclxuICAgICAgICBzaG93UHJvcGVydGllcz17c2hvd1Byb3BlcnRpZXNJZHg9PT1pbmRleH0vPlxyXG4gICAgICA8L2Rpdj5cclxuICB7L2VhY2h9XHJcbjwvZGl2PlxyXG48ZGl2PlxyXG48bGFiZWwgZm9yPVwiYWRkX2ZpZWxkX3NlbGVjdFwiIGNsYXNzPVwiYWRkX2ZpZWxkX3NlbGVjdF9sYWJlbFwiPiBBZGQgZm9ybSBmaWVsZDo8L2xhYmVsPiBcclxuICA8c2VsZWN0IGNsYXNzPVwiYWRkX2ZpZWxkX3NlbGVjdFwiIG5hbWU9XCJhZGRfZmllbGRfc2VsZWN0XCIgYmluZDp2YWx1ZT17c2VsZWN0ZWRUeXBlfT5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJ0ZXh0XCI+VGV4dCBJbnB1dDwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cInRleHRhcmVhXCI+VGV4dGFyZWE8L29wdGlvbj5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJjaGVja2JveFwiPkNoZWNrYm94PC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwiZHJvcGRvd25cIj5Ecm9wZG93bjwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cInNsaWRlclwiPlNsaWRlcjwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cIm51bWJlclwiPk51bWJlcjwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cImxheWVyX2ltYWdlXCI+TGF5ZXIgSW1hZ2U8L29wdGlvbj5cclxuICA8L3NlbGVjdD5cclxuICA8YnV0dG9uIG9uOmNsaWNrPXsoKSA9PiBhZGRFbGVtZW50KHNlbGVjdGVkVHlwZSl9PkFkZDwvYnV0dG9uPlxyXG48L2Rpdj5cclxuPC9kaXY+XHJcbjxzdHlsZT5cclxuICAuZm9ybUJ1aWxkZXIge1xyXG4gICAgcGFkZGluZzogMTBweDtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIHdpZHRoOiA0NzBweDtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gIH1cclxuICAuZm9ybUJ1aWxkZXIgaDEge1xyXG4gICAgZm9udC1zaXplOjE4cHg7XHJcbiAgfVxyXG4gIC5kcmFnZ2FibGUge1xyXG4gICAgY3Vyc29yOiBncmFiO1xyXG4gIH1cclxuICAuZm9ybSB7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgIHdpZHRoOiA0NTBweDtcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBmb250OiBcIlNlZ29lIFVJXCIsIFJvYm90bywgc3lzdGVtLXVpO1xyXG4gICAgZm9udC1zaXplOjE0cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gIH1cclxuICAuZm9ybUJ1aWxkZXIgLmFkZF9maWVsZF9zZWxlY3RfbGFiZWwge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIH1cclxuICAuZm9ybUJ1aWxkZXIgLmFkZF9maWVsZF9zZWxlY3Qge1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgcGFkZGluZzogNXB4OyAgIFxyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcbiAgICAuZm9ybUJ1aWxkZXIgYnV0dG9uIHtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgbWluLXdpZHRoOiA3MHB4O1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQStHRSwwQ0FBYSxDQUNYLE9BQU8sQ0FBRSxJQUFJLENBQ2IsS0FBSyxDQUFFLEtBQUssQ0FDWixLQUFLLENBQUUsS0FBSyxDQUNaLE9BQU8sQ0FBRSxLQUNYLENBQ0EsMkJBQVksQ0FBQyxpQkFBRyxDQUNkLFVBQVUsSUFDWixDQUNBLHdDQUFXLENBQ1QsTUFBTSxDQUFFLElBQ1YsQ0FDQSxtQ0FBTSxDQUNKLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxLQUFLLENBQ1osSUFBSSxDQUFFLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FDbkMsVUFBVSxJQUFJLENBQ2QsYUFBYSxDQUFFLElBQ2pCLENBQ0EsMkJBQVksQ0FBQyxzQ0FBd0IsQ0FDbkMsT0FBTyxDQUFFLFlBQ1gsQ0FDQSwyQkFBWSxDQUFDLGdDQUFrQixDQUN6QixZQUFZLENBQUUsSUFBSSxDQUNsQixnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLEtBQUssQ0FBRSxLQUFLLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FDWixPQUFPLENBQUUsWUFDZixDQUNFLDJCQUFZLENBQUMscUJBQU8sQ0FDaEIsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksU0FBUyxDQUFFLElBQUksQ0FDZixTQUFTLENBQUUsSUFBSSxDQUNmLEtBQUssQ0FBRSxLQUFLLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDcEMsWUFBWSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ2hDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsWUFBWSxDQUFFLElBQ2xCIn0= */");
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (79:2) {#each formElements as element, index (element.name)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let formelement;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	function remove_handler() {
    		return /*remove_handler*/ ctx[8](/*index*/ ctx[21]);
    	}

    	function openProperties_handler() {
    		return /*openProperties_handler*/ ctx[9](/*index*/ ctx[21]);
    	}

    	function update_handler(...args) {
    		return /*update_handler*/ ctx[11](/*index*/ ctx[21], ...args);
    	}

    	formelement = new FormElement({
    			props: {
    				element: /*element*/ ctx[19],
    				showProperties: /*showPropertiesIdx*/ ctx[1] === /*index*/ ctx[21]
    			},
    			$$inline: true
    		});

    	formelement.$on("remove", remove_handler);
    	formelement.$on("openProperties", openProperties_handler);
    	formelement.$on("closeProperties", /*closeProperties_handler*/ ctx[10]);
    	formelement.$on("update", update_handler);
    	formelement.$on("delete", /*delete_handler*/ ctx[12]);

    	function dragstart_handler() {
    		return /*dragstart_handler*/ ctx[13](/*index*/ ctx[21]);
    	}

    	function drop_handler() {
    		return /*drop_handler*/ ctx[14](/*index*/ ctx[21]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(formelement.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "draggable svelte-1hwnlto");
    			attr_dev(div, "draggable", "true");
    			add_location(div, file$3, 79, 4, 2496);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(formelement, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "dragstart", dragstart_handler, false, false, false, false),
    					listen_dev(div, "dragover", handleDragOver, false, false, false, false),
    					listen_dev(div, "drop", drop_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formelement_changes = {};
    			if (dirty & /*formElements*/ 1) formelement_changes.element = /*element*/ ctx[19];
    			if (dirty & /*showPropertiesIdx, formElements*/ 3) formelement_changes.showProperties = /*showPropertiesIdx*/ ctx[1] === /*index*/ ctx[21];
    			formelement.$set(formelement_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formelement.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formelement.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(formelement);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(79:2) {#each formElements as element, index (element.name)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let h1;
    	let t1;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t2;
    	let div1;
    	let label;
    	let t4;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let t13;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*formElements*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*element*/ ctx[19].name;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Edit form";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Add form field:";
    			t4 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Select...";
    			option1 = element("option");
    			option1.textContent = "Text Input";
    			option2 = element("option");
    			option2.textContent = "Textarea";
    			option3 = element("option");
    			option3.textContent = "Checkbox";
    			option4 = element("option");
    			option4.textContent = "Dropdown";
    			option5 = element("option");
    			option5.textContent = "Slider";
    			option6 = element("option");
    			option6.textContent = "Number";
    			option7 = element("option");
    			option7.textContent = "Layer Image";
    			t13 = space();
    			button = element("button");
    			button.textContent = "Add";
    			attr_dev(h1, "class", "svelte-1hwnlto");
    			add_location(h1, file$3, 76, 0, 2395);
    			attr_dev(div0, "class", "form svelte-1hwnlto");
    			add_location(div0, file$3, 77, 0, 2415);
    			attr_dev(label, "for", "add_field_select");
    			attr_dev(label, "class", "add_field_select_label svelte-1hwnlto");
    			add_location(label, file$3, 96, 0, 3173);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$3, 98, 4, 3352);
    			option1.__value = "text";
    			option1.value = option1.__value;
    			add_location(option1, file$3, 99, 4, 3393);
    			option2.__value = "textarea";
    			option2.value = option2.__value;
    			add_location(option2, file$3, 100, 4, 3439);
    			option3.__value = "checkbox";
    			option3.value = option3.__value;
    			add_location(option3, file$3, 101, 4, 3487);
    			option4.__value = "dropdown";
    			option4.value = option4.__value;
    			add_location(option4, file$3, 102, 4, 3535);
    			option5.__value = "slider";
    			option5.value = option5.__value;
    			add_location(option5, file$3, 103, 4, 3583);
    			option6.__value = "number";
    			option6.value = option6.__value;
    			add_location(option6, file$3, 104, 4, 3627);
    			option7.__value = "layer_image";
    			option7.value = option7.__value;
    			add_location(option7, file$3, 105, 4, 3671);
    			attr_dev(select, "class", "add_field_select svelte-1hwnlto");
    			attr_dev(select, "name", "add_field_select");
    			if (/*selectedType*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[15].call(select));
    			add_location(select, file$3, 97, 2, 3263);
    			attr_dev(button, "class", "svelte-1hwnlto");
    			add_location(button, file$3, 107, 2, 3736);
    			add_location(div1, file$3, 95, 0, 3166);
    			attr_dev(div2, "class", "formBuilder svelte-1hwnlto");
    			add_location(div2, file$3, 75, 0, 2368);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, label);
    			append_dev(div1, t4);
    			append_dev(div1, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(select, option7);
    			select_option(select, /*selectedType*/ ctx[2], true);
    			append_dev(div1, t13);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[15]),
    					listen_dev(button, "click", /*click_handler*/ ctx[16], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handleDragStart, event, formElements, handleDragOver, handleDrop, showPropertiesIdx, removeElement*/ 115) {
    				each_value = /*formElements*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}

    			if (dirty & /*selectedType*/ 4) {
    				select_option(select, /*selectedType*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleDragOver(event) {
    	event.preventDefault(); // Necessary to allow dropping
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(18, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormBuilder', slots, []);
    	if (!$metadata.forms) set_store_value(metadata, $metadata.forms = {}, $metadata);
    	let { form_key = 'default' } = $$props; // support for multiple forms (e.g. wizards) in the future
    	if (!$metadata.forms[form_key]) set_store_value(metadata, $metadata.forms[form_key] = { elements: [] }, $metadata);
    	if (!$metadata.forms[form_key].elements) set_store_value(metadata, $metadata.forms[form_key].elements = [], $metadata);
    	let formElements = $metadata.forms[form_key].elements;
    	let dragStartIndex = -1;
    	let showPropertiesIdx = -1;
    	let selectedType;

    	function addElement(type) {
    		if (!type) return;
    		let name = "value_" + Math.random().toString(36).substr(2, 5);

    		let newElement = {
    			name, // Unique ID for key tracking and reactivity
    			type,
    			label: name.charAt(0).toUpperCase() + name.slice(1),
    			name, // Example naming convention
    			options: type === 'dropdown'
    			? [{ text: 'Option 1', key: '1' }]
    			: [],
    			default: ""
    		};

    		if (type === "slider" || type === "number") {
    			newElement.min = 1;
    			newElement.max = 20;
    			newElement.step = 1;
    			newElement.default = 1;
    		}

    		if (type === "checkbox") {
    			newElement.default = false;
    		}

    		if (type === "text" || type === "textarea") {
    			newElement.placeholder = "";
    		}

    		formElements.push(newElement);
    		$$invalidate(0, formElements);
    		$$invalidate(1, showPropertiesIdx = formElements.length - 1);
    	}

    	function handleDragStart(event, index) {
    		dragStartIndex = index;
    	}

    	function handleDrop(event, dropIndex) {
    		event.preventDefault();
    		if (dragStartIndex === dropIndex) return;
    		const draggedItem = formElements[dragStartIndex];
    		const remainingItems = formElements.filter((_, index) => index !== dragStartIndex);

    		const reorderedItems = [
    			...remainingItems.slice(0, dropIndex),
    			draggedItem,
    			...remainingItems.slice(dropIndex)
    		];

    		// Reassign the reordered items back to formElements
    		$$invalidate(0, formElements = reorderedItems);

    		$$invalidate(0, formElements);

    		// Reset dragged index
    		dragStartIndex = -1;
    	}

    	function removeElement(index) {
    		formElements.update(elements => elements.filter((_, i) => i !== index));
    	}

    	const writable_props = ['form_key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormBuilder> was created with unknown prop '${key}'`);
    	});

    	const remove_handler = index => removeElement(index);

    	const openProperties_handler = index => {
    		$$invalidate(1, showPropertiesIdx = index);
    	};

    	const closeProperties_handler = () => {
    		$$invalidate(1, showPropertiesIdx = -1);
    	};

    	const update_handler = (index, e) => {
    		$$invalidate(0, formElements[index] = e.detail, formElements);
    	};

    	const delete_handler = e => {
    		formElements.splice(showPropertiesIdx, 1);
    		$$invalidate(0, formElements);
    		$$invalidate(1, showPropertiesIdx = -1);
    	};

    	const dragstart_handler = index => handleDragStart(event, index);
    	const drop_handler = index => handleDrop(event, index);

    	function select_change_handler() {
    		selectedType = select_value(this);
    		$$invalidate(2, selectedType);
    	}

    	const click_handler = () => addElement(selectedType);

    	$$self.$$set = $$props => {
    		if ('form_key' in $$props) $$invalidate(7, form_key = $$props.form_key);
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		FormElement,
    		metadata,
    		form_key,
    		formElements,
    		dragStartIndex,
    		showPropertiesIdx,
    		selectedType,
    		addElement,
    		handleDragStart,
    		handleDragOver,
    		handleDrop,
    		removeElement,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('form_key' in $$props) $$invalidate(7, form_key = $$props.form_key);
    		if ('formElements' in $$props) $$invalidate(0, formElements = $$props.formElements);
    		if ('dragStartIndex' in $$props) dragStartIndex = $$props.dragStartIndex;
    		if ('showPropertiesIdx' in $$props) $$invalidate(1, showPropertiesIdx = $$props.showPropertiesIdx);
    		if ('selectedType' in $$props) $$invalidate(2, selectedType = $$props.selectedType);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formElements,
    		showPropertiesIdx,
    		selectedType,
    		addElement,
    		handleDragStart,
    		handleDrop,
    		removeElement,
    		form_key,
    		remove_handler,
    		openProperties_handler,
    		closeProperties_handler,
    		update_handler,
    		delete_handler,
    		dragstart_handler,
    		drop_handler,
    		select_change_handler,
    		click_handler
    	];
    }

    class FormBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { form_key: 7 }, add_css$4);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormBuilder",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get form_key() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form_key(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\RuleEditor.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\RuleEditor.svelte";

    function add_css$3(target) {
    	append_styles(target, "svelte-10wch1z", ".rule-row.svelte-10wch1z.svelte-10wch1z{position:relative;padding:10px;border:1px solid #ccc;margin-bottom:5px}.rule-row.svelte-10wch1z:hover .edit-button.svelte-10wch1z{display:block}.edit-button.svelte-10wch1z.svelte-10wch1z{display:none;position:absolute;top:0;right:0;cursor:pointer;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;padding:5px}.close-button.svelte-10wch1z.svelte-10wch1z{position:absolute;top:5px;right:5px;cursor:pointer}.action-row.svelte-10wch1z.svelte-10wch1z{}.oneLine.svelte-10wch1z.svelte-10wch1z{display:inline-block;margin-right:10px;width:120px}.input.svelte-10wch1z.svelte-10wch1z{background-color:black;color:white}.rightValue.svelte-10wch1z.svelte-10wch1z{width:150px}.ruleEditor.svelte-10wch1z button.svelte-10wch1z{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:15px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.ruleEditor.svelte-10wch1z .delete.svelte-10wch1z{background-color:red;color:white}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVsZUVkaXRvci5zdmVsdGUiLCJzb3VyY2VzIjpbIlJ1bGVFZGl0b3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgXHJcbiAgICBcclxuICAgIGxldCBjb25kaXRpb25zID0gWyc9PScsICchPScsICc+JywgJzwnLCAnPj0nLCAnPD0nXTtcclxuICAgIGxldCBlZGl0aW5nSW5kZXggPSBudWxsOyAvLyBJbmRleCBvZiB0aGUgY3VycmVudGx5IGVkaXRpbmcgcnVsZVxyXG4gICAgaW1wb3J0IHsgbWV0YWRhdGF9IGZyb20gJy4vc3RvcmVzL21ldGFkYXRhJ1xyXG4gICAgaWYgKCEkbWV0YWRhdGEucnVsZXMpICRtZXRhZGF0YS5ydWxlcz1bXVxyXG4gICAgbGV0IGZpZWxkcz0kbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50cyAvLyBnZXQgZm9ybSBmaWVsZHNcclxuXHJcbiAgICBsZXQgcnVsZXMgPSAkbWV0YWRhdGEucnVsZXNcclxuICAgIGZ1bmN0aW9uIGFkZFJ1bGUoKSB7XHJcbiAgICAgIHJ1bGVzLnB1c2goeyBmaWVsZE5hbWU6ICcnLCBjb25kaXRpb246ICcnLCBhY3Rpb25UeXBlOiAnJywgcmlnaHRWYWx1ZTonJywgdGFyZ2V0RmllbGQ6ICcnLCBhY3Rpb25WYWx1ZTogJycgfSk7XHJcbiAgICAgIHJ1bGVzPXJ1bGVzXHJcbiAgICAgIGVkaXRpbmdJbmRleD1ydWxlcy5sZW5ndGgtMVxyXG4gICAgICAkbWV0YWRhdGEucnVsZXMgPSBydWxlcztcclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIGRlbGV0ZVJ1bGUoaW5kZXgpIHtcclxuICAgICAgcnVsZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgaWYgKGVkaXRpbmdJbmRleCA9PT0gaW5kZXgpIHtcclxuICAgICAgICBlZGl0aW5nSW5kZXggPSBudWxsOyAvLyBSZXNldCBlZGl0aW5nIGluZGV4IGlmIHRoZSBjdXJyZW50bHkgZWRpdGVkIHJ1bGUgaXMgZGVsZXRlZFxyXG4gICAgICB9XHJcbiAgICAgIHJ1bGVzPXJ1bGVzXHJcbiAgICAgICRtZXRhZGF0YS5ydWxlcyA9IHJ1bGVzO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24gZWRpdFJ1bGUoaW5kZXgpIHtcclxuICAgICAgZWRpdGluZ0luZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcbiAgPC9zY3JpcHQ+XHJcbiAgXHJcbiAgPHN0eWxlPlxyXG4gICAgLnJ1bGUtcm93IHtcclxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG4gICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XHJcbiAgICB9XHJcbiAgICAucnVsZS1yb3c6aG92ZXIgLmVkaXQtYnV0dG9uIHtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICB9XHJcbiAgICAuZWRpdC1idXR0b24ge1xyXG4gICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIHRvcDogMDtcclxuICAgICAgcmlnaHQ6IDA7XHJcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMjcsIDIwNiwgMTE2KTtcclxuICAgICAgICBib3JkZXItY29sb3I6IHJnYigxMjgsIDEyOCwgMTI4KTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICAgICAgcGFkZGluZzogNXB4O1xyXG4gICAgfVxyXG4gICAgLmNsb3NlLWJ1dHRvbiB7XHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgdG9wOiA1cHg7XHJcbiAgICAgIHJpZ2h0OiA1cHg7XHJcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuXHJcbiAgICB9ICAgIFxyXG4gICAgLmFjdGlvbi1yb3cge1xyXG5cclxuICAgIH1cclxuICAgIC5vbmVMaW5lIHtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgICAgIHdpZHRoOjEyMHB4O1xyXG4gICAgfVxyXG4gICAgLmlucHV0IHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB9XHJcbiAgICAucmlnaHRWYWx1ZSB7XHJcbiAgICAgICAgd2lkdGg6IDE1MHB4O1xyXG4gICAgfVxyXG4gICAgLnJ1bGVFZGl0b3IgYnV0dG9uIHtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgbWluLXdpZHRoOiA3MHB4O1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9XHJcbiAgICAucnVsZUVkaXRvciAuZGVsZXRlIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gIDwvc3R5bGU+XHJcbiAgXHJcblxyXG4gIDxoMj5SdWxlczwvaDI+XHJcbiA8ZGl2IGNsYXNzPVwicnVsZUVkaXRvclwiPlxyXG4gIHsjZWFjaCBydWxlcyBhcyBydWxlLCBpbmRleH1cclxuICAgIDxkaXYgY2xhc3M9XCJydWxlLXJvd1wiPlxyXG4gICAgICB7I2lmIGVkaXRpbmdJbmRleCA9PT0gaW5kZXh9XHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xvc2UtYnV0dG9uXCIgb246Y2xpY2s9eygpID0+IHsgZWRpdGluZ0luZGV4PS0xIH19Plg8L2Rpdj5cclxuXHJcbiAgICAgICAgPCEtLSBJbnB1dHMgZm9yIGVkaXRpbmcgLS0+XHJcblxyXG4gICAgICAgICAgPHNlbGVjdCBiaW5kOnZhbHVlPXtydWxlLmZpZWxkTmFtZX0gIGNsYXNzPVwib25lTGluZSBpbnB1dFwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+RmllbGQuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgeyNlYWNoIGZpZWxkcyBhcyBmaWVsZH1cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtmaWVsZC5uYW1lfT57ZmllbGQubmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICA8c2VsZWN0IGJpbmQ6dmFsdWU9e3J1bGUuY29uZGl0aW9ufSBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPkNvbmRpdGlvbi4uLjwvb3B0aW9uPlxyXG4gICAgICAgICAgICB7I2VhY2ggY29uZGl0aW9ucyBhcyBjb25kaXRpb259XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17Y29uZGl0aW9ufT57Y29uZGl0aW9ufTwvb3B0aW9uPlxyXG4gICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiaW5wdXQgcmlnaHRWYWx1ZVwiIHBsYWNlaG9sZGVyPVwiVmFsdWVcIiBiaW5kOnZhbHVlPXtydWxlLnJpZ2h0VmFsdWV9PlxyXG5cclxuICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS5hY3Rpb25UeXBlfSAgY2xhc3M9XCJpbnB1dFwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+QWN0aW9uLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzZXRWYWx1ZVwiPlNldCBWYWx1ZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic2hvd0ZpZWxkXCI+U2hvdy9IaWRlPC9vcHRpb24+XHJcbiAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICB7I2lmIHJ1bGUuYWN0aW9uVHlwZSA9PT0gJ3NldFZhbHVlJ31cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY3Rpb24tcm93XCI+XHJcbiAgICAgICAgICAgICAgPHNlbGVjdCBiaW5kOnZhbHVlPXtydWxlLnRhcmdldEZpZWxkfSBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIj5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5GaWVsZC4uLjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgeyNlYWNoIGZpZWxkcyBhcyBmaWVsZH1cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgPSA8aW5wdXQgdHlwZT1cInRleHRcIiBiaW5kOnZhbHVlPXtydWxlLmFjdGlvblZhbHVlfSBwbGFjZWhvbGRlcj1cIlZhbHVlXCIgIGNsYXNzPVwib25lTGluZSBpbnB1dFwiIHN0eWxlPVwid2lkdGg6MjcwcHhcIj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvaWZ9XHJcbiAgICAgICAgPGRpdj48YnV0dG9uIG9uOmNsaWNrPXsoKSA9PiBkZWxldGVSdWxlKGluZGV4KX0gY2xhc3M9XCJkZWxldGVcIj5EZWxldGU8L2J1dHRvbj48L2Rpdj5cclxuICAgICAgICBcclxuXHJcbiAgICAgIHs6ZWxzZX1cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJlZGl0LWJ1dHRvblwiIG9uOmNsaWNrPXsoKSA9PiBlZGl0UnVsZShpbmRleCl9PkVkaXQ8L2Rpdj5cclxuICAgICAgICA8IS0tIERpc3BsYXkgUnVsZSBTdW1tYXJ5IC0tPlxyXG4gICAgICAgIDxkaXY+IGlmIHtydWxlLmZpZWxkTmFtZX0ge3J1bGUuY29uZGl0aW9ufSB7cnVsZS5yaWdodFZhbHVlfTogeyNpZiBydWxlLmFjdGlvblR5cGU9PT1cInNldFZhbHVlXCJ9c2V0IHtydWxlLnRhcmdldEZpZWxkfT17cnVsZS5hY3Rpb25WYWx1ZX17L2lmfTwvZGl2PlxyXG4gICAgICB7L2lmfVxyXG4gICAgPC9kaXY+XHJcbiAgey9lYWNofVxyXG4gIDxidXR0b24gb246Y2xpY2s9e2FkZFJ1bGV9PkFkZCBSdWxlPC9idXR0b24+XHJcbjwvZGl2PiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFnQ0ksdUNBQVUsQ0FDUixRQUFRLENBQUUsUUFBUSxDQUNsQixPQUFPLENBQUUsSUFBSSxDQUNiLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDdEIsYUFBYSxDQUFFLEdBQ2pCLENBQ0Esd0JBQVMsTUFBTSxDQUFDLDJCQUFhLENBQzNCLE9BQU8sQ0FBRSxLQUNYLENBQ0EsMENBQWEsQ0FDWCxPQUFPLENBQUUsSUFBSSxDQUNiLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxDQUFDLENBQ04sS0FBSyxDQUFFLENBQUMsQ0FDUixNQUFNLENBQUUsT0FBTyxDQUNmLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ2pJLEtBQUssQ0FBRSxLQUFLLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDcEMsWUFBWSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ2hDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE9BQU8sQ0FBRSxHQUNiLENBQ0EsMkNBQWMsQ0FDWixRQUFRLENBQUUsUUFBUSxDQUNsQixHQUFHLENBQUUsR0FBRyxDQUNSLEtBQUssQ0FBRSxHQUFHLENBQ1YsTUFBTSxDQUFFLE9BRVYsQ0FDQSx5Q0FBWSxDQUVaLENBQ0Esc0NBQVMsQ0FDTCxPQUFPLENBQUUsWUFBWSxDQUNyQixZQUFZLENBQUUsSUFBSSxDQUNsQixNQUFNLEtBQ1YsQ0FDQSxvQ0FBTyxDQUNILGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsS0FBSyxDQUFFLEtBQ1gsQ0FDQSx5Q0FBWSxDQUNSLEtBQUssQ0FBRSxLQUNYLENBQ0EsMEJBQVcsQ0FBQyxxQkFBTyxDQUNmLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLFNBQVMsQ0FBRSxJQUFJLENBQ2YsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsS0FBSyxDQUNaLGdCQUFnQixDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLFlBQVksQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxhQUFhLENBQUUsR0FBRyxDQUNsQixNQUFNLENBQUUsT0FBTyxDQUNmLFlBQVksQ0FBRSxJQUNsQixDQUNBLDBCQUFXLENBQUMsc0JBQVEsQ0FDaEIsZ0JBQWdCLENBQUUsR0FBRyxDQUNyQixLQUFLLENBQUUsS0FDWCJ9 */");
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[18] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (138:6) {:else}
    function create_else_block$1(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let t3_value = /*rule*/ ctx[17].fieldName + "";
    	let t3;
    	let t4;
    	let t5_value = /*rule*/ ctx[17].condition + "";
    	let t5;
    	let t6;
    	let t7_value = /*rule*/ ctx[17].rightValue + "";
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[15](/*index*/ ctx[19]);
    	}

    	let if_block = /*rule*/ ctx[17].actionType === "setValue" && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Edit";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("if ");
    			t3 = text(t3_value);
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = text(": ");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "edit-button svelte-10wch1z");
    			add_location(div0, file$2, 139, 8, 4439);
    			add_location(div1, file$2, 141, 8, 4556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", click_handler_2, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*rules*/ 2 && t3_value !== (t3_value = /*rule*/ ctx[17].fieldName + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*rules*/ 2 && t5_value !== (t5_value = /*rule*/ ctx[17].condition + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*rules*/ 2 && t7_value !== (t7_value = /*rule*/ ctx[17].rightValue + "")) set_data_dev(t7, t7_value);

    			if (/*rule*/ ctx[17].actionType === "setValue") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(138:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:6) {#if editingIndex === index}
    function create_if_block$2(ctx) {
    	let div0;
    	let t1;
    	let select0;
    	let option0;
    	let t3;
    	let select1;
    	let option1;
    	let t5;
    	let input;
    	let t6;
    	let select2;
    	let option2;
    	let option3;
    	let option4;
    	let t10;
    	let t11;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*fields*/ ctx[3];
    	validate_each_argument(each_value_3);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_1[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	function select0_change_handler() {
    		/*select0_change_handler*/ ctx[8].call(select0, /*each_value*/ ctx[18], /*index*/ ctx[19]);
    	}

    	let each_value_2 = /*conditions*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	function select1_change_handler() {
    		/*select1_change_handler*/ ctx[9].call(select1, /*each_value*/ ctx[18], /*index*/ ctx[19]);
    	}

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[10].call(input, /*each_value*/ ctx[18], /*index*/ ctx[19]);
    	}

    	function select2_change_handler() {
    		/*select2_change_handler*/ ctx[11].call(select2, /*each_value*/ ctx[18], /*index*/ ctx[19]);
    	}

    	let if_block = /*rule*/ ctx[17].actionType === 'setValue' && create_if_block_1$2(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[14](/*index*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "X";
    			t1 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Field...";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Condition...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			input = element("input");
    			t6 = space();
    			select2 = element("select");
    			option2 = element("option");
    			option2.textContent = "Action...";
    			option3 = element("option");
    			option3.textContent = "Set Value";
    			option4 = element("option");
    			option4.textContent = "Show/Hide";
    			t10 = space();
    			if (if_block) if_block.c();
    			t11 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(div0, "class", "close-button svelte-10wch1z");
    			add_location(div0, file$2, 100, 8, 2710);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 105, 12, 2906);
    			attr_dev(select0, "class", "oneLine input svelte-10wch1z");
    			if (/*rule*/ ctx[17].fieldName === void 0) add_render_callback(select0_change_handler);
    			add_location(select0, file$2, 104, 10, 2833);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 111, 12, 3167);
    			attr_dev(select1, "class", "oneLine input svelte-10wch1z");
    			if (/*rule*/ ctx[17].condition === void 0) add_render_callback(select1_change_handler);
    			add_location(select1, file$2, 110, 10, 3095);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "input rightValue svelte-10wch1z");
    			attr_dev(input, "placeholder", "Value");
    			add_location(input, file$2, 116, 10, 3366);
    			option2.__value = "";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 119, 12, 3539);
    			option3.__value = "setValue";
    			option3.value = option3.__value;
    			add_location(option3, file$2, 120, 12, 3588);
    			option4.__value = "showField";
    			option4.value = option4.__value;
    			add_location(option4, file$2, 121, 12, 3645);
    			attr_dev(select2, "class", "input svelte-10wch1z");
    			if (/*rule*/ ctx[17].actionType === void 0) add_render_callback(select2_change_handler);
    			add_location(select2, file$2, 118, 10, 3473);
    			attr_dev(button, "class", "delete svelte-10wch1z");
    			add_location(button, file$2, 134, 13, 4257);
    			add_location(div1, file$2, 134, 8, 4252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select0, anchor);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(select0, null);
    				}
    			}

    			select_option(select0, /*rule*/ ctx[17].fieldName, true);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, select1, anchor);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select1, null);
    				}
    			}

    			select_option(select1, /*rule*/ ctx[17].condition, true);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*rule*/ ctx[17].rightValue);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, select2, anchor);
    			append_dev(select2, option2);
    			append_dev(select2, option3);
    			append_dev(select2, option4);
    			select_option(select2, /*rule*/ ctx[17].actionType, true);
    			insert_dev(target, t10, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[7], false, false, false, false),
    					listen_dev(select0, "change", select0_change_handler),
    					listen_dev(select1, "change", select1_change_handler),
    					listen_dev(input, "input", input_input_handler),
    					listen_dev(select2, "change", select2_change_handler),
    					listen_dev(button, "click", click_handler_1, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*fields*/ 8) {
    				each_value_3 = /*fields*/ ctx[3];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_3$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_3.length;
    			}

    			if (dirty & /*rules, fields*/ 10) {
    				select_option(select0, /*rule*/ ctx[17].fieldName);
    			}

    			if (dirty & /*conditions*/ 4) {
    				each_value_2 = /*conditions*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty & /*rules, fields*/ 10) {
    				select_option(select1, /*rule*/ ctx[17].condition);
    			}

    			if (dirty & /*rules, fields*/ 10 && input.value !== /*rule*/ ctx[17].rightValue) {
    				set_input_value(input, /*rule*/ ctx[17].rightValue);
    			}

    			if (dirty & /*rules, fields*/ 10) {
    				select_option(select2, /*rule*/ ctx[17].actionType);
    			}

    			if (/*rule*/ ctx[17].actionType === 'setValue') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(t11.parentNode, t11);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(select1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(select2);
    			if (detaching) detach_dev(t10);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(99:6) {#if editingIndex === index}",
    		ctx
    	});

    	return block;
    }

    // (142:70) {#if rule.actionType==="setValue"}
    function create_if_block_2$2(ctx) {
    	let t0;
    	let t1_value = /*rule*/ ctx[17].targetField + "";
    	let t1;
    	let t2;
    	let t3_value = /*rule*/ ctx[17].actionValue + "";
    	let t3;

    	const block = {
    		c: function create() {
    			t0 = text("set ");
    			t1 = text(t1_value);
    			t2 = text("=");
    			t3 = text(t3_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rules*/ 2 && t1_value !== (t1_value = /*rule*/ ctx[17].targetField + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*rules*/ 2 && t3_value !== (t3_value = /*rule*/ ctx[17].actionValue + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(142:70) {#if rule.actionType===\\\"setValue\\\"}",
    		ctx
    	});

    	return block;
    }

    // (107:12) {#each fields as field}
    function create_each_block_3$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[20].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[20].name;
    			option.value = option.__value;
    			add_location(option, file$2, 107, 14, 2993);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(107:12) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (113:12) {#each conditions as condition}
    function create_each_block_2$1(ctx) {
    	let option;
    	let t_value = /*condition*/ ctx[23] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*condition*/ ctx[23];
    			option.value = option.__value;
    			add_location(option, file$2, 113, 14, 3266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(113:12) {#each conditions as condition}",
    		ctx
    	});

    	return block;
    }

    // (124:8) {#if rule.actionType === 'setValue'}
    function create_if_block_1$2(ctx) {
    	let div;
    	let select;
    	let option;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*fields*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[12].call(select, /*each_value*/ ctx[18], /*index*/ ctx[19]);
    	}

    	function input_input_handler_1() {
    		/*input_input_handler_1*/ ctx[13].call(input, /*each_value*/ ctx[18], /*index*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "Field...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = text("\r\n              = ");
    			input = element("input");
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$2, 126, 16, 3886);
    			attr_dev(select, "class", "oneLine input svelte-10wch1z");
    			if (/*rule*/ ctx[17].targetField === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$2, 125, 14, 3808);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Value");
    			attr_dev(input, "class", "oneLine input svelte-10wch1z");
    			set_style(input, "width", "270px");
    			add_location(input, file$2, 131, 16, 4097);
    			attr_dev(div, "class", "action-row svelte-10wch1z");
    			add_location(div, file$2, 124, 10, 3768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*rule*/ ctx[17].targetField, true);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*rule*/ ctx[17].actionValue);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", select_change_handler),
    					listen_dev(input, "input", input_input_handler_1)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*fields*/ 8) {
    				each_value_1 = /*fields*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*rules, fields*/ 10) {
    				select_option(select, /*rule*/ ctx[17].targetField);
    			}

    			if (dirty & /*rules, fields*/ 10 && input.value !== /*rule*/ ctx[17].actionValue) {
    				set_input_value(input, /*rule*/ ctx[17].actionValue);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(124:8) {#if rule.actionType === 'setValue'}",
    		ctx
    	});

    	return block;
    }

    // (128:16) {#each fields as field}
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[20].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[20].name;
    			option.value = option.__value;
    			add_location(option, file$2, 128, 18, 3981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(128:16) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (97:2) {#each rules as rule, index}
    function create_each_block$1(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*editingIndex*/ ctx[0] === /*index*/ ctx[19]) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "rule-row svelte-10wch1z");
    			add_location(div, file$2, 97, 4, 2576);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(97:2) {#each rules as rule, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let h2;
    	let t1;
    	let div;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*rules*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Rules";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			button = element("button");
    			button.textContent = "Add Rule";
    			add_location(h2, file$2, 94, 2, 2497);
    			attr_dev(button, "class", "svelte-10wch1z");
    			add_location(button, file$2, 145, 2, 4744);
    			attr_dev(div, "class", "ruleEditor svelte-10wch1z");
    			add_location(div, file$2, 95, 1, 2514);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(div, t2);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addRule*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*deleteRule, rules, fields, conditions, editingIndex, editRule*/ 111) {
    				each_value = /*rules*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(16, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RuleEditor', slots, []);
    	let conditions = ['==', '!=', '>', '<', '>=', '<='];
    	let editingIndex = null; // Index of the currently editing rule
    	if (!$metadata.rules) set_store_value(metadata, $metadata.rules = [], $metadata);
    	let fields = $metadata.forms.default.elements; // get form fields
    	let rules = $metadata.rules;

    	function addRule() {
    		rules.push({
    			fieldName: '',
    			condition: '',
    			actionType: '',
    			rightValue: '',
    			targetField: '',
    			actionValue: ''
    		});

    		$$invalidate(1, rules);
    		$$invalidate(0, editingIndex = rules.length - 1);
    		set_store_value(metadata, $metadata.rules = rules, $metadata);
    	}

    	function deleteRule(index) {
    		rules.splice(index, 1);

    		if (editingIndex === index) {
    			$$invalidate(0, editingIndex = null); // Reset editing index if the currently edited rule is deleted
    		}

    		$$invalidate(1, rules);
    		set_store_value(metadata, $metadata.rules = rules, $metadata);
    	}

    	function editRule(index) {
    		$$invalidate(0, editingIndex = index);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RuleEditor> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, editingIndex = -1);
    	};

    	function select0_change_handler(each_value, index) {
    		each_value[index].fieldName = select_value(this);
    		$$invalidate(1, rules);
    		$$invalidate(3, fields);
    	}

    	function select1_change_handler(each_value, index) {
    		each_value[index].condition = select_value(this);
    		$$invalidate(1, rules);
    		$$invalidate(3, fields);
    	}

    	function input_input_handler(each_value, index) {
    		each_value[index].rightValue = this.value;
    		$$invalidate(1, rules);
    		$$invalidate(3, fields);
    	}

    	function select2_change_handler(each_value, index) {
    		each_value[index].actionType = select_value(this);
    		$$invalidate(1, rules);
    		$$invalidate(3, fields);
    	}

    	function select_change_handler(each_value, index) {
    		each_value[index].targetField = select_value(this);
    		$$invalidate(1, rules);
    		$$invalidate(3, fields);
    	}

    	function input_input_handler_1(each_value, index) {
    		each_value[index].actionValue = this.value;
    		$$invalidate(1, rules);
    		$$invalidate(3, fields);
    	}

    	const click_handler_1 = index => deleteRule(index);
    	const click_handler_2 = index => editRule(index);

    	$$self.$capture_state = () => ({
    		conditions,
    		editingIndex,
    		metadata,
    		fields,
    		rules,
    		addRule,
    		deleteRule,
    		editRule,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('conditions' in $$props) $$invalidate(2, conditions = $$props.conditions);
    		if ('editingIndex' in $$props) $$invalidate(0, editingIndex = $$props.editingIndex);
    		if ('fields' in $$props) $$invalidate(3, fields = $$props.fields);
    		if ('rules' in $$props) $$invalidate(1, rules = $$props.rules);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		editingIndex,
    		rules,
    		conditions,
    		fields,
    		addRule,
    		deleteRule,
    		editRule,
    		click_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input_input_handler,
    		select2_change_handler,
    		select_change_handler,
    		input_input_handler_1,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class RuleEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {}, add_css$3);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RuleEditor",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Icon.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\Icon.svelte";

    function add_css$2(target) {
    	append_styles(target, "svelte-h496x3", ".default.svelte-h496x3.svelte-h496x3{fill:white;display:inline-block;cursor:pointer;width:30px;text-align:center}.default.svelte-h496x3.svelte-h496x3:hover,.active.svelte-h496x3.svelte-h496x3{fill:black;background-color:#ddb74f;border-radius:5px}.deactivate.svelte-h496x3.svelte-h496x3{fill:grey;cursor:default}.deactivate.svelte-h496x3.svelte-h496x3:hover{fill:grey;background:transparent}.default.svelte-h496x3 svg.svelte-h496x3{display:inline-block}.leftMenuIcon.svelte-h496x3.svelte-h496x3{padding-top:8px;height:30px}.leftMenuIcon2.svelte-h496x3.svelte-h496x3{padding-top:4px;height:30px}.leftMenuTopMargin.svelte-h496x3.svelte-h496x3{margin-top:20px}.outer.svelte-h496x3.svelte-h496x3{display:inline-block;cursor:pointer}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5zdmVsdGUiLCJzb3VyY2VzIjpbIkljb24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBcdGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYW1lPVwiXCJcclxuICAgICAgICBleHBvcnQgbGV0IHN0YXRlPVwiXCJcclxuICAgICAgICBleHBvcnQgbGV0IGRlYWN0aXZhdGU9XCJcIlxyXG4gICAgICAgIGxldCBhY3RpdmVDbGFzcz1cIlwiXHJcbiAgICAgICAgaWYgKHN0YXRlPT09bmFtZSkgYWN0aXZlQ2xhc3M9XCIgYWN0aXZlXCJcclxuICAgICAgICBpZiAoZGVhY3RpdmF0ZT09PVwiZGVhY3RpdmF0ZVwiKSBhY3RpdmVDbGFzcz1cIiBkZWFjdGl2YXRlXCJcclxuXHJcbiAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcclxuICAgICAgICBsZXQgaWNvbnNJbmZvPXtcclxuICAgICAgICAgICAgXCJkb3duXCI6e2NsYXNzOlwiZGVmYXVsdFwifSwgXHJcbiAgICAgICAgICAgIFwidXBcIjp7Y2xhc3M6XCJkZWZhdWx0XCJ9LFxyXG4gICAgICAgICAgICBcImxpc3RcIjp7Y2xhc3M6XCJkZWZhdWx0IGxlZnRNZW51SWNvblwifSxcclxuICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb24yIGxlZnRNZW51VG9wTWFyZ2luXCJ9LFxyXG4gICAgICAgICAgICBcImVkaXRGb3JtXCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb24yIGxlZnRNZW51VG9wTWFyZ2luXCJ9LFxyXG4gICAgICAgICAgICBcImVkaXRSdWxlc1wiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uMiBsZWZ0TWVudVRvcE1hcmdpblwifVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluZm89aWNvbnNJbmZvW25hbWVdXHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZT1cIm91dGVyXCJcclxuICAgICAgICBpZiAoaW5mbykgY2xhc3NOYW1lPWluZm8uY2xhc3NcclxuICAgICAgICBjbGFzc05hbWUrPWFjdGl2ZUNsYXNzXHJcbjwvc2NyaXB0PlxyXG48IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG48ZGl2IGNsYXNzPXtjbGFzc05hbWV9ICBvbjptb3VzZWRvd249eyhlKSA9PiB7IGRpc3BhdGNoKFwibW91c2Vkb3duXCIsZSkgfX0gIG9uOmNsaWNrPXsoZSkgPT4geyBkaXNwYXRjaChcImNsaWNrXCIsZSkgfX0gICAgPlxyXG4gICAgeyNpZiBuYW1lPT09XCJtb3ZlXCJ9XHJcbiAgICAgICAgPHN2ZyAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjRkZGXCJcclxuICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCJcclxuICAgICAgICBpZD1cImRyYWdNb2RlbE1hbmFnZXJUb3BCYXJJY29uXCIgY3Vyc29yPVwibW92ZVwiPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNOSA1bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTkgMTJtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwXCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNOSAxOW0tMSAwYTEgMSAwIDEgMCAyIDBhMSAxIDAgMSAwIC0yIDBcIj48L3BhdGg+XHJcbiAgICAgICAgPHBhdGggZD1cIk0xNSA1bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTE1IDEybS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTE1IDE5bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImRvd25cIn1cclxuICAgICAgICA8c3ZnICB2aWV3Qm94PVwiMCAwIDMyMCA1MTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiPjxwYXRoIGQ9XCJNMzEwLjYgMjQ2LjZsLTEyNy4xIDEyOEMxNzYuNCAzODAuOSAxNjguMiAzODQgMTYwIDM4NHMtMTYuMzgtMy4xMjUtMjIuNjMtOS4zNzVsLTEyNy4xLTEyOEMuMjI0NCAyMzcuNS0yLjUxNiAyMjMuNyAyLjQzOCAyMTEuOFMxOS4wNyAxOTIgMzIgMTkyaDI1NS4xYzEyLjk0IDAgMjQuNjIgNy43ODEgMjkuNTggMTkuNzVTMzE5LjggMjM3LjUgMzEwLjYgMjQ2LjZ6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwidXBcIn1cclxuICAgICAgICA8c3ZnICB2aWV3Qm94PVwiMCAwIDMyMCA1MTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiPjxwYXRoIGQ9XCJNOS4zOSAyNjUuNGwxMjcuMS0xMjhDMTQzLjYgMTMxLjEgMTUxLjggMTI4IDE2MCAxMjhzMTYuMzggMy4xMjUgMjIuNjMgOS4zNzVsMTI3LjEgMTI4YzkuMTU2IDkuMTU2IDExLjkgMjIuOTEgNi45NDMgMzQuODhTMzAwLjkgMzIwIDI4Ny4xIDMyMEgzMi4wMWMtMTIuOTQgMC0yNC42Mi03Ljc4MS0yOS41OC0xOS43NVMuMjMzMyAyNzQuNSA5LjM5IDI2NS40elwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cInNhdmVcIn1cclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIzXCIgaGVpZ2h0PVwiMjNcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ3aGl0ZVwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cInRhYmxlci1pY29uIHRhYmxlci1pY29uLWRldmljZS1mbG9wcHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiPjxwYXRoIGQ9XCJNNiA0aDEwbDQgNHYxMGEyIDIgMCAwIDEgLTIgMmgtMTJhMiAyIDAgMCAxIC0yIC0ydi0xMmEyIDIgMCAwIDEgMiAtMlwiPjwvcGF0aD48cGF0aCBkPVwiTTEyIDE0bS0yIDBhMiAyIDAgMSAwIDQgMGEyIDIgMCAxIDAgLTQgMFwiPjwvcGF0aD48cGF0aCBkPVwiTTE0IDRsMCA0bC02IDBsMCAtNFwiPjwvcGF0aD48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cIkd5cmVcIn1cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1taXNzaW5nLWF0dHJpYnV0ZSAtLT5cclxuICAgICAgICA8aW1nIHNyYz1cImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjRBQUFBZENBTUFBQUNLZWl3K0FBQUMvVkJNVkVVQUFBQWZRMUZKTkVRNFRWRWZQRmNzZDVNZ1NHRWVTbHB6ZjVjK3NNZ1hpYThYVDIwdmdwY21PRkVkTlUwWVlvV2pRMnBNVDJvZ2FuSmVMVXhaTjBCT1NsQWNrL2gxaHFjazVQWlFYbjBiTEVRb3RkY1VHeTFIKy84VWZLaEFnZDNxaUxjODF1Z3Z5TjRqZDhycFdvc25NMDFFb0xGSndjM1djYU5ZWDJJbXQ4aDZlNFpEZXJlM3ZjMnNzYjhmZ3A2WkhWaHVjNEFsaTZKUmRwMm9XRUNKa0prSlJtdENTVkFvUUZsNGUzOG1kbjFsWjJJa1BscWtWUDhIa3Y4R0JSQUFoLzg4WVdvTkR4MUsvdjg3K2Y4QnhmOEpmZi9oa1BvTlIrLy9jNU1zVUZvZk5rY1RHQ2dCQUFWbi8vOVgvLzh4L1A4Yjd2OWEzLzhhenY4RHAvL1RnUCthVFArNVJmK3dRUDhOenY0ZjJ2Mi9hUDNrbVB3NzR2dkplZnMxMnZtNDJma0JidTd5ak9pdXRkWUZROVRvbjlNQ004N3NXTXZ1YU1yamJzWUNKTE5VTXBFS0czLzdWM0FmUUc4dFVXeDBBR1VuUzJNMFJsVW5RVlJ2QUZNbk5GQWNMRWovbmo0V0tEb1RIRGdXSWpVVUlTeit3dzE3Ly84MjhQOHo3UDhNNS8vUTV2OXEzUC8xMVA4QXZQOEFzZi9sb3YvL25mOUFtdi8vYlArNlR2Ly9SditpUmY4TlZ2NUg2djFZei8zU2lQMkk0ZnhtdGZ6WXQvdnF5dmdhbS9jQWd2ZWVkdmU0WVBhUjB2VnAwUFJaeFBSQnhmS3lTdkdoelBCQXIvRC9jK3dIdU9zRFUrcmtsT25YYXVuS1dlbkNoZVRSUnVPVG4rSThpT0NVemQzbFVkei9sTnYvdHRyYWN0cTFxTmtabHRjQlpkUVhoTkkvdWRHTXh0QnBxcy9TZXMzdWhNY0NZTWYvNHNMTFk4RWtZc0VHUGIwU2U3cGxTYmptVmJlMmM3YmlsclVmaTdQMWFiRC9TNi9yU3ExdFhLd29RNnoxc0tTZFRLVDBzNkZ2ZjZCTGRaN1daNTVwWjU0dWhKc0dIcGY0VXBYYW9wTXNncExMQUpMNlk0K2lBSTdqUll2a0FJbkZKb2MwZW9iOGFJTWNPWUo0SW9KRFZvRDB3WDlXSkg0UkxIanpQbmZKUG5Ub1hYQk5BSENiRTJ3VEoybGhqbU54b0dJZ09XR3RJMkJoaWwyYUVWU2ZKRktSQzFIL3RVeVpBRXYvZzBwbmQwaG5BRVBNbnpyL3RpZi9weWIvaVNDWWlCVC9wQURtbmdEU213REZrUUQvalFETk4zTjdBQUFBUFhSU1RsTUFHUkFLazN3M0tkcS9sWldOZTNGblgwaERReHNWL2YzNit2cjI5dkx0NStIZzJkSFB5OG5FdzcycG1waVRqSXlLZlhoeWNXMWpZRnBYTlNRZDBsUzJ2UUFBQWNoSlJFRlVLTTlpb0NJd1V1UFJzc0lwcSs4WDJ5Q2h4SWhMbXRNdktwQ1ZnUm03SkJ1N3V2T3NKalljV2htTmVUaGRaamF6WXBjVlpkU1JYemsvUHFGUmlJRUppelEvbDNKSC82VHBTeGNzRThRaXl5NjlkNDVMUUcxQzB1TDJ0U2Jva3N5TVFuS2JYYUxtbmJ6N0lQdlkrcDBxQXVqbWN4OXlkazErOXVYdHUvY2xUL2RONmRSQTg1MVpyR3ZRMlkrNVZ6MXZQM2xka2oyNVcwRVUxV1gxclJPdlA4cVk2NTZVNGZtNDRGemI2alhDeU5Lc2RhNWJjdmVIQVJZOUljNTJpZWZOZ2xWQm1TSklzaUpiZ3lOZi9saHVHNU42SXNaMjNjVnJCNXhYQ0NCa3JiWFBUQTI4L0N2ZE52Umd6YWxRMjhOWGR2blBOa0M0M3BTamFMZWR3ODl2NGJidWwxTGRiVE52Yk91TFI3SmI5M1JwZnByZHhqOGZ3bnVpNDJhRUhUMlN2RkFXeVdvOThjcWlPeDUyTy83V2JPK0tpRWovZEg5RGdDS1N0Q1ZIV1pWampvZGQ0dWZmMzh2TC8zM2RGT25QaFJ5b2h2ZWNpb0h5Ymc2SnQ5NjhPRCt0SlZnTUpjMHdTVmJhZXprK3orcDFjM0N3Q3dseFc0U1dLc3hMblh5TEhmTWZYc2hLUzBuWmN4d2pVbmtyN0gyckM3MjhDdlB5WG5scllzYTRSWm1QdmE5VGhiZDN0WThxdHVURXhDSlY1V1J2N3lQRGl5TTFzdk94Y0xQdzJSQ2ZiUUJ1TzUzMGJPOGNHd0FBQUFCSlJVNUVya0pnZ2c9PVwiPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwibGlzdFwifVxyXG4gICAgICAgIDxzdmcgIHZpZXdCb3g9XCIwIDAgMTQgMTRcIiAgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtMSA5LjYyNjI3MTVoMTJ2Mi42ODM3MTk1aC0xMnptMC0zLjkwOTg0NGgxMnYyLjY4Mjg4aC0xMnptMC00LjAyNjQxOGgxMnYyLjY4NDU1OGgtMTJ6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwicHJvcGVydGllc1wifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTMuNjU4MDcwMyAxMC44MTYxNDJxMC0uMTg5Nzc5LS4xMzg4MjgzLS4zMjg2MDctLjEzODgyODMtLjEzODgyOC0uMzI4NjA3LS4xMzg4MjgtLjE4OTc3ODggMC0uMzI4NjA3MS4xMzg4MjgtLjEzODgyODMuMTM4ODI4LS4xMzg4MjgzLjMyODYwNyAwIC4xODk3NzkuMTM4ODI4My4zMjg2MDcuMTM4ODI4My4xMzg4MjguMzI4NjA3MS4xMzg4MjguMTg5Nzc4NyAwIC4zMjg2MDctLjEzODgyOC4xMzg4MjgzLS4xMzg4MjguMTM4ODI4My0uMzI4NjA3em00LjcwMzgwMTgtMy4wNjczMTA2LTQuOTgwOTkxIDQuOTgwOTkwNnEtLjI3MDE3NzYuMjcwMTc4LS42NTcyMTQuMjcwMTc4LS4zNzk1NTc1IDAtLjY2NDY5MzEtLjI3MDE3OGwtLjc3NDA3MjktLjc4ODU2M3EtLjI3NzY1NjYtLjI2MjY5OS0uMjc3NjU2Ni0uNjU3MjE0IDAtLjM4NzAzNy4yNzc2NTY2LS42NjQ2OTNsNC45NzM5Nzk0LTQuOTczOTc5NnEuMjg0NjY4MS43MTU2NDM1LjgzNjI0MTggMS4yNjcyMTcyLjU1MTU3MzcuNTUxNTczNyAxLjI2NzIxNzIuODM2MjQxOHptNC42MzA0MTM5LTMuMTc3MTU4cTAgLjI4NDY2ODEtLjE2NzgwOC43NzQwNzI5LS4zNDMwOTkuOTc4ODA5Ni0xLjIwMTMxIDEuNTg4MzQ1My0uODU4MjExLjYwOTUzNTctMS44ODc5NzA5LjYxMDAwMzEtMS4zNTEzNTU1IDAtMi4zMTE0Njc3LS45NjA1Nzk2LS45NjAxMTIyLS45NjA1Nzk2LS45NjA1Nzk2LTIuMzExNDY3Ny0uMDAwNDY3NS0xLjM1MDg4ODIuOTYwNTc5Ni0yLjMxMTQ2NzguOTYxMDQ3LS45NjA1Nzk2IDIuMzExNDY3Ny0uOTYwNTc5Ni40MjM0OTU5IDAgLjg4NzE5MTkuMTIwNTk4My40NjM2OTYuMTIwNTk4My43ODUyOTIuMzM5ODI1NS4xMTY4NTkuMDgwMzk5LjExNjg1OS4yMDQ3MzY3IDAgLjEyNDMzNzgtLjExNjg1OS4yMDQ3MzY3bC0yLjEzOTkxOTIgMS4yMzQ0OTY3djEuNjM2MDIzN2wxLjQwOTc4NTIuNzgxNTUxOXEuMDM2NDYtLjAyMTk2OS41NzY4MTQtLjM1NDMxNi41NDAzNTYtLjMzMjM0NjYuOTg5NTYyLS41OTE3NzMyLjQ0OTIwNC0uMjU5NDI2Ni41MTUxMTQtLjI1OTQyNjYuMTA5Mzc5IDAgLjE3MTU0OC4wNzI5Mi4wNjIxNy4wNzI5Mi4wNjIxNy4xODI3NjczelwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImVkaXRGb3JtXCJ9XHJcbiAgICAgICAgPHN2ZyAgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMTQgMTRcIj48cGF0aCBkPVwibSAxLjE5OTc5OTUsMTIuOTkzOTE2IGMgLTAuMDc5MDM0LC0wLjAyMyAtMC4xNjQwNzEsLTAuMTA5MyAtMC4xODc5ODEzLC0wLjE5MTQgLTAuMDEyMDA1LC0wLjA0MiAtMC4wMTMwMDYsLTAuNjg5NSAtMC4wMTEwMDUsLTUuODIxMDAwMyBsIDAsLTUuNzc0IDAuMDIyMDEsLTAuMDQ1IGMgMC4wMjgwMTIsLTAuMDU3IDAuMDgzMDM2LC0wLjExMTcgMC4xNDAxNjA2LC0wLjE0MDEgbCAwLjA0NTAxOSwtMC4wMjIgNS43OTIyMDQxLDAgNS43OTIzMDQxLDAgMC4wNTEwMiwwLjAyNSBjIDAuMDU2MDIsMC4wMjcgMC4xMDM2NDUsMC4wNzUgMC4xMzU0NTksMC4xMzQ1IGwgMC4wMjEwMSwwLjAzOSAwLDUuNzgzMiBjIDAsNS4zNzY1MDAzIDAsNS43ODY2MDAzIC0wLjAxMzAxLDUuODMxMTAwMyAtMC4wMTkwMSwwLjA2IC0wLjA3OTAzLDAuMTI5MSAtMC4xNDE3NjEsMC4xNjIxIGwgLTAuMDQ2MDIsMC4wMjQgLTUuNzg3NzAyMywwIGMgLTMuNDU2Mjk0Miw5ZS00IC01Ljc5OTIwNywwIC01LjgxNjAxNDMsLTAuMDEgeiBtIDExLjIzNjY1NzUsLTUuOTkxOTAwMyAwLC01LjQzNDIgLTUuNDMxOTQ4MSwwIC01LjQzMTg0ODIsMCAwLDUuNDIyOSBjIDAsMi45ODI2IC00LjAwMmUtNCw1LjQyODAwMDMgMCw1LjQzNDIwMDMgMCwwLjAxIDEuMDk5MDc1MSwwLjAxMSA1LjQzNjU1MDIsMC4wMTEgbCA1LjQzMjE0ODEsMCAwLC01LjQzNDIwMDMgeiBtIC02Ljg2MTk2NjMsMy43MTgxMDAzIDAsLTAuODYwMzAwMyAwLjg1NTc2OTksMCAwLjg1NTc3LDAgMCwwLjg2MDMwMDMgMCwwLjg2MDMgLTAuODU1NzcsMCAtMC44NTU3Njk5LDAgMCwtMC44NjAzIHogbSAxLjE0Mzk5NDUsMCAwLC0wLjI4MzggLTAuMjg4MjI0NiwwIC0wLjI4ODMyNDYsMCAwLDAuMjgzOCAwLDAuMjgzNyAwLjI4ODMyNDYsMCAwLjI4ODIyNDYsMCAwLC0wLjI4MzcgeiBtIDEuMTQ0MDk0NywwIDAsLTAuMjgzOCAxLjcxNjA0MTgsMCAxLjcxNjA0MTMsMCAwLDAuMjgzOCAwLDAuMjgzNyAtMS43MTYwNDEzLDAgLTEuNzE2MDQxOCwwIDAsLTAuMjgzNyB6IG0gLTIuMjg4MDg5MiwtMy4xNDgzMDAzIDAsLTEuMTQ0MSAyLjg2MDAzNjQsMCAyLjg2MDEzNTksMCAwLDEuMTQ0MSAwLDEuMTQzOSAtMi44NjAxMzU5LDAgLTIuODYwMDM2NCwwIDAsLTEuMTQzOSB6IG0gNS4xNDM2MjMzLDAgMCwtMC41NzIxIC0yLjI4ODA4ODgsMCAtMi4yODgwODkyLDAgMCwwLjU2NjEgYyAwLDAuMzExMyAwLDAuNTY4NyAwLjAxMDAwNCwwLjU3MiAwLDAgMS4wMzI5NDY2LDAuMDEgMi4yODgwODkyLDAuMDEgbCAyLjI4MjA4NjgsMCAwLC0wLjU3MiB6IG0gLTcuOTk5MjU3OCwwIDAsLTAuMjg4NCAxLjEzOTU5MjcsMCAxLjEzOTQ5MjUsMCAwLDAuMjg4NCAwLDAuMjg4MiAtMS4xMzk0OTI1LDAgLTEuMTM5NTkyNywwIDAsLTAuMjg4MiB6IG0gMi44NTU2MzQ1LC0zLjQzMjEgMCwtMS4xNDQxIDIuODYwMDM2NCwwIDIuODYwMTM1OSwwIDAsMS4xNDQxIDAsMS4xNDQgLTIuODYwMTM1OSwwIC0yLjg2MDAzNjQsMCAwLC0xLjE0NCB6IG0gNS4xNDM2MjMzLDAgMCwtMC41NzIxIC0yLjI4ODA4ODgsMCAtMi4yODgwODkyLDAgMCwwLjU2NjEgYyAwLDAuMzExMiAwLDAuNTY4NiAwLjAxMDAwNCwwLjU3MTkgMCwwIDEuMDMyOTQ2NiwwLjAxIDIuMjg4MDg5MiwwLjAxIGwgMi4yODIwODY4LDAgMCwtMC41NzE5IHogbSAtNy45OTkyNTc4LDAgMCwtMC4yODM5IDEuMTM5NTkyNywwIDEuMTM5NDkyNSwwIDAsMC4yODM5IDAsMC4yODM3IC0xLjEzOTQ5MjUsMCAtMS4xMzk1OTI3LDAgMCwtMC4yODM3IHpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfSAgICBcclxuICAgIHsjaWYgbmFtZT09PVwiZWRpdFJ1bGVzXCJ9XHJcbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDE0IDE0XCIgIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTYuNiA2Ljk5NjkyNXEwLS42NjI1LS40Njg3NS0xLjEzMTI1LS40Njg3NS0uNDY4NzUtMS4xMzEyNS0uNDY4NzUtLjY2MjUgMC0xLjEzMTI1LjQ2ODc1LS40Njg3NS40Njg3NS0uNDY4NzUgMS4xMzEyNSAwIC42NjI1LjQ2ODc1IDEuMTMxMjUuNDY4NzUuNDY4NzUgMS4xMzEyNS40Njg3NS42NjI1IDAgMS4xMzEyNS0uNDY4NzUuNDY4NzUtLjQ2ODc1LjQ2ODc1LTEuMTMxMjV6bTQuOCAzLjJxMC0uMzI1LS4yMzc1LS41NjI1LS4yMzc1LS4yMzc1LS41NjI1LS4yMzc1LS4zMjUgMC0uNTYyNS4yMzc1LS4yMzc1LjIzNzUtLjIzNzUuNTYyNSAwIC4zMzEyNS4yMzQzOC41NjU2Mi4yMzQzNy4yMzQzOC41NjU2Mi4yMzQzOC4zMzEyNSAwIC41NjU2Mi0uMjM0MzguMjM0MzgtLjIzNDM3LjIzNDM4LS41NjU2MnptMC02LjRxMC0uMzI1LS4yMzc1LS41NjI1LS4yMzc1LS4yMzc1LS41NjI1LS4yMzc1LS4zMjUgMC0uNTYyNS4yMzc1LS4yMzc1LjIzNzUtLjIzNzUuNTYyNSAwIC4zMzEyNS4yMzQzOC41NjU2My4yMzQzNy4yMzQzNy41NjU2Mi4yMzQzNy4zMzEyNSAwIC41NjU2Mi0uMjM0MzcuMjM0MzgtLjIzNDM4LjIzNDM4LS41NjU2M3ptLTIuNCAyLjYzMTI1djEuMTU2MjVxMCAuMDYyNS0uMDQzOC4xMjE4OC0uMDQzOC4wNTk0LS4xLjA2NTZsLS45Njg3NS4xNXEtLjA2ODguMjE4NzUtLjIuNDc1LjIxMjUuMy41NjI1LjcxODc1LjA0MzguMDYyNS4wNDM4LjEyNSAwIC4wNzUtLjA0MzguMTE4NzUtLjE0Mzc1LjE4NzUtLjUxNTYzLjU1OTM3LS4zNzE4Ny4zNzE4OC0uNDkwNjIuMzcxODgtLjA2ODggMC0uMTMxMjUtLjA0MzhsLS43MTg3NS0uNTYyNXEtLjIzMTI1LjExODc1LS40ODEyNS4xOTM3NS0uMDY4Ny42NzUtLjE0Mzc1Ljk2ODc1LS4wNDM4LjE1LS4xODc1LjE1aC0xLjE2MjVxLS4wNjg4IDAtLjEyNS0uMDQ2OS0uMDU2My0uMDQ2OS0uMDYyNS0uMTA5MzhsLS4xNDM3NS0uOTU2MjVxLS4yMTI1LS4wNjI1LS40Njg3NS0uMTkzNzVsLS43Mzc1LjU1NjI1cS0uMDQzNy4wNDM4LS4xMjUuMDQzOC0uMDY4NyAwLS4xMzEyNS0uMDUtLjktLjgzMTI1LS45LTEgMC0uMDU2My4wNDM3NS0uMTE4NzUuMDYyNS0uMDg3NS4yNTYyNS0uMzMxMjUuMTkzNzUtLjI0Mzc1LjI5Mzc1LS4zODEyNS0uMTQzNzUtLjI3NS0uMjE4NzUtLjUxMjVsLS45NS0uMTVxLS4wNjI1LS4wMDYtLjEwNjI1LS4wNTk0LS4wNDM3LS4wNTMwNS0uMDQzNy0uMTIxOHYtMS4xNTYyNXEwLS4wNjI1LjA0Mzc1LS4xMjE4OC4wNDM3NS0uMDU5NC4xLS4wNjU2bC45Njg3NS0uMTVxLjA2ODgtLjIxODc1LjItLjQ3NS0uMjEyNS0uMy0uNTYyNS0uNzE4NzUtLjA0Mzc1LS4wNjg4LS4wNDM3NS0uMTI1IDAtLjA3NS4wNDM3NS0uMTI1LjEzNzUtLjE4NzUuNTEyNS0uNTU2MjUuMzc1LS4zNjg3NS40OTM3NS0uMzY4NzUuMDY4OCAwIC4xMzEyNS4wNDM3bC43MTg3NS41NjI1cS4yMTI1LS4xMTI1LjQ4MTI1LS4yLjA2ODctLjY3NS4xNDM3NS0uOTYyNS4wNDM4LS4xNS4xODc1LS4xNWgxLjE2MjVxLjA2ODggMCAuMTI1LjA0NjkuMDU2My4wNDY5LjA2MjUuMTA5MzdsLjE0Mzc1Ljk1NjI1cS4yMTI1LjA2MjUuNDY4NzUuMTkzNzVsLjczNzUtLjU1NjI1cS4wNS0uMDQzNy4xMjUtLjA0MzcuMDY4NyAwIC4xMzEyNS4wNS45LjgzMTI1LjkgMSAwIC4wNTYyLS4wNDM4LjExODc1LS4wNzUuMS0uMjYyNS4zMzc1LS4xODc1LjIzNzUtLjI4MTI1LjM3NS4xNDM3NS4zLjIxMjUuNTEyNWwuOTUuMTQzNzVxLjA2MjUuMDEyNS4xMDYyNS4wNjU2LjA0MzguMDUzMS4wNDM4LjEyMTg3em00IDMuMzMxMjV2Ljg3NXEwIC4xLS45MzEyNS4xOTM3NS0uMDc1LjE2ODc1LS4xODc1LjMyNS4zMTg3NS43MDYyNS4zMTg3NS44NjI1IDAgLjAyNS0uMDI1LjA0MzctLjc2MjUuNDQzNzUtLjc3NS40NDM3NS0uMDUgMC0uMjg3NS0uMjkzNzUtLjIzNzUtLjI5Mzc1LS4zMjUtLjQyNS0uMTI1LjAxMjUtLjE4NzUuMDEyNS0uMDYyNSAwLS4xODc1LS4wMTI1LS4wODc1LjEzMTI1LS4zMjUuNDI1LS4yMzc1LjI5Mzc1LS4yODc1LjI5Mzc1LS4wMTI1IDAtLjc3NS0uNDQzNzUtLjAyNS0uMDE4Ny0uMDI1LS4wNDM3IDAtLjE1NjI1LjMxODc1LS44NjI1LS4xMTI1LS4xNTYyNS0uMTg3NS0uMzI1LS45MzEyNS0uMDkzNy0uOTMxMjUtLjE5Mzc1di0uODc1cTAtLjEuOTMxMjUtLjE5Mzc1LjA4MTMtLjE4MTI1LjE4NzUtLjMyNS0uMzE4NzUtLjcwNjI1LS4zMTg3NS0uODYyNSAwLS4wMjUuMDI1LS4wNDM4LjAyNS0uMDEyNS4yMTg3NS0uMTI1LjE5Mzc1LS4xMTI1LjM2ODc1LS4yMTI1LjE3NS0uMS4xODc1LS4xLjA1IDAgLjI4NzUuMjkwNjMuMjM3NS4yOTA2Mi4zMjUuNDIxODcuMTI1LS4wMTI1LjE4NzUtLjAxMjUuMDYyNSAwIC4xODc1LjAxMjUuMzE4NzUtLjQ0Mzc1LjU3NS0uN2wuMDM3NS0uMDEyNXEuMDI1IDAgLjc3NS40Mzc1LjAyNS4wMTg4LjAyNS4wNDM4IDAgLjE1NjI1LS4zMTg3NS44NjI1LjEwNjI1LjE0Mzc1LjE4NzUuMzI1LjkzMTI1LjA5MzcuOTMxMjUuMTkzNzV6bTAtNi40di44NzVxMCAuMS0uOTMxMjUuMTkzNzUtLjA3NS4xNjg3NS0uMTg3NS4zMjUuMzE4NzUuNzA2MjUuMzE4NzUuODYyNSAwIC4wMjUtLjAyNS4wNDM4LS43NjI1LjQ0Mzc1LS43NzUuNDQzNzUtLjA1IDAtLjI4NzUtLjI5Mzc1LS4yMzc1LS4yOTM3NS0uMzI1LS40MjUtLjEyNS4wMTI1LS4xODc1LjAxMjUtLjA2MjUgMC0uMTg3NS0uMDEyNS0uMDg3NS4xMzEyNS0uMzI1LjQyNS0uMjM3NS4yOTM3NS0uMjg3NS4yOTM3NS0uMDEyNSAwLS43NzUtLjQ0Mzc1LS4wMjUtLjAxODgtLjAyNS0uMDQzOCAwLS4xNTYyNS4zMTg3NS0uODYyNS0uMTEyNS0uMTU2MjUtLjE4NzUtLjMyNS0uOTMxMjUtLjA5MzctLjkzMTI1LS4xOTM3NXYtLjg3NXEwLS4xLjkzMTI1LS4xOTM3NS4wODEzLS4xODEyNS4xODc1LS4zMjUtLjMxODc1LS43MDYyNS0uMzE4NzUtLjg2MjUgMC0uMDI1LjAyNS0uMDQzOC4wMjUtLjAxMjUuMjE4NzUtLjEyNS4xOTM3NS0uMTEyNS4zNjg3NS0uMjEyNS4xNzUtLjEuMTg3NS0uMS4wNSAwIC4yODc1LjI5MDYyLjIzNzUuMjkwNjMuMzI1LjQyMTg4LjEyNS0uMDEyNS4xODc1LS4wMTI1LjA2MjUgMCAuMTg3NS4wMTI1LjMxODc1LS40NDM3NS41NzUtLjdsLjAzNzUtLjAxMjVxLjAyNSAwIC43NzUuNDM3NS4wMjUuMDE4OC4wMjUuMDQzOCAwIC4xNTYyNS0uMzE4NzUuODYyNS4xMDYyNS4xNDM3NS4xODc1LjMyNS45MzEyNS4wOTM3LjkzMTI1LjE5Mzc1elwiLz48L3N2Zz5cclxuICAgIHsvaWZ9ICAgIFxyXG5cclxuPC9kaXY+XHJcblxyXG48c3R5bGU+XHJcbiAgICAuZGVmYXVsdCB7XHJcbiAgICAgICAgZmlsbDogd2hpdGU7XHJcbiAgICAgICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyOyAgICAgICAgXHJcbiAgICAgICAgd2lkdGg6IDMwcHg7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgfVxyXG4gICAgLmRlZmF1bHQ6aG92ZXIsIC5hY3RpdmUge1xyXG4gICAgICAgIGZpbGw6IGJsYWNrO1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNkZGI3NGY7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgfSAgXHJcbiAgICAuZGVhY3RpdmF0ZSB7XHJcbiAgICAgICAgZmlsbDogZ3JleTtcclxuICAgICAgICBjdXJzb3I6IGRlZmF1bHQ7XHJcbiAgICB9XHJcbiAgICAuZGVhY3RpdmF0ZTpob3ZlciB7XHJcbiAgICAgICAgZmlsbDogZ3JleTtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgIH1cclxuXHJcbiAgICAuZGVmYXVsdCBzdmcge1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIH0gIFxyXG4gICAgLmxlZnRNZW51SWNvbiB7XHJcbiAgICAgICAgcGFkZGluZy10b3A6IDhweDtcclxuICAgICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICB9XHJcbiAgICAubGVmdE1lbnVJY29uMiB7XHJcbiAgICAgICAgcGFkZGluZy10b3A6IDRweDtcclxuICAgICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC5sZWZ0TWVudVRvcE1hcmdpbiB7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogMjBweDtcclxuICAgIH1cclxuICAgIC5vdXRlciB7XHJcbiAgICAgICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgfVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFvRUksb0NBQVMsQ0FDTCxJQUFJLENBQUUsS0FBSyxDQUNYLFFBQVEsWUFBWSxDQUNwQixNQUFNLENBQUUsT0FBTyxDQUNmLEtBQUssQ0FBRSxJQUFJLENBQ1gsVUFBVSxDQUFFLE1BQ2hCLENBQ0Esb0NBQVEsTUFBTSxDQUFFLG1DQUFRLENBQ3BCLElBQUksQ0FBRSxLQUFLLENBQ1gsZ0JBQWdCLENBQUUsT0FBTyxDQUN6QixhQUFhLENBQUUsR0FDbkIsQ0FDQSx1Q0FBWSxDQUNSLElBQUksQ0FBRSxJQUFJLENBQ1YsTUFBTSxDQUFFLE9BQ1osQ0FDQSx1Q0FBVyxNQUFPLENBQ2QsSUFBSSxDQUFFLElBQUksQ0FDVixVQUFVLENBQUUsV0FDaEIsQ0FFQSxzQkFBUSxDQUFDLGlCQUFJLENBQ1QsT0FBTyxDQUFFLFlBQ2IsQ0FDQSx5Q0FBYyxDQUNWLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLE1BQU0sQ0FBRSxJQUNaLENBQ0EsMENBQWUsQ0FDWCxXQUFXLENBQUUsR0FBRyxDQUNoQixNQUFNLENBQUUsSUFDWixDQUVBLDhDQUFtQixDQUNmLFVBQVUsQ0FBRSxJQUNoQixDQUNBLGtDQUFPLENBQ0gsUUFBUSxZQUFZLENBQ3BCLE1BQU0sQ0FBRSxPQUNaIn0= */");
    }

    // (28:4) {#if name==="move"}
    function create_if_block_8$1(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			attr_dev(path0, "d", "M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path0, file$1, 31, 8, 1366);
    			attr_dev(path1, "d", "M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path1, file$1, 32, 8, 1432);
    			attr_dev(path2, "d", "M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path2, file$1, 33, 8, 1499);
    			attr_dev(path3, "d", "M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path3, file$1, 34, 8, 1566);
    			attr_dev(path4, "d", "M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path4, file$1, 35, 8, 1633);
    			attr_dev(path5, "d", "M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path5, file$1, 36, 8, 1701);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "#FFF");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "id", "dragModelManagerTopBarIcon");
    			attr_dev(svg, "cursor", "move");
    			attr_dev(svg, "class", "svelte-h496x3");
    			add_location(svg, file$1, 28, 8, 1117);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(28:4) {#if name===\\\"move\\\"}",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#if name==="down"}
    function create_if_block_7$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z");
    			add_location(path, file$1, 40, 95, 1908);
    			attr_dev(svg, "viewBox", "0 0 320 512");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "class", "svelte-h496x3");
    			add_location(svg, file$1, 40, 8, 1821);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(40:4) {#if name===\\\"down\\\"}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#if name==="up"}
    function create_if_block_6$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z");
    			add_location(path, file$1, 43, 95, 2262);
    			attr_dev(svg, "viewBox", "0 0 320 512");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "class", "svelte-h496x3");
    			add_location(svg, file$1, 43, 8, 2175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(43:4) {#if name===\\\"up\\\"}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if name==="save"}
    function create_if_block_5$1(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2");
    			add_location(path0, file$1, 46, 265, 2786);
    			attr_dev(path1, "d", "M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0");
    			add_location(path1, file$1, 46, 351, 2872);
    			attr_dev(path2, "d", "M14 4l0 4l-6 0l0 -4");
    			add_location(path2, file$1, 46, 409, 2930);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "23");
    			attr_dev(svg, "height", "23");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "tabler-icon tabler-icon-device-floppy svelte-h496x3");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			add_location(svg, file$1, 46, 8, 2529);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(46:4) {#if name===\\\"save\\\"}",
    		ctx
    	});

    	return block;
    }

    // (49:4) {#if name==="Gyre"}
    function create_if_block_4$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAMAAACKeiw+AAAC/VBMVEUAAAAfQ1FJNEQ4TVEfPFcsd5MgSGEeSlpzf5c+sMgXia8XT20vgpcmOFEdNU0YYoWjQ2pMT2oganJeLUxZN0BOSlAck/h1hqck5PZQXn0bLEQotdcUGy1H+/8UfKhAgd3qiLc81ugvyN4jd8rpWosnM01EoLFJwc3WcaNYX2Imt8h6e4ZDere3vc2ssb8fgp6ZHVhuc4Ali6JRdp2oWECJkJkJRmtCSVAoQFl4e38mdn1lZ2IkPlqkVP8Hkv8GBRAAh/88YWoNDx1K/v87+f8Bxf8Jff/hkPoNR+//c5MsUFofNkcTGCgBAAVn//9X//8x/P8b7v9a3/8azv8Dp//TgP+aTP+5Rf+wQP8Nzv4f2v2/aP3kmPw74vvJefs12vm42fkBbu7yjOiutdYFQ9Ton9MCM87sWMvuaMrjbsYCJLNUMpEKG3/7V3AfQG8tUWx0AGUnS2M0RlUnQVRvAFMnNFAcLEj/nj4WKDoTHDgWIjUUISz+ww17//828P8z7P8M5//Q5v9q3P/11P8AvP8Asf/lov//nf9Amv//bP+6Tv//Rv+iRf8NVv5H6v1Yz/3SiP2I4fxmtfzYt/vqyvgam/cAgveedve4YPaR0vVp0PRZxPRBxfKySvGhzPBAr/D/c+wHuOsDU+rklOnXaunKWenCheTRRuOTn+I8iOCUzd3lUdz/lNv/ttractq1qNkZltcBZdQXhNI/udGMxtBpqs/Ses3uhMcCYMf/4sLLY8EkYsEGPb0Se7plSbjmVbe2c7bilrUfi7P1abD/S6/rSq1tXKwoQ6z1sKSdTKT0s6Fvf6BLdZ7WZ55pZ54uhJsGHpf4UpXaopMsgpLLAJL6Y4+iAI7jRYvkAInFJoc0eob8aIMcOYJ4IoJDVoD0wX9WJH4RLHjzPnfJPnToXXBNAHCbE2wTJ2lhjmNxoGIgOWGtI2Bhil2aEVSfJFKRC1H/tUyZAEv/g0pnd0hnAEPMnzr/tif/pyb/iSCYiBT/pADmngDSmwDFkQD/jQDNN3N7AAAAPXRSTlMAGRAKk3w3Kdq/lZWNe3FnX0hDQxsV/f36+vr29vLt5+Hg2dHPy8nEw72pmpiTjIyKfXhycW1jYFpXNSQd0lS2vQAAAchJREFUKM9ioCIwUuPRssIpq+8X2yChxIhLmtMvKpCVgRm7JBu7uvOsJjYcWhmNeThdZjazYpcVZdSRXzk/PqFRiIEJizQ/l3JH/6TpSxcsE8Qiyy69d45LQG1C0uL2tSboksyMQnKbXaLmnbz7IPvY+p0qAujmcx9ydk1+9uXtu/clT/dN6dRA851ZrGvQ2Y+5Vz1vP3ldkj25W0EU1WX1rROvP8qY656U4fm44Fzb6jXCyNKsda5bcveHARY9Ic52iefNglVBmSJIsiJbgyNf/lhuG5N6IsZ23cVrB5xXCCBkrbXPTA28/CvdNvRgzalQ28NXdvnPNkC43pSjaLedw89v4bbul1LdbTNvbOuLR7Jb93Rpfprdxj8fwnui42aEHT2SvFAWyWo98cqiOx52O/7WbO+KiEj/dH9DgCKStCVHWZVjjodd4uff38vL/33dFOnPhRyohvecioHybg6Jt968OD+tJVgMJc0wSVbaezk+z+p1c3CwCwlxW4SWKsxLnXyLHfMfXshKS0nZcxwjUnkr7H2rC728CvPyXnlrYsa4RZmPva9Thbd3tY8qtuTExCJV5WRv7yPDiyM1svOxcLPw2RCfbQBuO530bO8cGwAAAABJRU5ErkJggg==")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$1, 50, 8, 3074);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(49:4) {#if name===\\\"Gyre\\\"}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#if name==="list"}
    function create_if_block_3$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m1 9.6262715h12v2.6837195h-12zm0-3.909844h12v2.68288h-12zm0-4.026418h12v2.684558h-12z");
    			add_location(path, file$1, 53, 93, 5059);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-h496x3");
    			add_location(svg, file$1, 53, 8, 4974);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(53:4) {#if name===\\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (56:4) {#if name==="properties"}
    function create_if_block_2$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m3.6580703 10.816142q0-.189779-.1388283-.328607-.1388283-.138828-.328607-.138828-.1897788 0-.3286071.138828-.1388283.138828-.1388283.328607 0 .189779.1388283.328607.1388283.138828.3286071.138828.1897787 0 .328607-.138828.1388283-.138828.1388283-.328607zm4.7038018-3.0673106-4.980991 4.9809906q-.2701776.270178-.657214.270178-.3795575 0-.6646931-.270178l-.7740729-.788563q-.2776566-.262699-.2776566-.657214 0-.387037.2776566-.664693l4.9739794-4.9739796q.2846681.7156435.8362418 1.2672172.5515737.5515737 1.2672172.8362418zm4.6304139-3.177158q0 .2846681-.167808.7740729-.343099.9788096-1.20131 1.5883453-.858211.6095357-1.8879709.6100031-1.3513555 0-2.3114677-.9605796-.9601122-.9605796-.9605796-2.3114677-.0004675-1.3508882.9605796-2.3114678.961047-.9605796 2.3114677-.9605796.4234959 0 .8871919.1205983.463696.1205983.785292.3398255.116859.080399.116859.2047367 0 .1243378-.116859.2047367l-2.1399192 1.2344967v1.6360237l1.4097852.7815519q.03646-.021969.576814-.354316.540356-.3323466.989562-.5917732.449204-.2594266.515114-.2594266.109379 0 .171548.07292.06217.07292.06217.1827673z");
    			add_location(path, file$1, 56, 91, 5297);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-h496x3");
    			add_location(svg, file$1, 56, 8, 5214);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(56:4) {#if name===\\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {#if name==="editForm"}
    function create_if_block_1$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m 1.1997995,12.993916 c -0.079034,-0.023 -0.164071,-0.1093 -0.1879813,-0.1914 -0.012005,-0.042 -0.013006,-0.6895 -0.011005,-5.8210003 l 0,-5.774 0.02201,-0.045 c 0.028012,-0.057 0.083036,-0.1117 0.1401606,-0.1401 l 0.045019,-0.022 5.7922041,0 5.7923041,0 0.05102,0.025 c 0.05602,0.027 0.103645,0.075 0.135459,0.1345 l 0.02101,0.039 0,5.7832 c 0,5.3765003 0,5.7866003 -0.01301,5.8311003 -0.01901,0.06 -0.07903,0.1291 -0.141761,0.1621 l -0.04602,0.024 -5.7877023,0 c -3.4562942,9e-4 -5.799207,0 -5.8160143,-0.01 z m 11.2366575,-5.9919003 0,-5.4342 -5.4319481,0 -5.4318482,0 0,5.4229 c 0,2.9826 -4.002e-4,5.4280003 0,5.4342003 0,0.01 1.0990751,0.011 5.4365502,0.011 l 5.4321481,0 0,-5.4342003 z m -6.8619663,3.7181003 0,-0.8603003 0.8557699,0 0.85577,0 0,0.8603003 0,0.8603 -0.85577,0 -0.8557699,0 0,-0.8603 z m 1.1439945,0 0,-0.2838 -0.2882246,0 -0.2883246,0 0,0.2838 0,0.2837 0.2883246,0 0.2882246,0 0,-0.2837 z m 1.1440947,0 0,-0.2838 1.7160418,0 1.7160413,0 0,0.2838 0,0.2837 -1.7160413,0 -1.7160418,0 0,-0.2837 z m -2.2880892,-3.1483003 0,-1.1441 2.8600364,0 2.8601359,0 0,1.1441 0,1.1439 -2.8601359,0 -2.8600364,0 0,-1.1439 z m 5.1436233,0 0,-0.5721 -2.2880888,0 -2.2880892,0 0,0.5661 c 0,0.3113 0,0.5687 0.010004,0.572 0,0 1.0329466,0.01 2.2880892,0.01 l 2.2820868,0 0,-0.572 z m -7.9992578,0 0,-0.2884 1.1395927,0 1.1394925,0 0,0.2884 0,0.2882 -1.1394925,0 -1.1395927,0 0,-0.2882 z m 2.8556345,-3.4321 0,-1.1441 2.8600364,0 2.8601359,0 0,1.1441 0,1.144 -2.8601359,0 -2.8600364,0 0,-1.144 z m 5.1436233,0 0,-0.5721 -2.2880888,0 -2.2880892,0 0,0.5661 c 0,0.3112 0,0.5686 0.010004,0.5719 0,0 1.0329466,0.01 2.2880892,0.01 l 2.2820868,0 0,-0.5719 z m -7.9992578,0 0,-0.2839 1.1395927,0 1.1394925,0 0,0.2839 0,0.2837 -1.1394925,0 -1.1395927,0 0,-0.2837 z");
    			add_location(path, file$1, 59, 111, 6549);
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "class", "svelte-h496x3");
    			add_location(svg, file$1, 59, 8, 6446);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(59:4) {#if name===\\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (62:4) {#if name==="editRules"}
    function create_if_block$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m6.6 6.996925q0-.6625-.46875-1.13125-.46875-.46875-1.13125-.46875-.6625 0-1.13125.46875-.46875.46875-.46875 1.13125 0 .6625.46875 1.13125.46875.46875 1.13125.46875.6625 0 1.13125-.46875.46875-.46875.46875-1.13125zm4.8 3.2q0-.325-.2375-.5625-.2375-.2375-.5625-.2375-.325 0-.5625.2375-.2375.2375-.2375.5625 0 .33125.23438.56562.23437.23438.56562.23438.33125 0 .56562-.23438.23438-.23437.23438-.56562zm0-6.4q0-.325-.2375-.5625-.2375-.2375-.5625-.2375-.325 0-.5625.2375-.2375.2375-.2375.5625 0 .33125.23438.56563.23437.23437.56562.23437.33125 0 .56562-.23437.23438-.23438.23438-.56563zm-2.4 2.63125v1.15625q0 .0625-.0438.12188-.0438.0594-.1.0656l-.96875.15q-.0688.21875-.2.475.2125.3.5625.71875.0438.0625.0438.125 0 .075-.0438.11875-.14375.1875-.51563.55937-.37187.37188-.49062.37188-.0688 0-.13125-.0438l-.71875-.5625q-.23125.11875-.48125.19375-.0687.675-.14375.96875-.0438.15-.1875.15h-1.1625q-.0688 0-.125-.0469-.0563-.0469-.0625-.10938l-.14375-.95625q-.2125-.0625-.46875-.19375l-.7375.55625q-.0437.0438-.125.0438-.0687 0-.13125-.05-.9-.83125-.9-1 0-.0563.04375-.11875.0625-.0875.25625-.33125.19375-.24375.29375-.38125-.14375-.275-.21875-.5125l-.95-.15q-.0625-.006-.10625-.0594-.0437-.05305-.0437-.1218v-1.15625q0-.0625.04375-.12188.04375-.0594.1-.0656l.96875-.15q.0688-.21875.2-.475-.2125-.3-.5625-.71875-.04375-.0688-.04375-.125 0-.075.04375-.125.1375-.1875.5125-.55625.375-.36875.49375-.36875.0688 0 .13125.0437l.71875.5625q.2125-.1125.48125-.2.0687-.675.14375-.9625.0438-.15.1875-.15h1.1625q.0688 0 .125.0469.0563.0469.0625.10937l.14375.95625q.2125.0625.46875.19375l.7375-.55625q.05-.0437.125-.0437.0687 0 .13125.05.9.83125.9 1 0 .0562-.0438.11875-.075.1-.2625.3375-.1875.2375-.28125.375.14375.3.2125.5125l.95.14375q.0625.0125.10625.0656.0438.0531.0438.12187zm4 3.33125v.875q0 .1-.93125.19375-.075.16875-.1875.325.31875.70625.31875.8625 0 .025-.025.0437-.7625.44375-.775.44375-.05 0-.2875-.29375-.2375-.29375-.325-.425-.125.0125-.1875.0125-.0625 0-.1875-.0125-.0875.13125-.325.425-.2375.29375-.2875.29375-.0125 0-.775-.44375-.025-.0187-.025-.0437 0-.15625.31875-.8625-.1125-.15625-.1875-.325-.93125-.0937-.93125-.19375v-.875q0-.1.93125-.19375.0813-.18125.1875-.325-.31875-.70625-.31875-.8625 0-.025.025-.0438.025-.0125.21875-.125.19375-.1125.36875-.2125.175-.1.1875-.1.05 0 .2875.29063.2375.29062.325.42187.125-.0125.1875-.0125.0625 0 .1875.0125.31875-.44375.575-.7l.0375-.0125q.025 0 .775.4375.025.0188.025.0438 0 .15625-.31875.8625.10625.14375.1875.325.93125.0937.93125.19375zm0-6.4v.875q0 .1-.93125.19375-.075.16875-.1875.325.31875.70625.31875.8625 0 .025-.025.0438-.7625.44375-.775.44375-.05 0-.2875-.29375-.2375-.29375-.325-.425-.125.0125-.1875.0125-.0625 0-.1875-.0125-.0875.13125-.325.425-.2375.29375-.2875.29375-.0125 0-.775-.44375-.025-.0188-.025-.0438 0-.15625.31875-.8625-.1125-.15625-.1875-.325-.93125-.0937-.93125-.19375v-.875q0-.1.93125-.19375.0813-.18125.1875-.325-.31875-.70625-.31875-.8625 0-.025.025-.0438.025-.0125.21875-.125.19375-.1125.36875-.2125.175-.1.1875-.1.05 0 .2875.29062.2375.29063.325.42188.125-.0125.1875-.0125.0625 0 .1875.0125.31875-.44375.575-.7l.0375-.0125q.025 0 .775.4375.025.0188.025.0438 0 .15625-.31875.8625.10625.14375.1875.325.93125.0937.93125.19375z");
    			add_location(path, file$1, 62, 92, 8460);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-h496x3");
    			add_location(svg, file$1, 62, 8, 8376);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(62:4) {#if name===\\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let div_class_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*name*/ ctx[0] === "move" && create_if_block_8$1(ctx);
    	let if_block1 = /*name*/ ctx[0] === "down" && create_if_block_7$1(ctx);
    	let if_block2 = /*name*/ ctx[0] === "up" && create_if_block_6$1(ctx);
    	let if_block3 = /*name*/ ctx[0] === "save" && create_if_block_5$1(ctx);
    	let if_block4 = /*name*/ ctx[0] === "Gyre" && create_if_block_4$1(ctx);
    	let if_block5 = /*name*/ ctx[0] === "list" && create_if_block_3$1(ctx);
    	let if_block6 = /*name*/ ctx[0] === "properties" && create_if_block_2$1(ctx);
    	let if_block7 = /*name*/ ctx[0] === "editForm" && create_if_block_1$1(ctx);
    	let if_block8 = /*name*/ ctx[0] === "editRules" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-h496x3"));
    			add_location(div, file$1, 26, 0, 961);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t3);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t4);
    			if (if_block5) if_block5.m(div, null);
    			append_dev(div, t5);
    			if (if_block6) if_block6.m(div, null);
    			append_dev(div, t6);
    			if (if_block7) if_block7.m(div, null);
    			append_dev(div, t7);
    			if (if_block8) if_block8.m(div, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousedown", /*mousedown_handler*/ ctx[5], false, false, false, false),
    					listen_dev(div, "click", /*click_handler*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*name*/ ctx[0] === "move") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_8$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*name*/ ctx[0] === "down") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_7$1(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*name*/ ctx[0] === "up") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_6$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*name*/ ctx[0] === "save") {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_5$1(ctx);
    					if_block3.c();
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*name*/ ctx[0] === "Gyre") {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_4$1(ctx);
    					if_block4.c();
    					if_block4.m(div, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*name*/ ctx[0] === "list") {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_3$1(ctx);
    					if_block5.c();
    					if_block5.m(div, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*name*/ ctx[0] === "properties") {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_2$1(ctx);
    					if_block6.c();
    					if_block6.m(div, t6);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*name*/ ctx[0] === "editForm") {
    				if (if_block7) ; else {
    					if_block7 = create_if_block_1$1(ctx);
    					if_block7.c();
    					if_block7.m(div, t7);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*name*/ ctx[0] === "editRules") {
    				if (if_block8) ; else {
    					if_block8 = create_if_block$1(ctx);
    					if_block8.c();
    					if_block8.m(div, null);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (dirty & /*className*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-h496x3"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { name = "" } = $$props;
    	let { state = "" } = $$props;
    	let { deactivate = "" } = $$props;
    	let activeClass = "";
    	if (state === name) activeClass = " active";
    	if (deactivate === "deactivate") activeClass = " deactivate";
    	const dispatch = createEventDispatcher();

    	let iconsInfo = {
    		"down": { class: "default" },
    		"up": { class: "default" },
    		"list": { class: "default leftMenuIcon" },
    		"properties": {
    			class: "default leftMenuIcon2 leftMenuTopMargin"
    		},
    		"editForm": {
    			class: "default leftMenuIcon2 leftMenuTopMargin"
    		},
    		"editRules": {
    			class: "default leftMenuIcon2 leftMenuTopMargin"
    		}
    	};

    	let info = iconsInfo[name];
    	let className = "outer";
    	if (info) className = info.class;
    	className += activeClass;
    	const writable_props = ['name', 'state', 'deactivate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = e => {
    		dispatch("mousedown", e);
    	};

    	const click_handler = e => {
    		dispatch("click", e);
    	};

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('state' in $$props) $$invalidate(3, state = $$props.state);
    		if ('deactivate' in $$props) $$invalidate(4, deactivate = $$props.deactivate);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		name,
    		state,
    		deactivate,
    		activeClass,
    		dispatch,
    		iconsInfo,
    		info,
    		className
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('state' in $$props) $$invalidate(3, state = $$props.state);
    		if ('deactivate' in $$props) $$invalidate(4, deactivate = $$props.deactivate);
    		if ('activeClass' in $$props) activeClass = $$props.activeClass;
    		if ('iconsInfo' in $$props) iconsInfo = $$props.iconsInfo;
    		if ('info' in $$props) info = $$props.info;
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, className, dispatch, state, deactivate, mousedown_handler, click_handler];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 0, state: 3, deactivate: 4 }, add_css$2);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set deactivate(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\WorkflowManager.svelte generated by Svelte v3.59.2 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src\\WorkflowManager.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-1ac5lll", "@import 'dist/build/gyrestyles.css';\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gICAgaW1wb3J0IEZvcm1CdWlsZGVyIGZyb20gXCIuL0Zvcm1CdWlsZGVyLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQgUnVsZUVkaXRvciBmcm9tIFwiLi9SdWxlRWRpdG9yLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQge3dyaXRhYmxlfSBmcm9tICdzdmVsdGUvc3RvcmUnXHJcbiAgICBpbXBvcnQge29uTW91bnQsIGJlZm9yZVVwZGF0ZX0gZnJvbSAnc3ZlbHRlJ1xyXG4gICAgaW1wb3J0IHtnZXRfYWxsX2RpcnR5X2Zyb21fc2NvcGV9IGZyb20gXCJzdmVsdGUvaW50ZXJuYWxcIjtcclxuICAgIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gJy4vc3RvcmVzL21ldGFkYXRhJ1xyXG4gICAgaW1wb3J0IEljb24gZnJvbSAnLi9JY29uLnN2ZWx0ZSdcclxuICAgIGltcG9ydCB7IHRpY2sgfSBmcm9tIFwic3ZlbHRlXCJcclxuXHJcbiAgICBsZXQgYWxsd29ya2Zsb3dzO1xyXG4gICAgbGV0IG1vdmluZyA9IGZhbHNlO1xyXG4gICAgbGV0IGxlZnQgPSAxMFxyXG4gICAgbGV0IHRvcCA9IDEwXHJcbiAgICBsZXQgc3R5bGVlbDtcclxuICAgIGxldCBsb2FkZWR3b3JrZmxvdztcclxuXHJcbiAgICBsZXQgZm9sZE91dCA9IGZhbHNlXHJcbiAgICBsZXQgbmFtZSA9IFwiXCIgICAvLyBjdXJyZW50IGxvYWRlZCB3b3JrZmxvdyBuYW1lXHJcbiAgICBsZXQgc3RhdGUgPSBcImxpc3RcIlxyXG4gICAgbGV0IHRhZ3MgPSBbXCJUeHQySW1hZ2VcIiwgXCJJbnBhaW50aW5nXCIsIFwiQ29udHJvbE5ldFwiLCBcIkxheWVyTWVudVwiLCBcIkRlYWN0aXZhdGVkXCJdXHJcbiAgICBsZXQgd29ya2Zsb3dMaXN0ID0gd3JpdGFibGUoW10pICAgIC8vIHRvZG86bG9hZCBhbGwgd29ya2Zsb3cgYmFzaWMgZGF0YSAobmFtZSwgbGFzdCBjaGFuZ2VkIGFuZCBneXJlIG9iamVjdCkgZnJvbSBzZXJ2ZXIgdmlhIHNlcnZlciByZXF1ZXN0XHJcbiAgICBsZXQgYWN0aXZhdGVkVGFncyA9IHt9XHJcbiAgICBsZXQgc2VsZWN0ZWRUYWcgPSBcIlwiXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIG1vdmluZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xyXG4gICAgICAgIGlmIChtb3ZpbmcpIHtcclxuICAgICAgICAgICAgbGVmdCArPSBlLm1vdmVtZW50WDtcclxuICAgICAgICAgICAgdG9wICs9IGUubW92ZW1lbnRZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdW50KGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCBsb2FkTGlzdCgpO1xyXG4gICAgICAgIGFkZEV4dGVybmFsTG9hZExpc3RlbmVyKCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRXh0ZXJuYWxMb2FkTGlzdGVuZXIoKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21meS1maWxlLWlucHV0XCIpO1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dExpc3RlbmVyID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZmlsZUlucHV0ICYmIGZpbGVJbnB1dC5maWxlcyAmJiBmaWxlSW5wdXQuZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmlsZUlucHV0LCBmaWxlSW5wdXQuZmlsZXMpO1xyXG4gICAgICAgICAgICAgICAgbmV3IERhdGUoZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZCkudG9EYXRlU3RyaW5nKClcclxuICAgICAgICAgICAgICAgIGxldCBmaXhlZGZpbGVuYW1lID0gZ2V0QXZhbGFibGVGaWxlTmFtZShmaWxlSW5wdXQuZmlsZXNbMF0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JhcGggPSB3aW5kb3cuYXBwLmdyYXBoLnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGgubmFtZSA9IGZpeGVkZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5sYXN0TW9kaWZpZWQgPSBmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkXHJcbiAgICAgICAgICAgICAgICBpZiAoIWdyYXBoLmV4dHJhPy53b3Jrc3BhY2VfaW5mbykgZ3JhcGguZXh0cmEud29ya3NwYWNlX2luZm8gPSBbXTtcclxuICAgICAgICAgICAgICAgIGdyYXBoLmV4dHJhLndvcmtzcGFjZV9pbmZvLm5hbWUgPSBmaXhlZGZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEud29ya3NwYWNlX2luZm8ubGFzdE1vZGlmaWVkID0gZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZDtcclxuICAgICAgICAgICAgICAgIGdyYXBoLmV4dHJhLndvcmtzcGFjZV9pbmZvLmxhc3RNb2RpZmllZFJlYWRhYmxlID0gbmV3IERhdGUoZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFncmFwaC5leHRyYS5neXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEuZ3lyZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEuZ3lyZS5sYXN0TW9kaWZpZWQgPSBmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEuZ3lyZS5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IG5ldyBEYXRlKGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWQpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsb2FkZWR3b3JrZmxvdyA9IGdyYXBoO1xyXG4gICAgICAgICAgICAgICAgbG9hZFdvcmtmbG93KGdyYXBoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZmlsZUlucHV0Py5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZpbGVJbnB1dExpc3RlbmVyKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGdldEF2YWxhYmxlRmlsZU5hbWUobmFtZSkge1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuICduZXcnO1xyXG4gICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIGxldCBpbmQgPSAxO1xyXG4gICAgICAgIGxldCBnb29kbmFtZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBleHQgPSBuYW1lLnNwbGl0KCcuJykucG9wKCk7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXFwuW14vLl0rJC8sIFwiXCIpO1xyXG4gICAgICAgIGxldCBuZXduYW1lID0gbmFtZTtcclxuICAgICAgICB3aGlsZSAoIWdvb2RuYW1lKSB7XHJcbiAgICAgICAgICAgIGxldCBhbGxjdXJybmFtZXMgPSBhbGx3b3JrZmxvd3MubWFwKChlbCkgPT4gZWwubmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChhbGxjdXJybmFtZXMuaW5jbHVkZXMobmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIG5ld25hbWUgPSBgJHtuYW1lfSgke2luZH0pYDtcclxuICAgICAgICAgICAgICAgIGluZCA9IGluZCArIDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnb29kbmFtZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGAke25ld25hbWV9YDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIG1vdmluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBpc1Zpc2libGUod29ya2Zsb3cpIHtcclxuICAgICAgICBsZXQgbXl0YWdzID0gd29ya2Zsb3c/Lmd5cmU/LnRhZ3MgfHwgW107XHJcbiAgICAgICAgZm9yIChsZXQgYWN0aXZlVGFnIGluIGFjdGl2YXRlZFRhZ3MpIHtcclxuICAgICAgICAgICAgaWYgKGFjdGl2YXRlZFRhZ3NbYWN0aXZlVGFnXSAmJiAhbXl0YWdzLmluY2x1ZGVzKGFjdGl2ZVRhZykpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkTGlzdCgpIHtcclxuICAgICAgICAvLyB0b2RvOiBtYWtlIHNlcnZlciByZXF1ZXN0IGFuZCByZWFkICRtZXRhZGF0YSBvZiBhbGwgZXhpc3Rpbmcgd29ya2Zsb3dzIG9uIGZpbGVzeXN0ZW1cclxuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgc2NhbkxvY2FsTmV3RmlsZXMoKVxyXG4gICAgICAgIGxldCBkYXRhX3dvcmtmbG93X2xpc3QgPSByZXN1bHQubWFwKChlbCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzID0ge25hbWU6IGVsLm5hbWV9XHJcbiAgICAgICAgICAgIGxldCBneXJlID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGVsLmpzb24pIGd5cmUgPSBKU09OLnBhcnNlKGVsLmpzb24pLmV4dHJhLmd5cmU7XHJcbiAgICAgICAgICAgIHJlcy5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IEpTT04ucGFyc2UoZWwuanNvbikuZXh0cmEuZ3lyZT8ubGFzdE1vZGlmaWVkUmVhZGFibGUgfHwgXCJcIjtcclxuICAgICAgICAgICAgaWYgKGd5cmUpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5neXJlID0gZ3lyZTtcclxuICAgICAgICAgICAgICAgIHJlcy5neXJlLmxhc3RNb2RpZmllZFJlYWRhYmxlID0gSlNPTi5wYXJzZShlbC5qc29uKS5leHRyYS5neXJlPy5sYXN0TW9kaWZpZWRSZWFkYWJsZSB8fCBcIlwiO1xyXG4gICAgICAgICAgICAgICAgcmVzLmd5cmUubGFzdE1vZGlmaWVkID0gSlNPTi5wYXJzZShlbC5qc29uKS5leHRyYS5neXJlPy5sYXN0TW9kaWZpZWQgfHwgXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzXHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhX3dvcmtmbG93X2xpc3QpO1xyXG4gICAgICAgIHdvcmtmbG93TGlzdC5zZXQoZGF0YV93b3JrZmxvd19saXN0KVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHNjYW5Mb2NhbE5ld0ZpbGVzKCkge1xyXG4gICAgICAgIGxldCBleGlzdEZsb3dJZHMgPSBbXTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL3dvcmtzcGFjZS9yZWFkd29ya2Zsb3dkaXJcIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBleGlzdEZsb3dJZHMsXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZpeERhdGVzRnJvbVNlcnZlcihyZXN1bHQpO1xyXG4gICAgICAgICAgICBhbGx3b3JrZmxvd3MgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNjYW4gbG9jYWwgbmV3IGZpbGVzOlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpeERhdGVzRnJvbVNlcnZlcihyZXN1bHQpIHtcclxuICAgICAgICBsZXQgbmV3ZWwgPSByZXN1bHQubWFwKChlbCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb2JqanMgPSBKU09OLnBhcnNlKGVsLmpzb24pO1xyXG4gICAgICAgICAgICBvYmpqcy5leHRyYS5neXJlLmxhc3RNb2RpZmllZCA9IG5ldyBEYXRlKGVsLmxhc3Rtb2RpZmllZCAqIDEwMDApLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgbGV0IGRhdGVzdHIgPSBuZXcgRGF0ZShlbC5sYXN0bW9kaWZpZWQgKiAxMDAwKS50b0lTT1N0cmluZygpO1xyXG4gICAgICAgICAgICBvYmpqcy5leHRyYS5neXJlLmxhc3RNb2RpZmllZFJlYWRhYmxlID0gZGF0ZXN0ci5zcGxpdCgnVCcpWzBdICsgXCIgXCIgKyBkYXRlc3RyLnNwbGl0KCdUJylbMV0ucmVwbGFjZSgvXFwuW14vLl0rJC8sIFwiXCIpO1xyXG4gICAgICAgICAgICBsZXQganNvbiA9IEpTT04uc3RyaW5naWZ5KG9iampzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsuLi5lbCwganNvbn1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBuZXdlbDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gbG9hZFdvcmtmbG93KHdvcmtmbG93KSB7XHJcbiAgICAgICAgYXdhaXQgbG9hZExpc3QoKTtcclxuICAgICAgICAvLyB0b2RvOmNoZWNrIGlmIGN1cnJlbnQgd29ya2Zsb3cgaXMgdW5zYXZlZCBhbmQgbWFrZSBjb25maXJtIG90aGVyd2lzZVxyXG4gICAgICAgIC8vIDEuIG1ha2Ugc2VydmVyIHJlcXVlc3QgYnkgd29ya2Zsb3cubmFtZSwgZ2V0dGluZyBmdWxsIHdvcmtmbG93IGRhdGEgaGVyZVxyXG4gICAgICAgIC8vIDIuIHVwZGF0ZSBDb21meVVJIHdpdGggbmV3IHdvcmtmbG93XHJcbiAgICAgICAgLy8gMy4gc2V0IG5hbWUgYW5kICRtZXRhZGF0YSBoZXJlXHJcbiAgICAgICAgaWYgKCF3b3JrZmxvdy5neXJlKSB7XHJcbiAgICAgICAgICAgIHdvcmtmbG93Lmd5cmUgPSB7fTtcclxuICAgICAgICAgICAgd29ya2Zsb3cuZ3lyZS50YWdzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9hZCB3b3JrZmxvdyEhXCIpO1xyXG4gICAgICAgIG5hbWUgPSB3b3JrZmxvdy5uYW1lXHJcbiAgICAgICAgJG1ldGFkYXRhID0gd29ya2Zsb3cuZ3lyZTtcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5hcHAuZ3JhcGggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYXBwLmdyYXBoIGlzIG51bGwgY2Fubm90IGxvYWQgd29ya2Zsb3dcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50ID0gYWxsd29ya2Zsb3dzLmZpbmQoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbC5uYW1lID09IHdvcmtmbG93Lm5hbWU7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKCFsb2FkZWR3b3JrZmxvdykge1xyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hcHAubG9hZEdyYXBoRGF0YSh3b3JrZmxvdyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2YgPSBKU09OLnBhcnNlKGN1cnJlbnQuanNvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXdmLm5hbWUgJiYgbmFtZSkgd2YubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYXBwLmxvYWRHcmFwaERhdGEod2YpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgc3RhdGU9XCJwcm9wZXJ0aWVzXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHNhdmVXb3JrZmxvdygpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVXb3JrZmxvd1wiKTtcclxuICAgICAgICBsZXQgZ3JhcGggPSB3aW5kb3cuYXBwLmdyYXBoLnNlcmlhbGl6ZSgpO1xyXG5cclxuICAgICAgICAvLyB0aGlzIGlzIHNjZW5hcmlvIGp1c3QgYWZ0ZXIgbG9hZGluZyB3b3JrZmxvdyBhbmQgbm90IHNhdmUgaXRcclxuICAgICAgICBpZiAobG9hZGVkd29ya2Zsb3cgJiYgbG9hZGVkd29ya2Zsb3cuZXh0cmEud29ya3NwYWNlX2luZm8pIHtcclxuICAgICAgICAgICAgZ3JhcGguZXh0cmEgPSBsb2FkZWR3b3JrZmxvdy5leHRyYTtcclxuICAgICAgICAgICAgJG1ldGFkYXRhID0gbG9hZGVkd29ya2Zsb3cuZXh0cmEuZ3lyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9hZGVkd29ya2Zsb3cgPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgZmlsZV9wYXRoID0gZ3JhcGguZXh0cmE/LndvcmtzcGFjZV9pbmZvPy5uYW1lIHx8IFwibmV3Lmpzb25cIjtcclxuICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICBmaWxlX3BhdGggPSBuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZmlsZV9wYXRoLmVuZHNXaXRoKCcuanNvbicpKSB7XHJcbiAgICAgICAgICAgIC8vIEFkZCAuanNvbiBleHRlbnNpb24gaWYgaXQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgICBmaWxlX3BhdGggKz0gJy5qc29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRtZXRhZGF0YSAmJiBncmFwaC5leHRyYSkgZ3JhcGguZXh0cmEuZ3lyZSA9ICRtZXRhZGF0YTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3JhcGhKc29uID0gSlNPTi5zdHJpbmdpZnkoZ3JhcGgpO1xyXG4gICAgICAgIGF3YWl0IHVwZGF0ZUZpbGUoZmlsZV9wYXRoLCBncmFwaEpzb24pO1xyXG5cclxuICAgICAgICAvLyB0b2RvOmdldCB3b3JrZmxvdyBmb20gY29tZnlVSVxyXG4gICAgICAgIC8vICRtZXRhZGF0YSBzaG91bGQgYWxyZWFkeSBwb2ludCB0byBleHRyYXMuZ3lyZSAtIHNvIG5vdGhpbmcgdG8gZG8gaGVyZVxyXG4gICAgICAgIC8vIDEuIG1ha2Ugc2VydmVyIHJlcXVlc3QsIHdpdGggIG5hbWUgYW5kIGZ1bGwgd29ya2Zsb3csIHN0b3JlIGl0IG9uIGZpbGVzeXN0ZW0gdGhlcmVcclxuICAgICAgICAvLyAyLiBzZXQgdW5zYXZlZCBzdGF0ZSB0byBmYWxzZVxyXG4gICAgICAgIC8vIDMuIGxvYWQgbGlzdCBvZiBhbGwgd29ya2Zsb3dzIGFnYWluXHJcbiAgICAgICAgYWxlcnQoXCJzYXZlIHdvcmtmbG93IFwiICsgbmFtZSkgLy8gcmVtb3ZlXHJcblxyXG4gICAgICAgIGF3YWl0IGxvYWRMaXN0KCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUZpbGUoZmlsZV9wYXRoLCBqc29uRGF0YSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvd29ya3NwYWNlL3VwZGF0ZV9qc29uX2ZpbGVcIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZV9wYXRoOiBmaWxlX3BhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAganNvbl9zdHI6IGpzb25EYXRhLFxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBzYXZpbmcgd29ya2Zsb3cgLmpzb24gZmlsZTogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzYXZpbmcgd29ya3NwYWNlOlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRUYWcoKSB7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RlZFRhZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEudGFncykgJG1ldGFkYXRhLnRhZ3MgPSBbXVxyXG4gICAgICAgICRtZXRhZGF0YS50YWdzLnB1c2goc2VsZWN0ZWRUYWcpXHJcbiAgICAgICAgJG1ldGFkYXRhID0gJG1ldGFkYXRhXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlVGFnKHRhZykge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gJG1ldGFkYXRhLnRhZ3MuaW5kZXhPZih0YWcpO1xyXG4gICAgICAgICRtZXRhZGF0YS50YWdzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgJG1ldGFkYXRhID0gJG1ldGFkYXRhXHJcbiAgICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdiBpZD1cIndvcmtmbG93TWFuYWdlclwiIGNsYXNzPVwid29ya2Zsb3dNYW5hZ2VyXCIgc3R5bGU9XCJsZWZ0OiB7bGVmdH1weDsgdG9wOiB7dG9wfXB4O1wiPlxyXG4gIDxkaXYgY2xhc3M9XCJtaW5pTWVudVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW92ZUljb25cIj5cclxuICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJtb3ZlXCIgb246bW91c2Vkb3duPXtvbk1vdXNlRG93bn0+PC9JY29uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgeyNpZiAhbmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiR3lyZVwiIGNsYXNzPVwiZ3lyZUxvZ29cIj48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2tcIj5HeXJlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2tcIj57bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrXCIgY2xhc3M9XCJzYXZlSWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwic2F2ZVwiIG9uOmNsaWNrPXsoZSkgPT4ge3NhdmVXb3JrZmxvdygpfX0gPjwvSWNvbj4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICB7I2lmICFmb2xkT3V0fVxyXG4gICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9sZG91dFwiIG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19PlxyXG4gICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImRvd25cIj48L0ljb24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZm9sZE91dH1cclxuIFxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvbGRvdXRcIiBvbjpjbGljaz17KGUpID0+IHtmb2xkT3V0PWZhbHNlfX0+XHJcbiAgICAgICAgICAgIDxJY29uIG5hbWU9XCJ1cFwiPjwvSWNvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWFpblwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0TWVudVwiPlxyXG4gICAgICAgICAgICB7I2tleSBzdGF0ZX1cclxuICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJsaXN0XCIge3N0YXRlfSBvbjpjbGljaz17IChlKSA9PiAge3N0YXRlPVwibGlzdFwiIH19ID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YSAmJiAkbWV0YWRhdGEubGFzdE1vZGlmaWVkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJwcm9wZXJ0aWVzXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7c3RhdGU9XCJwcm9wZXJ0aWVzXCIgfX0gID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImVkaXRGb3JtXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7c3RhdGU9XCJlZGl0Rm9ybVwiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJlZGl0UnVsZXNcIiB7c3RhdGV9IG9uOmNsaWNrPXthc3luYyAoZSkgPT4gIHtzdGF0ZT1cImVkaXRSdWxlc1wiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJwcm9wZXJ0aWVzXCIgZGVhY3RpdmF0ZT1cImRlYWN0aXZhdGVcIiAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZWRpdEZvcm1cIiAgIGRlYWN0aXZhdGU9XCJkZWFjdGl2YXRlXCIgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZWRpdFJ1bGVzXCIgICBkZWFjdGl2YXRlPVwiZGVhY3RpdmF0ZVwiPjwvSWNvbj4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7L2tleX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG5cclxuICAgICAgICAgICAgeyNpZiBzdGF0ZSA9PT0gXCJwcm9wZXJ0aWVzXCJ9XHJcbiAgICAgICAgICAgICAgICA8aDE+V29ya2Zsb3cgUHJvcGVydGllczwvaDE+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBiaW5kOnZhbHVlPXtuYW1lfSBjbGFzcz1cInRleHRfaW5wdXRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdlZGl0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+Q2xpY2sgb24gYSBUYWcgdG8gcmVtb3ZlIGl0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEudGFnc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2VhY2ggJG1ldGFkYXRhLnRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdcIiBvbjpjbGljaz17KGUpID0+IHtyZW1vdmVUYWcodGFnKX19Pnt0YWd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInRhZ3NlbGVjdFwiIGJpbmQ6dmFsdWU9e3NlbGVjdGVkVGFnfSBvbjpjaGFuZ2U9eyhlKSA9PiB7YWRkVGFnKCl9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZCB2YWx1ZT1cIlwiPkFkZCBUYWcuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEudGFncyAmJiAhJG1ldGFkYXRhLnRhZ3MuaW5jbHVkZXModGFnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwie3RhZ31cIj57dGFnfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsjaWYgc3RhdGUgPT09IFwiZWRpdEZvcm1cIn1cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHhcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxGb3JtQnVpbGRlcj48L0Zvcm1CdWlsZGVyPlxyXG4gICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcImVkaXRSdWxlc1wifVxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEuZm9ybXMgJiYgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQgJiYgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQuZWxlbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgPFJ1bGVFZGl0b3I+PC9SdWxlRWRpdG9yPlxyXG4gICAgICAgICAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgIFBsZWFzZSBkZWZpbmUgYSBmb3JtIGZpcnN0XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcImxpc3RcIn1cclxuICAgICAgICAgICAgICAgIDxoMT5Xb3JrZmxvdyBMaXN0PC9oMT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOmNsaWNrPXsgKGUpID0+IHsgYWN0aXZhdGVkVGFnc1t0YWddPSFhY3RpdmF0ZWRUYWdzW3RhZ107JHdvcmtmbG93TGlzdD0kd29ya2Zsb3dMaXN0fX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOm9uPXthY3RpdmF0ZWRUYWdzW3RhZ119Pnt0YWd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7I2lmIHdvcmtmbG93TGlzdH1cclxuICAgICAgICAgICAgICAgICAgICB7I2VhY2ggJHdvcmtmbG93TGlzdCBhcyB3b3JrZmxvd31cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiBpc1Zpc2libGUod29ya2Zsb3cpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3b3JrZmxvd0VudHJ5XCIgb246Y2xpY2s9e2xvYWRXb3JrZmxvdyh3b3JrZmxvdyl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt3b3JrZmxvdy5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYXN0X2NoYW5nZWRcIj57d29ya2Zsb3cubGFzdE1vZGlmaWVkUmVhZGFibGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiB3b3JrZmxvdy5neXJlICYmIHdvcmtmbG93Lmd5cmUudGFnc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjZWFjaCB3b3JrZmxvdy5neXJlLnRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdcIj57dGFnfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuXHJcbiAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIHsvaWZ9IDwhLS0gZm9sZE91dCAtLT5cclxuPC9kaXY+XHJcbjxzdmVsdGU6d2luZG93IG9uOm1vdXNldXA9e29uTW91c2VVcH0gb246bW91c2Vtb3ZlPXtvbk1vdXNlTW92ZX0vPlxyXG5cclxuPHN0eWxlPlxyXG4gICAgQGltcG9ydCAnZGlzdC9idWlsZC9neXJlc3R5bGVzLmNzcyc7XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWtZSSxRQUFRLDJCQUEyQiJ9 */");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    // (276:16) {:else}
    function create_else_block_2(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { name: "save" }, $$inline: true });
    	icon.$on("click", /*click_handler_2*/ ctx[21]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(/*name*/ ctx[3]);
    			t1 = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			set_style(div0, "display", "inline-block");
    			add_location(div0, file, 277, 20, 9989);
    			set_style(div1, "display", "inline-block");
    			attr_dev(div1, "class", "saveIcon");
    			add_location(div1, file, 278, 20, 10090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(icon, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_1*/ ctx[20], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*name*/ 8) set_data_dev(t0, /*name*/ ctx[3]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(276:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (272:16) {#if !name}
    function create_if_block_13(ctx) {
    	let icon;
    	let t0;
    	let div;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { name: "Gyre", class: "gyreLogo" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t0 = space();
    			div = element("div");
    			div.textContent = "Gyre";
    			set_style(div, "display", "inline-block");
    			add_location(div, file, 274, 20, 9787);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[19], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(272:16) {#if !name}",
    		ctx
    	});

    	return block;
    }

    // (286:4) {#if !foldOut}
    function create_if_block_12(ctx) {
    	let div;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { name: "down" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "foldout");
    			add_location(div, file, 287, 12, 10444);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_3*/ ctx[22], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(286:4) {#if !foldOut}",
    		ctx
    	});

    	return block;
    }

    // (292:4) {#if foldOut}
    function create_if_block(ctx) {
    	let div0;
    	let icon;
    	let t0;
    	let div3;
    	let div1;
    	let previous_key = /*state*/ ctx[4];
    	let t1;
    	let div2;
    	let t2;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { name: "up" }, $$inline: true });
    	let key_block = create_key_block(ctx);
    	let if_block0 = /*state*/ ctx[4] === "properties" && create_if_block_8(ctx);
    	let if_block1 = /*state*/ ctx[4] === "editForm" && create_if_block_7(ctx);
    	let if_block2 = /*state*/ ctx[4] === "editRules" && create_if_block_5(ctx);
    	let if_block3 = /*state*/ ctx[4] === "list" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			key_block.c();
    			t1 = space();
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(div0, "class", "foldout");
    			add_location(div0, file, 294, 8, 10670);
    			attr_dev(div1, "class", "leftMenu");
    			add_location(div1, file, 298, 8, 10816);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file, 312, 8, 11680);
    			attr_dev(div3, "class", "main");
    			add_location(div3, file, 297, 8, 10788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(icon, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			key_block.m(div1, null);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block3) if_block3.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_4*/ ctx[23], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 16 && safe_not_equal(previous_key, previous_key = /*state*/ ctx[4])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(div1, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (/*state*/ ctx[4] === "properties") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(div2, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*state*/ ctx[4] === "editForm") {
    				if (if_block1) {
    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4] === "editRules") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, t4);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4] === "list") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1(ctx);
    					if_block3.c();
    					if_block3.m(div2, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(key_block);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(key_block);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(icon);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			key_block.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(292:4) {#if foldOut}",
    		ctx
    	});

    	return block;
    }

    // (306:16) {:else}
    function create_else_block_1(ctx) {
    	let icon0;
    	let t0;
    	let icon1;
    	let t1;
    	let icon2;
    	let current;

    	icon0 = new Icon({
    			props: {
    				name: "properties",
    				deactivate: "deactivate"
    			},
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				name: "editForm",
    				deactivate: "deactivate"
    			},
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: {
    				name: "editRules",
    				deactivate: "deactivate"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			create_component(icon1.$$.fragment);
    			t1 = space();
    			create_component(icon2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(icon1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(icon2, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(icon1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(icon2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(306:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (302:16) {#if $metadata && $metadata.lastModified}
    function create_if_block_11(ctx) {
    	let icon0;
    	let t0;
    	let icon1;
    	let t1;
    	let icon2;
    	let current;

    	icon0 = new Icon({
    			props: {
    				name: "properties",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon0.$on("click", /*click_handler_6*/ ctx[25]);

    	icon1 = new Icon({
    			props: {
    				name: "editForm",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon1.$on("click", /*click_handler_7*/ ctx[26]);

    	icon2 = new Icon({
    			props: {
    				name: "editRules",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon2.$on("click", /*click_handler_8*/ ctx[27]);

    	const block = {
    		c: function create() {
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			create_component(icon1.$$.fragment);
    			t1 = space();
    			create_component(icon2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(icon1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(icon2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon0_changes = {};
    			if (dirty[0] & /*state*/ 16) icon0_changes.state = /*state*/ ctx[4];
    			icon0.$set(icon0_changes);
    			const icon1_changes = {};
    			if (dirty[0] & /*state*/ 16) icon1_changes.state = /*state*/ ctx[4];
    			icon1.$set(icon1_changes);
    			const icon2_changes = {};
    			if (dirty[0] & /*state*/ 16) icon2_changes.state = /*state*/ ctx[4];
    			icon2.$set(icon2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(icon1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(icon2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(302:16) {#if $metadata && $metadata.lastModified}",
    		ctx
    	});

    	return block;
    }

    // (300:12) {#key state}
    function create_key_block(ctx) {
    	let icon;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	icon = new Icon({
    			props: { name: "list", state: /*state*/ ctx[4] },
    			$$inline: true
    		});

    	icon.$on("click", /*click_handler_5*/ ctx[24]);
    	const if_block_creators = [create_if_block_11, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$metadata*/ ctx[7] && /*$metadata*/ ctx[7].lastModified) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty[0] & /*state*/ 16) icon_changes.state = /*state*/ ctx[4];
    			icon.$set(icon_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(300:12) {#key state}",
    		ctx
    	});

    	return block;
    }

    // (315:12) {#if state === "properties"}
    function create_if_block_8(ctx) {
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let div2;
    	let div0;
    	let t4;
    	let div1;
    	let t5;
    	let select;
    	let option;
    	let mounted;
    	let dispose;
    	let if_block = /*$metadata*/ ctx[7].tags && create_if_block_10(ctx);
    	let each_value_3 = /*tags*/ ctx[9];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Workflow Properties";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Click on a Tag to remove it";
    			t4 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t5 = space();
    			select = element("select");
    			option = element("option");
    			option.textContent = "Add Tag...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file, 315, 16, 11763);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "text_input");
    			add_location(input, file, 316, 16, 11809);
    			attr_dev(div0, "class", "title");
    			add_location(div0, file, 318, 20, 11926);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 319, 20, 12000);
    			option.selected = true;
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file, 328, 24, 12531);
    			attr_dev(select, "class", "tagselect");
    			if (/*selectedTag*/ ctx[6] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[30].call(select));
    			add_location(select, file, 327, 20, 12424);
    			attr_dev(div2, "class", "tagedit");
    			add_location(div2, file, 317, 16, 11883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*name*/ ctx[3]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div2, t5);
    			append_dev(div2, select);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*selectedTag*/ ctx[6], true);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[28]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[30]),
    					listen_dev(select, "change", /*change_handler*/ ctx[31], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*name*/ 8 && input.value !== /*name*/ ctx[3]) {
    				set_input_value(input, /*name*/ ctx[3]);
    			}

    			if (/*$metadata*/ ctx[7].tags) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_10(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*tags, $metadata*/ 640) {
    				each_value_3 = /*tags*/ ctx[9];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*selectedTag, tags*/ 576) {
    				select_option(select, /*selectedTag*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(315:12) {#if state === \\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (321:24) {#if $metadata.tags}
    function create_if_block_10(ctx) {
    	let each_1_anchor;
    	let each_value_4 = /*$metadata*/ ctx[7].tags;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*removeTag, $metadata*/ 262272) {
    				each_value_4 = /*$metadata*/ ctx[7].tags;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(321:24) {#if $metadata.tags}",
    		ctx
    	});

    	return block;
    }

    // (323:28) {#each $metadata.tags as tag}
    function create_each_block_4(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[44] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_9(...args) {
    		return /*click_handler_9*/ ctx[29](/*tag*/ ctx[44], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 323, 32, 12243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_9, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$metadata*/ 128 && t_value !== (t_value = /*tag*/ ctx[44] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(323:28) {#each $metadata.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (331:28) {#if $metadata.tags && !$metadata.tags.includes(tag)}
    function create_if_block_9(ctx) {
    	let option;
    	let t_value = /*tag*/ ctx[44] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*tag*/ ctx[44];
    			option.value = option.__value;
    			add_location(option, file, 331, 32, 12738);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(331:28) {#if $metadata.tags && !$metadata.tags.includes(tag)}",
    		ctx
    	});

    	return block;
    }

    // (330:24) {#each tags as tag}
    function create_each_block_3(ctx) {
    	let show_if = /*$metadata*/ ctx[7].tags && !/*$metadata*/ ctx[7].tags.includes(/*tag*/ ctx[44]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 128) show_if = /*$metadata*/ ctx[7].tags && !/*$metadata*/ ctx[7].tags.includes(/*tag*/ ctx[44]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_9(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(330:24) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (338:12) {#if state === "editForm"}
    function create_if_block_7(ctx) {
    	let div;
    	let t;
    	let formbuilder;
    	let current;
    	formbuilder = new FormBuilder({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			create_component(formbuilder.$$.fragment);
    			set_style(div, "margin-top", "10px");
    			add_location(div, file, 338, 16, 12974);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(formbuilder, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formbuilder.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formbuilder.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			destroy_component(formbuilder, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(338:12) {#if state === \\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (342:12) {#if state === "editRules"}
    function create_if_block_5(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_6, create_else_block];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*$metadata*/ ctx[7].forms && /*$metadata*/ ctx[7].forms.default && /*$metadata*/ ctx[7].forms.default.elements) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "margin-top", "10px");
    			add_location(div, file, 342, 16, 13132);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(342:12) {#if state === \\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    // (346:16) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Please define a form first");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(346:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (344:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}
    function create_if_block_6(ctx) {
    	let ruleeditor;
    	let current;
    	ruleeditor = new RuleEditor({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ruleeditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ruleeditor, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ruleeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ruleeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ruleeditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(344:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}",
    		ctx
    	});

    	return block;
    }

    // (350:12) {#if state === "list"}
    function create_if_block_1(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let if_block_anchor;
    	let each_value_2 = /*tags*/ ctx[9];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let if_block = /*workflowList*/ ctx[10] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Workflow List";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(h1, file, 350, 16, 13485);
    			attr_dev(div, "class", "tags");
    			add_location(div, file, 351, 16, 13525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*activatedTags, tags, $workflowList*/ 800) {
    				each_value_2 = /*tags*/ ctx[9];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (/*workflowList*/ ctx[10]) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(350:12) {#if state === \\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (353:20) {#each tags as tag}
    function create_each_block_2(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[44] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_10(...args) {
    		return /*click_handler_10*/ ctx[32](/*tag*/ ctx[44], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[44]]);
    			add_location(div, file, 354, 24, 13692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_10, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*activatedTags, tags*/ 544) {
    				toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[44]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(353:20) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (360:16) {#if workflowList}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value = /*$workflowList*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*loadWorkflow, $workflowList, isVisible*/ 49408) {
    				each_value = /*$workflowList*/ ctx[8];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(360:16) {#if workflowList}",
    		ctx
    	});

    	return block;
    }

    // (362:24) {#if isVisible(workflow)}
    function create_if_block_3(ctx) {
    	let div2;
    	let t0_value = /*workflow*/ ctx[41].name + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2_value = /*workflow*/ ctx[41].lastModifiedReadable + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let mounted;
    	let dispose;
    	let if_block = /*workflow*/ ctx[41].gyre && /*workflow*/ ctx[41].gyre.tags && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t4 = space();
    			attr_dev(div0, "class", "last_changed");
    			add_location(div0, file, 365, 32, 14352);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 366, 32, 14449);
    			attr_dev(div2, "class", "workflowEntry");
    			add_location(div2, file, 363, 28, 14208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div2, t4);

    			if (!mounted) {
    				dispose = listen_dev(
    					div2,
    					"click",
    					function () {
    						if (is_function(/*loadWorkflow*/ ctx[15](/*workflow*/ ctx[41]))) /*loadWorkflow*/ ctx[15](/*workflow*/ ctx[41]).apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$workflowList*/ 256 && t0_value !== (t0_value = /*workflow*/ ctx[41].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*$workflowList*/ 256 && t2_value !== (t2_value = /*workflow*/ ctx[41].lastModifiedReadable + "")) set_data_dev(t2, t2_value);

    			if (/*workflow*/ ctx[41].gyre && /*workflow*/ ctx[41].gyre.tags) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(362:24) {#if isVisible(workflow)}",
    		ctx
    	});

    	return block;
    }

    // (368:36) {#if workflow.gyre && workflow.gyre.tags}
    function create_if_block_4(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*workflow*/ ctx[41].gyre.tags;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 256) {
    				each_value_1 = /*workflow*/ ctx[41].gyre.tags;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(368:36) {#if workflow.gyre && workflow.gyre.tags}",
    		ctx
    	});

    	return block;
    }

    // (369:40) {#each workflow.gyre.tags as tag}
    function create_each_block_1(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[44] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 369, 44, 14667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 256 && t_value !== (t_value = /*tag*/ ctx[44] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(369:40) {#each workflow.gyre.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (361:20) {#each $workflowList as workflow}
    function create_each_block(ctx) {
    	let show_if = /*isVisible*/ ctx[14](/*workflow*/ ctx[41]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 256) show_if = /*isVisible*/ ctx[14](/*workflow*/ ctx[41]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(361:20) {#each $workflowList as workflow}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let icon;
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block0;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { name: "move" }, $$inline: true });
    	icon.$on("mousedown", /*onMouseDown*/ ctx[11]);
    	const if_block_creators = [create_if_block_13, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*name*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = !/*foldOut*/ ctx[2] && create_if_block_12(ctx);
    	let if_block2 = /*foldOut*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "moveIcon");
    			add_location(div0, file, 266, 12, 9447);
    			attr_dev(div1, "class", "title");
    			add_location(div1, file, 269, 12, 9573);
    			attr_dev(div2, "class", "miniMenu");
    			add_location(div2, file, 265, 2, 9411);
    			attr_dev(div3, "id", "workflowManager");
    			attr_dev(div3, "class", "workflowManager");
    			set_style(div3, "left", /*left*/ ctx[0] + "px");
    			set_style(div3, "top", /*top*/ ctx[1] + "px");
    			add_location(div3, file, 264, 0, 9319);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(icon, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div3, t1);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t2);
    			if (if_block2) if_block2.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mouseup", /*onMouseUp*/ ctx[13], false, false, false, false),
    					listen_dev(window_1, "mousemove", /*onMouseMove*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div1, null);
    			}

    			if (!/*foldOut*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*foldOut*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_12(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*foldOut*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*foldOut*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*left*/ 1) {
    				set_style(div3, "left", /*left*/ ctx[0] + "px");
    			}

    			if (!current || dirty[0] & /*top*/ 2) {
    				set_style(div3, "top", /*top*/ ctx[1] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(icon);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fixDatesFromServer(result) {
    	let newel = result.map(el => {
    		let objjs = JSON.parse(el.json);
    		objjs.extra.gyre.lastModified = new Date(el.lastmodified * 1000).getTime();
    		let datestr = new Date(el.lastmodified * 1000).toISOString();
    		objjs.extra.gyre.lastModifiedReadable = datestr.split('T')[0] + " " + datestr.split('T')[1].replace(/\.[^/.]+$/, "");
    		let json = JSON.stringify(objjs);
    		return { ...el, json };
    	});

    	return newel;
    }

    async function updateFile(file_path, jsonData) {
    	try {
    		const response = await fetch("/workspace/update_json_file", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ file_path, json_str: jsonData })
    		});

    		const result = await response.text();
    		return result;
    	} catch(error) {
    		alert("Error saving workflow .json file: " + error);
    		console.error("Error saving workspace:", error);
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $metadata;
    	let $workflowList;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(7, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WorkflowManager', slots, []);
    	let allworkflows;
    	let moving = false;
    	let left = 10;
    	let top = 10;
    	let styleel;
    	let loadedworkflow;
    	let foldOut = false;
    	let name = ""; // current loaded workflow name
    	let state = "list";
    	let tags = ["Txt2Image", "Inpainting", "ControlNet", "LayerMenu", "Deactivated"];
    	let workflowList = writable([]); // todo:load all workflow basic data (name, last changed and gyre object) from server via server request
    	validate_store(workflowList, 'workflowList');
    	component_subscribe($$self, workflowList, value => $$invalidate(8, $workflowList = value));
    	let activatedTags = {};
    	let selectedTag = "";

    	function onMouseDown() {
    		moving = true;
    	}

    	function onMouseMove(e) {
    		if (moving) {
    			$$invalidate(0, left += e.movementX);
    			$$invalidate(1, top += e.movementY);
    		}
    	}

    	onMount(async () => {
    		await loadList();
    		addExternalLoadListener();
    	});

    	function addExternalLoadListener() {
    		const fileInput = document.getElementById("comfy-file-input");

    		const fileInputListener = async () => {
    			if (fileInput && fileInput.files && fileInput.files.length > 0) {
    				console.log(fileInput, fileInput.files);
    				new Date(fileInput.files[0].lastModified).toDateString();
    				let fixedfilename = getAvalableFileName(fileInput.files[0].name);
    				let graph = window.app.graph.serialize();
    				graph.name = fixedfilename;
    				graph.lastModified = fileInput.files[0].lastModified;
    				if (!graph.extra?.workspace_info) graph.extra.workspace_info = [];
    				graph.extra.workspace_info.name = fixedfilename;
    				graph.extra.workspace_info.lastModified = fileInput.files[0].lastModified;
    				graph.extra.workspace_info.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];

    				if (!graph.extra.gyre) {
    					graph.extra.gyre = {};
    				}

    				graph.extra.gyre.lastModified = fileInput.files[0].lastModified;
    				graph.extra.gyre.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];
    				loadedworkflow = graph;
    				loadWorkflow(graph);
    			}
    		};

    		fileInput?.addEventListener("change", fileInputListener);
    	}

    	function getAvalableFileName(name) {
    		if (!name) return 'new';
    		return name;
    	}

    	function onMouseUp() {
    		moving = false;
    	}

    	function isVisible(workflow) {
    		let mytags = workflow?.gyre?.tags || [];

    		for (let activeTag in activatedTags) {
    			if (activatedTags[activeTag] && !mytags.includes(activeTag)) return false;
    		}

    		return true;
    	}

    	async function loadList() {
    		// todo: make server request and read $metadata of all existing workflows on filesystem
    		let result = await scanLocalNewFiles();

    		let data_workflow_list = result.map(el => {
    			let res = { name: el.name };
    			let gyre = null;
    			if (el.json) gyre = JSON.parse(el.json).extra.gyre;
    			res.lastModifiedReadable = JSON.parse(el.json).extra.gyre?.lastModifiedReadable || "";

    			if (gyre) {
    				res.gyre = gyre;
    				res.gyre.lastModifiedReadable = JSON.parse(el.json).extra.gyre?.lastModifiedReadable || "";
    				res.gyre.lastModified = JSON.parse(el.json).extra.gyre?.lastModified || "";
    			}

    			return res;
    		});

    		console.log(data_workflow_list);
    		workflowList.set(data_workflow_list);
    	}

    	async function scanLocalNewFiles() {
    		let existFlowIds = [];

    		try {
    			const response = await fetch("/workspace/readworkflowdir", {
    				method: "POST",
    				headers: { "Content-Type": "application/json" },
    				body: JSON.stringify({ path: "", existFlowIds })
    			});

    			let result = await response.json();
    			result = fixDatesFromServer(result);
    			allworkflows = result;
    			return result;
    		} catch(error) {
    			console.error("Error scan local new files:", error);
    		}
    	}

    	async function loadWorkflow(workflow) {
    		await loadList();

    		// todo:check if current workflow is unsaved and make confirm otherwise
    		// 1. make server request by workflow.name, getting full workflow data here
    		// 2. update ComfyUI with new workflow
    		// 3. set name and $metadata here
    		if (!workflow.gyre) {
    			workflow.gyre = {};
    			workflow.gyre.tags = [];
    		}

    		console.log("load workflow!!");
    		$$invalidate(3, name = workflow.name);
    		set_store_value(metadata, $metadata = workflow.gyre, $metadata);

    		if (window.app.graph == null) {
    			console.error("app.graph is null cannot load workflow");
    			return;
    		}

    		let current = allworkflows.find(el => {
    			return el.name == workflow.name;
    		});

    		if (!loadedworkflow) {
    			if (!current) {
    				window.app.loadGraphData(workflow);
    			} else {
    				let wf = JSON.parse(current.json);
    				if (!wf.name && name) wf.name = name;
    				window.app.loadGraphData(wf);
    			}

    			$$invalidate(4, state = "properties");
    		}
    	}

    	async function saveWorkflow() {
    		console.log("saveWorkflow");
    		let graph = window.app.graph.serialize();

    		// this is scenario just after loading workflow and not save it
    		if (loadedworkflow && loadedworkflow.extra.workspace_info) {
    			graph.extra = loadedworkflow.extra;
    			set_store_value(metadata, $metadata = loadedworkflow.extra.gyre, $metadata);
    		}

    		loadedworkflow = null;
    		let file_path = graph.extra?.workspace_info?.name || "new.json";

    		if (name) {
    			file_path = name;
    		}

    		if (!file_path.endsWith('.json')) {
    			// Add .json extension if it doesn't exist
    			file_path += '.json';
    		}

    		if ($metadata && graph.extra) graph.extra.gyre = $metadata;
    		const graphJson = JSON.stringify(graph);
    		await updateFile(file_path, graphJson);

    		// todo:get workflow fom comfyUI
    		// $metadata should already point to extras.gyre - so nothing to do here
    		// 1. make server request, with  name and full workflow, store it on filesystem there
    		// 2. set unsaved state to false
    		// 3. load list of all workflows again
    		alert("save workflow " + name); // remove

    		await loadList();
    	}

    	function addTag() {
    		if (!selectedTag) return;
    		if (!$metadata.tags) set_store_value(metadata, $metadata.tags = [], $metadata);
    		$metadata.tags.push(selectedTag);
    		metadata.set($metadata);
    	}

    	function removeTag(tag) {
    		const index = $metadata.tags.indexOf(tag);
    		$metadata.tags.splice(index, 1);
    		metadata.set($metadata);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<WorkflowManager> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(2, foldOut = true);
    	};

    	const click_handler_1 = e => {
    		$$invalidate(2, foldOut = true);
    	};

    	const click_handler_2 = e => {
    		saveWorkflow();
    	};

    	const click_handler_3 = e => {
    		$$invalidate(2, foldOut = true);
    	};

    	const click_handler_4 = e => {
    		$$invalidate(2, foldOut = false);
    	};

    	const click_handler_5 = e => {
    		$$invalidate(4, state = "list");
    	};

    	const click_handler_6 = async e => {
    		$$invalidate(4, state = "properties");
    	};

    	const click_handler_7 = async e => {
    		$$invalidate(4, state = "editForm");
    	};

    	const click_handler_8 = async e => {
    		$$invalidate(4, state = "editRules");
    	};

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(3, name);
    	}

    	const click_handler_9 = (tag, e) => {
    		removeTag(tag);
    	};

    	function select_change_handler() {
    		selectedTag = select_value(this);
    		$$invalidate(6, selectedTag);
    		$$invalidate(9, tags);
    	}

    	const change_handler = e => {
    		addTag();
    	};

    	const click_handler_10 = (tag, e) => {
    		$$invalidate(5, activatedTags[tag] = !activatedTags[tag], activatedTags);
    		workflowList.set($workflowList);
    	};

    	$$self.$capture_state = () => ({
    		FormBuilder,
    		RuleEditor,
    		writable,
    		onMount,
    		beforeUpdate,
    		get_all_dirty_from_scope,
    		metadata,
    		Icon,
    		tick,
    		allworkflows,
    		moving,
    		left,
    		top,
    		styleel,
    		loadedworkflow,
    		foldOut,
    		name,
    		state,
    		tags,
    		workflowList,
    		activatedTags,
    		selectedTag,
    		onMouseDown,
    		onMouseMove,
    		addExternalLoadListener,
    		getAvalableFileName,
    		onMouseUp,
    		isVisible,
    		loadList,
    		scanLocalNewFiles,
    		fixDatesFromServer,
    		loadWorkflow,
    		saveWorkflow,
    		updateFile,
    		addTag,
    		removeTag,
    		$metadata,
    		$workflowList
    	});

    	$$self.$inject_state = $$props => {
    		if ('allworkflows' in $$props) allworkflows = $$props.allworkflows;
    		if ('moving' in $$props) moving = $$props.moving;
    		if ('left' in $$props) $$invalidate(0, left = $$props.left);
    		if ('top' in $$props) $$invalidate(1, top = $$props.top);
    		if ('styleel' in $$props) styleel = $$props.styleel;
    		if ('loadedworkflow' in $$props) loadedworkflow = $$props.loadedworkflow;
    		if ('foldOut' in $$props) $$invalidate(2, foldOut = $$props.foldOut);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('state' in $$props) $$invalidate(4, state = $$props.state);
    		if ('tags' in $$props) $$invalidate(9, tags = $$props.tags);
    		if ('workflowList' in $$props) $$invalidate(10, workflowList = $$props.workflowList);
    		if ('activatedTags' in $$props) $$invalidate(5, activatedTags = $$props.activatedTags);
    		if ('selectedTag' in $$props) $$invalidate(6, selectedTag = $$props.selectedTag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		left,
    		top,
    		foldOut,
    		name,
    		state,
    		activatedTags,
    		selectedTag,
    		$metadata,
    		$workflowList,
    		tags,
    		workflowList,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		isVisible,
    		loadWorkflow,
    		saveWorkflow,
    		addTag,
    		removeTag,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		input_input_handler,
    		click_handler_9,
    		select_change_handler,
    		change_handler,
    		click_handler_10
    	];
    }

    class WorkflowManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css$1, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WorkflowManager",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    function add_css(target) {
    	append_styles(target, "svelte-1tky8bj", "@media(min-width: 640px){}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQXBwLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGltcG9ydCBGb3JtQnVpbGRlciBmcm9tIFwiLi9Gb3JtQnVpbGRlci5zdmVsdGVcIjtcclxuICBpbXBvcnQgV29ya2Zsb3dNYW5hZ2VyIGZyb20gXCIuL1dvcmtmbG93TWFuYWdlci5zdmVsdGVcIjtcclxuXHJcbjwvc2NyaXB0PlxyXG5cclxuPFdvcmtmbG93TWFuYWdlcj48L1dvcmtmbG93TWFuYWdlcj5cclxuXHJcbjxzdHlsZT5cclxuXHRtYWluIHtcclxuXHRcdHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHRcdHBhZGRpbmc6IDFlbTtcclxuXHRcdG1heC13aWR0aDogMjQwcHg7XHJcblx0XHRtYXJnaW46IDAgYXV0bztcclxuXHR9XHJcblxyXG5cdGgxIHtcclxuXHRcdGNvbG9yOiAjZmYzZTAwO1xyXG5cdFx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuXHRcdGZvbnQtc2l6ZTogNGVtO1xyXG5cdFx0Zm9udC13ZWlnaHQ6IDEwMDtcclxuXHR9XHJcblxyXG5cdEBtZWRpYSAobWluLXdpZHRoOiA2NDBweCkge1xyXG5cdFx0bWFpbiB7XHJcblx0XHRcdG1heC13aWR0aDogbm9uZTtcclxuXHRcdH1cclxuXHR9XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXVCQyxNQUFPLFlBQVksS0FBSyxDQUFFLENBSTFCIn0= */");
    }

    function create_fragment(ctx) {
    	let workflowmanager;
    	let current;
    	workflowmanager = new WorkflowManager({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(workflowmanager.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(workflowmanager, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(workflowmanager.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(workflowmanager.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(workflowmanager, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ FormBuilder, WorkflowManager });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
