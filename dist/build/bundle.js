
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
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

    let layer_image_preview="data:image/jpeg;base64,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";

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

    const metadata = writable({
        tags: [],
        forms: { default: {elements:[]}},
        rules: [],
        mappings: [],
        combo_values:{}
    });

    /* src\FormElement.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1$1 } = globals;
    const file$6 = "src\\FormElement.svelte";

    function add_css$7(target) {
    	append_styles(target, "svelte-1macg6c", ".svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{box-sizing:border-box}.element-preview.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{position:relative;margin-bottom:20px}.element-preview.svelte-1macg6c .editElementButton.svelte-1macg6c.svelte-1macg6c{display:none;position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;background-color:rgb(51, 51, 51);width:50px;text-align:center}.element-preview.svelte-1macg6c:hover .editElementButton.svelte-1macg6c.svelte-1macg6c{display:block}.element-preview.svelte-1macg6c select.svelte-1macg6c.svelte-1macg6c{margin-right:10px;background-color:black;color:white;padding:5px;display:inline-block;min-width:280px}.element-preview.svelte-1macg6c input.svelte-1macg6c.svelte-1macg6c,textarea.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{background:none;position:relative;display:inline-block;color:white;margin:0;min-width:280px}.textInput.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c,.textarea.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{width:280px}.element-preview.svelte-1macg6c label.svelte-1macg6c.svelte-1macg6c{min-width:110px;display:inline-block}.element-preview.svelte-1macg6c .checkboxLabel.svelte-1macg6c.svelte-1macg6c{vertical-align:5px}.element-preview.svelte-1macg6c .textarea_label.svelte-1macg6c.svelte-1macg6c{vertical-align:top}.element-preview.svelte-1macg6c .layer_image_label.svelte-1macg6c.svelte-1macg6c{vertical-align:60px}.element-preview.svelte-1macg6c .slider_label.svelte-1macg6c.svelte-1macg6c{vertical-align:10px}.element-properties.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{background-color:rgb(51, 51, 51);padding:10px;display:block;position:relative}.element-properties.svelte-1macg6c label.svelte-1macg6c.svelte-1macg6c{min-width:110px;display:inline-block}.element-properties.svelte-1macg6c input.svelte-1macg6c.svelte-1macg6c,textarea.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{background:none;position:relative;display:inline-block;color:white;margin:0}.formLine.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{display:block;margin-bottom:10px}.element-properties.svelte-1macg6c .formClose.svelte-1macg6c.svelte-1macg6c{position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;width:20px}.slidervalue.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{vertical-align:10px;margin-right:10px}.element-properties.svelte-1macg6c button.svelte-1macg6c.svelte-1macg6c{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:15px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.element-properties.svelte-1macg6c .delete.svelte-1macg6c.svelte-1macg6c{background-color:red;color:white}.checkbox-wrapper-3.svelte-1macg6c.svelte-1macg6c.svelte-1macg6c{display:inline-block}.checkbox-wrapper-3.svelte-1macg6c input[type=\"checkbox\"].svelte-1macg6c.svelte-1macg6c{visibility:hidden;display:none}.checkbox-wrapper-3.svelte-1macg6c .toggle.svelte-1macg6c.svelte-1macg6c{position:relative;display:block;width:40px;height:20px;cursor:pointer;-webkit-tap-highlight-color:transparent;transform:translate3d(0, 0, 0)}.checkbox-wrapper-3.svelte-1macg6c .toggle.svelte-1macg6c.svelte-1macg6c:before{content:\"\";position:relative;top:3px;left:3px;width:34px;height:14px;display:block;background:#9A9999;border-radius:8px;transition:background 0.2s ease}.checkbox-wrapper-3.svelte-1macg6c .toggle span.svelte-1macg6c.svelte-1macg6c{position:absolute;top:0;left:0;width:20px;height:20px;display:block;background:white;border-radius:10px;box-shadow:0 3px 8px rgba(154, 153, 153, 0.5);transition:all 0.2s ease}.checkbox-wrapper-3.svelte-1macg6c .toggle span.svelte-1macg6c.svelte-1macg6c:before{content:\"\";position:absolute;display:block;margin:-18px;width:56px;height:56px;background:rgba(79, 46, 220, 0.5);border-radius:50%;transform:scale(0);opacity:1;pointer-events:none}.checkbox-wrapper-3.svelte-1macg6c #cbx-3.svelte-1macg6c:checked+.toggle.svelte-1macg6c:before{background:rgb(227, 206, 116)}.checkbox-wrapper-3.svelte-1macg6c #cbx-3:checked+.toggle span.svelte-1macg6c.svelte-1macg6c{background:#cda600;transform:translateX(20px);transition:all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25), background 0.15s ease;box-shadow:0 3px 8px rgba(79, 46, 220, 0.2)}.checkbox-wrapper-3.svelte-1macg6c #cbx-3:checked+.toggle span.svelte-1macg6c.svelte-1macg6c:before{transform:scale(1);opacity:0;transition:all 0.4s ease}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUVsZW1lbnQuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtRWxlbWVudC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XHJcblxyXG5cclxuICAgIGV4cG9ydCBsZXQgZWxlbWVudDtcclxuICAgIGV4cG9ydCBsZXQgc2hvd1Byb3BlcnRpZXM9ZmFsc2VcclxuICAgIGltcG9ydCB7bGF5ZXJfaW1hZ2VfcHJldmlld30gZnJvbSBcIi4vaW1hZ2VzXCJcclxuICAgIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gXCIuL3N0b3Jlcy9tZXRhZGF0YVwiXHJcbiAgICBjb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpXHJcbiAgICBleHBvcnQgbGV0IHZhbHVlXHJcbiAgICBpZiAoZWxlbWVudC50eXBlPT09XCJzbGlkZXJcIikge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHZhbHVlPWVsZW1lbnQubWluXHJcbiAgICB9XHJcbiAgICAvLyBGdW5jdGlvbiB0byBpbW1lZGlhdGVseSB1cGRhdGUgdGhlIHBhcmVudCBjb21wb25lbnRcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUVsZW1lbnQodXBkYXRlZFByb3BzKSB7XHJcbiAgICAgICAgZWxlbWVudD17IC4uLmVsZW1lbnQsIC4uLnVwZGF0ZWRQcm9wcyB9XHJcbiAgICAgICAgZGlzcGF0Y2goJ3VwZGF0ZScsIGVsZW1lbnQpXHJcbiAgICAgICAgaWYgKGVsZW1lbnQudHlwZT09PVwic2xpZGVyXCIgfHwgZWxlbWVudC50eXBlPT09XCJudW1iZXJcIikgdmFsdWU9ZWxlbWVudC5kZWZhdWx0XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRnVuY3Rpb24gdG8gaGFuZGxlIG9wdGlvbiB1cGRhdGVzIGZvciBkcm9wZG93bnNcclxuICAgIGZ1bmN0aW9uIGhhbmRsZU9wdGlvbkNoYW5nZShldmVudCwgaW5kZXgsIGtleSkge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRPcHRpb25zID0gWy4uLmVsZW1lbnQub3B0aW9uc11cclxuICAgICAgICB1cGRhdGVkT3B0aW9uc1tpbmRleF1ba2V5XSA9IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgICAgIHVwZGF0ZUVsZW1lbnQoeyBvcHRpb25zOiB1cGRhdGVkT3B0aW9ucyB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBhIG5ldyBvcHRpb24gdG8gdGhlIGRyb3Bkb3duXHJcbiAgICBmdW5jdGlvbiBhZGRPcHRpb24oKSB7XHJcbiAgICAgICAgdXBkYXRlRWxlbWVudCh7IG9wdGlvbnM6IFsuLi5lbGVtZW50Lm9wdGlvbnMsIHsgdGV4dDogJycsIGtleTogJycgfV0gfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgYW4gb3B0aW9uIGZyb20gdGhlIGRyb3Bkb3duXHJcbiAgICBmdW5jdGlvbiByZW1vdmVPcHRpb24oaW5kZXgpIHtcclxuICAgICAgICBjb25zdCB1cGRhdGVkT3B0aW9ucyA9IGVsZW1lbnQub3B0aW9ucy5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KVxyXG4gICAgICAgIHVwZGF0ZUVsZW1lbnQoeyBvcHRpb25zOiB1cGRhdGVkT3B0aW9ucyB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9wZW5Qcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgIGRpc3BhdGNoKCdvcGVuUHJvcGVydGllcycse30pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjbG9zZVByb3BlcnRpZXMoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goJ2Nsb3NlUHJvcGVydGllcycse30pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkZWxldGVFbGVtZW50KCkge1xyXG4gICAgICAgIGRpc3BhdGNoKFwiZGVsZXRlXCIse30pXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VWYWx1ZShuZXdWYWx1ZSkge1xyXG4gICAgICAgIHZhbHVlPW5ld1ZhbHVlXHJcbiAgICAgICAgZGlzcGF0Y2goXCJjaGFuZ2VcIix7dmFsdWU6dmFsdWV9KVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGxldCBhZHZhbmNlZE9wdGlvbnM9dHJ1ZVxyXG48L3NjcmlwdD5cclxuXHJcbjxkaXYgY2xhc3M9XCJlbGVtZW50LXByZXZpZXdcIj5cclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZWRpdEVsZW1lbnRCdXR0b25cIiBvbjpjbGljaz17b3BlblByb3BlcnRpZXN9PkVkaXQ8L2Rpdj5cclxuICAgIDwhLS0gRWxlbWVudCBwcmV2aWV3IGJhc2VkIG9uIHR5cGUgLS0+XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZT09PVwiYWR2YW5jZWRfb3B0aW9uc1wifSBcclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1taXNzaW5nLWF0dHJpYnV0ZSAtLT5cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4geyBhZHZhbmNlZE9wdGlvbnM9IWFkdmFuY2VkT3B0aW9uczsgZGlzcGF0Y2goXCJyZWRyYXdBbGxcIix7fSkgfX0+U2hvdyBBZHZhbmNlZCBPcHRpb25zPC9idXR0b24+XHJcbiAgICB7L2lmfVxyXG5cclxuICAgIHsjaWYgZWxlbWVudC50eXBlPT09XCJsYXllcl9pbWFnZVwifSBcclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9IGNsYXNzPVwibGF5ZXJfaW1hZ2VfbGFiZWxcIj57ZWxlbWVudC5uYW1lfTo8L2xhYmVsPlxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxyXG4gICAgICAgIDxpbWcgbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgc3JjPVwie2xheWVyX2ltYWdlX3ByZXZpZXd9XCI+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGUgPT09ICd0ZXh0J31cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9PntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGV4dElucHV0XCIgcGxhY2Vob2xkZXI9XCJ7ZWxlbWVudC5wbGFjZWhvbGRlcn1cIiAge3ZhbHVlfSBvbjpjaGFuZ2U9e2UgPT4ge2NoYW5nZVZhbHVlKGUudGFyZ2V0LnZhbHVlKX19Lz5cclxuICAgIHs6ZWxzZSBpZiBlbGVtZW50LnR5cGUgPT09ICd0ZXh0YXJlYSd9XHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfSBjbGFzcz1cInRleHRhcmVhX2xhYmVsXCI+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwidGV4dGFyZWFcIiBwbGFjZWhvbGRlcj1cIntlbGVtZW50LnBsYWNlaG9sZGVyfVwiIG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIG9uOmNoYW5nZT17ZSA9PiB7Y2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpfX0+e3ZhbHVlfTwvdGV4dGFyZWE+XHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAnY2hlY2tib3gnfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJjaGVja2JveExhYmVsXCI+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcblxyXG4gICAgICA8IS0tIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt2YWx1ZX0gIG9uOmNoYW5nZT17ZSA9PiB7Y2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpfX0vPiB7ZWxlbWVudC5sYWJlbH0tLT4gIFxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hlY2tib3gtd3JhcHBlci0zXCI+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiY2J4LTNcIiAgY2hlY2tlZD17dmFsdWV9ICBvbjpjaGFuZ2U9e2UgPT4ge2NoYW5nZVZhbHVlKGUudGFyZ2V0LnZhbHVlKX19IC8+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cImNieC0zXCIgY2xhc3M9XCJ0b2dnbGVcIj48c3Bhbj48L3NwYW4+PC9sYWJlbD5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAnZHJvcGRvd24nfVxyXG4gICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIGNsYXNzPVwiZHJvcGRvd25cIiBvbjpjaGFuZ2U9e2UgPT4ge2NoYW5nZVZhbHVlKGUudGFyZ2V0LnZhbHVlKX19ID5cclxuICAgICAgICAgICAgeyNlYWNoIGVsZW1lbnQub3B0aW9ucyBhcyBvcHRpb259XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb24udmFsdWV9IHNlbGVjdGVkPXt2YWx1ZT09PW9wdGlvbi52YWx1ZX0+e29wdGlvbi50ZXh0fSA8L29wdGlvbj5cclxuICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ3ByZV9maWxsZWRfZHJvcGRvd24nfVxyXG4gICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICB7I2lmIGVsZW1lbnQud2lkZ2V0X25hbWUgJiYgJG1ldGFkYXRhLmNvbWJvX3ZhbHVlc1tlbGVtZW50LndpZGdldF9uYW1lXSB9XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwie2VsZW1lbnQubmFtZX1cIiBjbGFzcz1cImRyb3Bkb3duXCIgb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fT5cclxuICAgICAgICAgIHsjZWFjaCAkbWV0YWRhdGEuY29tYm9fdmFsdWVzW2VsZW1lbnQud2lkZ2V0X25hbWVdIGFzIHZ9XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt2fSAgc2VsZWN0ZWQ9e3ZhbHVlPT09dn0+e3Z9IDwvb3B0aW9uPlxyXG4gICAgICAgICAgICB7L2VhY2h9IFxyXG4gICAgICAgIDwvc2VsZWN0PiAgICAgIFxyXG4gICAgICAgIHs6ZWxzZSBpZiAhZWxlbWVudC53aWRnZXRfbmFtZX0gIFxyXG4gICAgICAgICAgICBTZWxlY3QgV2lkZ2V0XHJcbiAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICBXaWRnZXQge2VsZW1lbnQud2lkZ2V0X25hbWV9IG5vdCBmb3VuZC5cclxuICAgICAgICB7L2lmfVxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ3NsaWRlcid9XHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfSBjbGFzcz1cInNsaWRlcl9sYWJlbFwiPntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwic2xpZGVydmFsdWVcIj57dmFsdWV9PC9zcGFuPjxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2VsZW1lbnQubWlufSBtYXg9e2VsZW1lbnQubWF4fSBzdGVwPXtlbGVtZW50LnN0ZXB9IHt2YWx1ZX0gbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fS8+XHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAnbnVtYmVyJ31cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9PntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPXtlbGVtZW50Lm1pbn0gbWF4PXtlbGVtZW50Lm1heH0gc3RlcD17ZWxlbWVudC5zdGVwfSB7dmFsdWV9IG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIG9uOmNoYW5nZT17ZSA9PiB7Y2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpfX0vPlxyXG4gICAgey9pZn0gICAgXHJcbjwvZGl2PlxyXG57I2lmIHNob3dQcm9wZXJ0aWVzfVxyXG48ZGl2IGNsYXNzPVwiZWxlbWVudC1wcm9wZXJ0aWVzXCIgPlxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtQ2xvc2VcIiBvbjpjbGljaz17Y2xvc2VQcm9wZXJ0aWVzfT5YPC9kaXY+XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSAhPT0gJ2xheWVyX2ltYWdlJyAmJiAgZWxlbWVudC50eXBlIT09XCJhZHZhbmNlZF9vcHRpb25zXCJ9IFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibGFiZWxcIj5MYWJlbDo8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibGFiZWxcIiB2YWx1ZT17ZWxlbWVudC5sYWJlbH0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgbGFiZWw6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm5hbWVcIj4gTmFtZTogPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAgdmFsdWU9e2VsZW1lbnQubmFtZX0gb246Y2hhbmdlPXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pIH0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJkZWZhdWx0XCI+IERlZmF1bHQgdmFsdWU6IDwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImRlZmF1bHRcIiB2YWx1ZT17ZWxlbWVudC5kZWZhdWx0fSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBkZWZhdWx0OiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj4gICAgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwiaGlkZGVuXCI+SGlkZGVuOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImhpZGRlblwiIGJpbmQ6Y2hlY2tlZD17ZWxlbWVudC5oaWRkZW59ICAvPiBIaWRlIElucHV0IGluIGZvcm1cclxuICAgICAgICA8L2Rpdj4gICAgICAgXHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGUgPT09ICd0ZXh0JyB8fCBlbGVtZW50LnR5cGUgPT09ICd0ZXh0YXJlYSd9XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwicGxhY2Vob2xkZXJcIj4gUGxhY2Vob2xkZXI6IDwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInBsYWNlaG9sZGVyXCIgdmFsdWU9e2VsZW1lbnQucGxhY2Vob2xkZXJ9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IHBsYWNlaG9sZGVyOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj4gIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnbGF5ZXJfaW1hZ2UnIH1cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJuYW1lXCI+IE5hbWU6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e2VsZW1lbnQubmFtZX0gb246Y2hhbmdlPXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cImZyb21fc2VsZWN0aW9uXCI+UGl4ZWwgRGF0YTogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJmcm9tX3NlbGVjdGlvblwiIGJpbmQ6Y2hlY2tlZD17ZWxlbWVudC5mcm9tX3NlbGVjdGlvbn0gIC8+IEZyb20gU2VsZWN0aW9uXHJcbiAgICAgICAgPC9kaXY+ICAgICAgXHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGUgPT09ICdkcm9wZG93bid9XHJcbiAgICAgICAgeyNlYWNoIGVsZW1lbnQub3B0aW9ucyBhcyBvcHRpb24sIGluZGV4fVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0ZXh0XCI+T3B0aW9uIFRleHQ6PC9sYWJlbD4gPGlucHV0IG5hbWU9XCJ0ZXh0XCIgdHlwZT1cInRleHRcIiB2YWx1ZT17b3B0aW9uLnRleHR9IG9uOmlucHV0PXsoZSkgPT4gaGFuZGxlT3B0aW9uQ2hhbmdlKGUsIGluZGV4LCAndGV4dCcpfSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwia2V5XCI+T3B0aW9uIFZhbHVlOjwvbGFiZWw+IDxpbnB1dCBuYW1lPVwidmFsdWVcIiB0eXBlPVwidGV4dFwiIHZhbHVlPXtvcHRpb24udmFsdWV9IG9uOmlucHV0PXsoZSkgPT4gaGFuZGxlT3B0aW9uQ2hhbmdlKGUsIGluZGV4LCAndmFsdWUnKX0gLz5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gb246Y2xpY2s9eygpID0+IHJlbW92ZU9wdGlvbihpbmRleCl9PlJlbW92ZSBPcHRpb248L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgey9lYWNofVxyXG4gICAgICAgIDxidXR0b24gb246Y2xpY2s9e2FkZE9wdGlvbn0+QWRkIE9wdGlvbjwvYnV0dG9uPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAncHJlX2ZpbGxlZF9kcm9wZG93bid9XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwid2lkZ2V0X25hbWVcIj4gQ29tYm8gV2lkZ2V0OiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8c2VsZWN0ICBuYW1lPVwid2lkZ2V0X25hbWVcIiAgb246Y2hhbmdlPXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IHdpZGdldF9uYW1lOiBlLnRhcmdldC52YWx1ZSB9KX0gYmluZDp2YWx1ZT17ZWxlbWVudC53aWRnZXRfbmFtZX0gID5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24+U2VsZWN0Li4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YS5jb21ib192YWx1ZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgeyNlYWNoIE9iamVjdC5lbnRyaWVzKCRtZXRhZGF0YS5jb21ib192YWx1ZXMpIGFzIFt3aWRnZXRfbmFtZSx2YWx1ZXNdfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt3aWRnZXRfbmFtZX0+e3dpZGdldF9uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgPC9kaXY+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGUgPT09ICdzbGlkZXInIHx8IGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcid9XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJtaW5cIj4gTWluOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cIm1pblwiIHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17ZWxlbWVudC5taW59IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG1pbjogZS50YXJnZXQudmFsdWUgfSl9IC8+ICBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJtYXhcIj4gTWF4OjwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwibWF4XCIgdHlwZT1cIm51bWJlclwiIHZhbHVlPXtlbGVtZW50Lm1heH0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgbWF4OiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj4gXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzdGVwXCI+IFN0ZXA6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwic3RlcFwiIHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17ZWxlbWVudC5zdGVwfSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBzdGVwOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgIDwvZGl2PlxyXG4gICAgey9pZn1cclxuICAgIDxkaXY+PGJ1dHRvbiBvbjpjbGljaz17KCkgPT4gZGVsZXRlRWxlbWVudCgpfSBjbGFzcz1cImRlbGV0ZVwiPkRlbGV0ZTwvYnV0dG9uPjwvZGl2PlxyXG5cclxuPC9kaXY+XHJcbnsvaWZ9XHJcblxyXG48c3R5bGU+XHJcbiAgICAqIHtcclxuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG5cclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcge1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyAuZWRpdEVsZW1lbnRCdXR0b24ge1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIHJpZ2h0OjBweDtcclxuICAgICAgICB0b3A6IDBweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgcGFkZGluZzogNXB4O1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1MSwgNTEsIDUxKTtcclxuICAgICAgICB3aWR0aDo1MHB4O1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIH1cclxuXHJcbiAgICAuZWxlbWVudC1wcmV2aWV3OmhvdmVyIC5lZGl0RWxlbWVudEJ1dHRvbiB7XHJcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IHNlbGVjdCB7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICBwYWRkaW5nOiA1cHg7ICAgXHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIG1pbi13aWR0aDogMjgwcHg7XHJcblxyXG4gIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgaW5wdXQsdGV4dGFyZWEge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICBjb2xvcjp3aGl0ZTtcclxuICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgbWluLXdpZHRoOiAyODBweDtcclxuICAgIH1cclxuICAgIC50ZXh0SW5wdXQsLnRleHRhcmVhIHtcclxuICAgICAgICB3aWR0aDogMjgwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IGxhYmVsIHtcclxuICAgICAgICBtaW4td2lkdGg6IDExMHB4O1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLmNoZWNrYm94TGFiZWwge1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiA1cHg7XHJcblxyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyAudGV4dGFyZWFfbGFiZWwge1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IC5sYXllcl9pbWFnZV9sYWJlbCB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IDYwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IC5zbGlkZXJfbGFiZWwge1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiAxMHB4O1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDUxLCA1MSwgNTEpO1xyXG4gICAgICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICAgICAgZGlzcGxheTpibG9jaztcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyBsYWJlbCB7XHJcbiAgICAgICAgbWluLXdpZHRoOiAxMTBweDtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIGlucHV0LHRleHRhcmVhIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY29sb3I6d2hpdGU7XHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfSAgICBcclxuICAgIC5mb3JtTGluZSB7XHJcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMgLmZvcm1DbG9zZSB7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIHJpZ2h0OjBweDtcclxuICAgICAgICB0b3A6IDBweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgcGFkZGluZzogNXB4O1xyXG4gICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgfSAgICBcclxuIFxyXG4gICAgLnNsaWRlcnZhbHVlIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogMTBweDtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9IFxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyBidXR0b24ge1xyXG4gICAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICBtaW4td2lkdGg6IDcwcHg7XHJcbiAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMjcsIDIwNiwgMTE2KTtcclxuICAgICAgICBib3JkZXItY29sb3I6IHJnYigxMjgsIDEyOCwgMTI4KTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgIH1cclxuXHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIC5kZWxldGUge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB9ICAgICAgIFxyXG4vKiBjaGVja2JveCAqL1xyXG4uY2hlY2tib3gtd3JhcHBlci0zIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufSAuY2hlY2tib3gtd3JhcHBlci0zIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXSB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gIH1cclxuXHJcbiAgLmNoZWNrYm94LXdyYXBwZXItMyAudG9nZ2xlIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgd2lkdGg6IDQwcHg7XHJcbiAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcclxuICB9XHJcbiAgLmNoZWNrYm94LXdyYXBwZXItMyAudG9nZ2xlOmJlZm9yZSB7XHJcbiAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgdG9wOiAzcHg7XHJcbiAgICBsZWZ0OiAzcHg7XHJcbiAgICB3aWR0aDogMzRweDtcclxuICAgIGhlaWdodDogMTRweDtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgYmFja2dyb3VuZDogIzlBOTk5OTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycyBlYXNlO1xyXG4gIH1cclxuICAuY2hlY2tib3gtd3JhcHBlci0zIC50b2dnbGUgc3BhbiB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgd2lkdGg6IDIwcHg7XHJcbiAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgIGJveC1zaGFkb3c6IDAgM3B4IDhweCByZ2JhKDE1NCwgMTUzLCAxNTMsIDAuNSk7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xyXG4gIH1cclxuICAuY2hlY2tib3gtd3JhcHBlci0zIC50b2dnbGUgc3BhbjpiZWZvcmUge1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgbWFyZ2luOiAtMThweDtcclxuICAgIHdpZHRoOiA1NnB4O1xyXG4gICAgaGVpZ2h0OiA1NnB4O1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSg3OSwgNDYsIDIyMCwgMC41KTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAuY2hlY2tib3gtd3JhcHBlci0zICNjYngtMzpjaGVja2VkICsgLnRvZ2dsZTpiZWZvcmUge1xyXG4gICAgYmFja2dyb3VuZDogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gIH1cclxuICAuY2hlY2tib3gtd3JhcHBlci0zICNjYngtMzpjaGVja2VkICsgLnRvZ2dsZSBzcGFuIHtcclxuICAgIGJhY2tncm91bmQ6ICNjZGE2MDA7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMjBweCk7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBjdWJpYy1iZXppZXIoMC44LCAwLjQsIDAuMywgMS4yNSksIGJhY2tncm91bmQgMC4xNXMgZWFzZTtcclxuICAgIGJveC1zaGFkb3c6IDAgM3B4IDhweCByZ2JhKDc5LCA0NiwgMjIwLCAwLjIpO1xyXG4gIH1cclxuICAuY2hlY2tib3gtd3JhcHBlci0zICNjYngtMzpjaGVja2VkICsgLnRvZ2dsZSBzcGFuOmJlZm9yZSB7XHJcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xyXG4gICAgb3BhY2l0eTogMDtcclxuICAgIHRyYW5zaXRpb246IGFsbCAwLjRzIGVhc2U7XHJcbiAgfVxyXG5cclxuPC9zdHlsZT5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1NSSw2Q0FBRSxDQUNFLFVBQVUsQ0FBRSxVQUVoQixDQUNBLDZEQUFpQixDQUNiLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLGFBQWEsQ0FBRSxJQUNuQixDQUNBLCtCQUFnQixDQUFDLGdEQUFtQixDQUNoQyxPQUFPLENBQUUsSUFBSSxDQUNiLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE1BQU0sR0FBRyxDQUNULEdBQUcsQ0FBRSxHQUFHLENBQ1IsTUFBTSxDQUFFLE9BQU8sQ0FDZixPQUFPLENBQUUsR0FBRyxDQUNaLGdCQUFnQixDQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ2pDLE1BQU0sSUFBSSxDQUNWLFVBQVUsQ0FBRSxNQUNoQixDQUVBLCtCQUFnQixNQUFNLENBQUMsZ0RBQW1CLENBQ3RDLE9BQU8sQ0FBRSxLQUNiLENBQ0EsK0JBQWdCLENBQUMsb0NBQU8sQ0FDcEIsWUFBWSxDQUFFLElBQUksQ0FDbEIsZ0JBQWdCLENBQUUsS0FBSyxDQUN2QixLQUFL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 */");
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i][0];
    	child_ctx[39] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	child_ctx[44] = i;
    	return child_ctx;
    }

    function get_each_context_3$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    // (59:4) {#if element.type==="advanced_options"}
    function create_if_block_18(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Show Advanced Options";
    			attr_dev(button, "class", "svelte-1macg6c");
    			add_location(button, file$6, 60, 8, 2031);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[14], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(59:4) {#if element.type===\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (64:4) {#if element.type==="layer_image"}
    function create_if_block_17(ctx) {
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
    			attr_dev(label, "class", "layer_image_label svelte-1macg6c");
    			add_location(label, file$6, 64, 8, 2214);
    			attr_dev(img, "name", img_name_value = /*element*/ ctx[0].name);
    			if (!src_url_equal(img.src, img_src_value = layer_image_preview)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1macg6c");
    			add_location(img, file$6, 66, 8, 2354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && img_name_value !== (img_name_value = /*element*/ ctx[0].name)) {
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
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(64:4) {#if element.type===\\\"layer_image\\\"}",
    		ctx
    	});

    	return block;
    }

    // (108:40) 
    function create_if_block_16(ctx) {
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
    	let input_name_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1macg6c");
    			add_location(label, file$6, 108, 8, 4842);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = /*value*/ ctx[1];
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-1macg6c");
    			add_location(input, file$6, 109, 8, 4902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler_6*/ ctx[21], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(input, "name", input_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(108:40) ",
    		ctx
    	});

    	return block;
    }

    // (105:40) 
    function create_if_block_15(ctx) {
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
    			t3 = text(/*value*/ ctx[1]);
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "slider_label svelte-1macg6c");
    			add_location(label, file$6, 105, 8, 4515);
    			attr_dev(span, "class", "slidervalue svelte-1macg6c");
    			add_location(span, file$6, 106, 8, 4596);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = /*value*/ ctx[1];
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-1macg6c");
    			add_location(input, file$6, 106, 48, 4636);
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
    				dispose = listen_dev(input, "change", /*change_handler_5*/ ctx[20], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*value*/ 2) set_data_dev(t3, /*value*/ ctx[1]);

    			if (dirty[0] & /*element, $metadata*/ 17 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
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
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(105:40) ",
    		ctx
    	});

    	return block;
    }

    // (92:53) 
    function create_if_block_12$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*element*/ ctx[0].widget_name && /*$metadata*/ ctx[4].combo_values[/*element*/ ctx[0].widget_name]) return create_if_block_13$1;
    		if (!/*element*/ ctx[0].widget_name) return create_if_block_14;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1macg6c");
    			add_location(label, file$6, 92, 4, 3885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$2.name,
    		type: "if",
    		source: "(92:53) ",
    		ctx
    	});

    	return block;
    }

    // (85:42) 
    function create_if_block_11$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let select;
    	let select_name_value;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*element*/ ctx[0].options;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$3(get_each_context_2$3(ctx, each_value_2, i));
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
    			attr_dev(label, "class", "svelte-1macg6c");
    			add_location(label, file$6, 85, 4, 3480);
    			attr_dev(select, "name", select_name_value = /*element*/ ctx[0].name);
    			attr_dev(select, "class", "dropdown svelte-1macg6c");
    			add_location(select, file$6, 86, 8, 3540);
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

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*change_handler_3*/ ctx[18], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, value*/ 3) {
    				each_value_2 = /*element*/ ctx[0].options;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$3(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && select_name_value !== (select_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(select, "name", select_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$2.name,
    		type: "if",
    		source: "(85:42) ",
    		ctx
    	});

    	return block;
    }

    // (75:42) 
    function create_if_block_10$2(ctx) {
    	let label0;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label0_for_value;
    	let t2;
    	let div;
    	let input;
    	let t3;
    	let label1;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label0 = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			div = element("div");
    			input = element("input");
    			t3 = space();
    			label1 = element("label");
    			span = element("span");
    			attr_dev(label0, "for", label0_for_value = /*element*/ ctx[0].name);
    			attr_dev(label0, "class", "checkboxLabel svelte-1macg6c");
    			add_location(label0, file$6, 75, 8, 2996);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "cbx-3");
    			input.checked = /*value*/ ctx[1];
    			attr_dev(input, "class", "svelte-1macg6c");
    			add_location(input, file$6, 80, 8, 3246);
    			attr_dev(span, "class", "svelte-1macg6c");
    			add_location(span, file$6, 81, 42, 3391);
    			attr_dev(label1, "for", "cbx-3");
    			attr_dev(label1, "class", "toggle svelte-1macg6c");
    			add_location(label1, file$6, 81, 8, 3357);
    			attr_dev(div, "class", "checkbox-wrapper-3 svelte-1macg6c");
    			add_location(div, file$6, 79, 8, 3204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label0, anchor);
    			append_dev(label0, t0);
    			append_dev(label0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, t3);
    			append_dev(div, label1);
    			append_dev(label1, span);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler_2*/ ctx[17], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label0_for_value !== (label0_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label0, "for", label0_for_value);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(input, "checked", /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$2.name,
    		type: "if",
    		source: "(75:42) ",
    		ctx
    	});

    	return block;
    }

    // (72:42) 
    function create_if_block_9$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let textarea;
    	let textarea_placeholder_value;
    	let textarea_name_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			textarea = element("textarea");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "textarea_label svelte-1macg6c");
    			add_location(label, file$6, 72, 8, 2709);
    			attr_dev(textarea, "class", "textarea svelte-1macg6c");
    			attr_dev(textarea, "placeholder", textarea_placeholder_value = /*element*/ ctx[0].placeholder);
    			attr_dev(textarea, "name", textarea_name_value = /*element*/ ctx[0].name);
    			textarea.value = /*value*/ ctx[1];
    			add_location(textarea, file$6, 73, 8, 2792);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, textarea, anchor);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "change", /*change_handler_1*/ ctx[16], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && textarea_placeholder_value !== (textarea_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(textarea, "placeholder", textarea_placeholder_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && textarea_name_value !== (textarea_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(textarea, "name", textarea_name_value);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(textarea, "value", /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$2.name,
    		type: "if",
    		source: "(72:42) ",
    		ctx
    	});

    	return block;
    }

    // (69:4) {#if element.type === 'text'}
    function create_if_block_8$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let input;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "svelte-1macg6c");
    			add_location(label, file$6, 69, 8, 2465);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "textInput svelte-1macg6c");
    			attr_dev(input, "placeholder", input_placeholder_value = /*element*/ ctx[0].placeholder);
    			input.value = /*value*/ ctx[1];
    			add_location(input, file$6, 70, 8, 2525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[15], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_placeholder_value !== (input_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(69:4) {#if element.type === 'text'}",
    		ctx
    	});

    	return block;
    }

    // (102:8) {:else}
    function create_else_block$2(ctx) {
    	let t0;
    	let t1_value = /*element*/ ctx[0].widget_name + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text("Widget ");
    			t1 = text(t1_value);
    			t2 = text(" not found.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t1_value !== (t1_value = /*element*/ ctx[0].widget_name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(102:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:39) 
    function create_if_block_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Select Widget");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(100:39) ",
    		ctx
    	});

    	return block;
    }

    // (94:8) {#if element.widget_name && $metadata.combo_values[element.widget_name] }
    function create_if_block_13$1(ctx) {
    	let select;
    	let select_name_value;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*$metadata*/ ctx[4].combo_values[/*element*/ ctx[0].widget_name];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$3(get_each_context_3$3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "name", select_name_value = /*element*/ ctx[0].name);
    			attr_dev(select, "class", "dropdown svelte-1macg6c");
    			add_location(select, file$6, 94, 8, 4028);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*change_handler_4*/ ctx[19], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata, element, value*/ 19) {
    				each_value_3 = /*$metadata*/ ctx[4].combo_values[/*element*/ ctx[0].widget_name];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && select_name_value !== (select_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(select, "name", select_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$1.name,
    		type: "if",
    		source: "(94:8) {#if element.widget_name && $metadata.combo_values[element.widget_name] }",
    		ctx
    	});

    	return block;
    }

    // (96:10) {#each $metadata.combo_values[element.widget_name] as v}
    function create_each_block_3$3(ctx) {
    	let option;
    	let t0_value = /*v*/ ctx[47] + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*v*/ ctx[47];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*value*/ ctx[1] === /*v*/ ctx[47];
    			attr_dev(option, "class", "svelte-1macg6c");
    			add_location(option, file$6, 96, 16, 4208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata, element*/ 17 && t0_value !== (t0_value = /*v*/ ctx[47] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$metadata, element*/ 17 && option_value_value !== (option_value_value = /*v*/ ctx[47])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*value, $metadata, element*/ 19 && option_selected_value !== (option_selected_value = /*value*/ ctx[1] === /*v*/ ctx[47])) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$3.name,
    		type: "each",
    		source: "(96:10) {#each $metadata.combo_values[element.widget_name] as v}",
    		ctx
    	});

    	return block;
    }

    // (88:12) {#each element.options as option}
    function create_each_block_2$3(ctx) {
    	let option;
    	let t0_value = /*option*/ ctx[42].text + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*option*/ ctx[42].value;
    			option.value = option.__value;
    			option.selected = option_selected_value = /*value*/ ctx[1] === /*option*/ ctx[42].value;
    			attr_dev(option, "class", "svelte-1macg6c");
    			add_location(option, file$6, 88, 16, 3700);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*option*/ ctx[42].text + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && option_value_value !== (option_value_value = /*option*/ ctx[42].value)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*value, element, $metadata*/ 19 && option_selected_value !== (option_selected_value = /*value*/ ctx[1] === /*option*/ ctx[42].value)) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$3.name,
    		type: "each",
    		source: "(88:12) {#each element.options as option}",
    		ctx
    	});

    	return block;
    }

    // (113:0) {#if showProperties}
    function create_if_block$5(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let if_block0 = /*element*/ ctx[0].type !== 'layer_image' && /*element*/ ctx[0].type !== "advanced_options" && create_if_block_7$2(ctx);
    	let if_block1 = (/*element*/ ctx[0].type === 'text' || /*element*/ ctx[0].type === 'textarea') && create_if_block_6$2(ctx);
    	let if_block2 = /*element*/ ctx[0].type === 'layer_image' && create_if_block_5$2(ctx);
    	let if_block3 = /*element*/ ctx[0].type === 'dropdown' && create_if_block_4$2(ctx);
    	let if_block4 = /*element*/ ctx[0].type === 'pre_filled_dropdown' && create_if_block_2$3(ctx);
    	let if_block5 = (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') && create_if_block_1$4(ctx);

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
    			if (if_block5) if_block5.c();
    			t7 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(div0, "class", "formClose svelte-1macg6c");
    			add_location(div0, file$6, 115, 4, 5205);
    			attr_dev(button, "class", "delete svelte-1macg6c");
    			add_location(button, file$6, 189, 9, 9179);
    			attr_dev(div1, "class", "svelte-1macg6c");
    			add_location(div1, file$6, 189, 4, 9174);
    			attr_dev(div2, "class", "element-properties svelte-1macg6c");
    			add_location(div2, file$6, 113, 0, 5104);
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
    			if (if_block5) if_block5.m(div2, null);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*closeProperties*/ ctx[11], false, false, false, false),
    					listen_dev(button, "click", /*click_handler_2*/ ctx[37], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*element*/ ctx[0].type !== 'layer_image' && /*element*/ ctx[0].type !== "advanced_options") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7$2(ctx);
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
    					if_block1 = create_if_block_6$2(ctx);
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
    					if_block2 = create_if_block_5$2(ctx);
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
    					if_block3 = create_if_block_4$2(ctx);
    					if_block3.c();
    					if_block3.m(div2, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*element*/ ctx[0].type === 'pre_filled_dropdown') {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2$3(ctx);
    					if_block4.c();
    					if_block4.m(div2, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1$4(ctx);
    					if_block5.c();
    					if_block5.m(div2, t7);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(113:0) {#if showProperties}",
    		ctx
    	});

    	return block;
    }

    // (117:4) {#if element.type !== 'layer_image' &&  element.type!=="advanced_options"}
    function create_if_block_7$2(ctx) {
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
    			attr_dev(label0, "class", "svelte-1macg6c");
    			add_location(label0, file$6, 118, 12, 5389);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "label");
    			input0.value = input0_value_value = /*element*/ ctx[0].label;
    			attr_dev(input0, "class", "svelte-1macg6c");
    			add_location(input0, file$6, 119, 12, 5436);
    			attr_dev(div0, "class", "formLine svelte-1macg6c");
    			add_location(div0, file$6, 117, 8, 5353);
    			attr_dev(label1, "for", "name");
    			attr_dev(label1, "class", "svelte-1macg6c");
    			add_location(label1, file$6, 122, 12, 5613);
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*element*/ ctx[0].name;
    			attr_dev(input1, "class", "svelte-1macg6c");
    			add_location(input1, file$6, 123, 8, 5657);
    			attr_dev(div1, "class", "formLine svelte-1macg6c");
    			add_location(div1, file$6, 121, 8, 5577);
    			attr_dev(label2, "for", "default");
    			attr_dev(label2, "class", "svelte-1macg6c");
    			add_location(label2, file$6, 126, 12, 5822);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "default");
    			input2.value = input2_value_value = /*element*/ ctx[0].default;
    			attr_dev(input2, "class", "svelte-1macg6c");
    			add_location(input2, file$6, 127, 8, 5878);
    			attr_dev(div2, "class", "formLine svelte-1macg6c");
    			add_location(div2, file$6, 125, 8, 5786);
    			attr_dev(label3, "for", "hidden");
    			attr_dev(label3, "class", "svelte-1macg6c");
    			add_location(label3, file$6, 130, 12, 6065);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "name", "hidden");
    			attr_dev(input3, "class", "svelte-1macg6c");
    			add_location(input3, file$6, 131, 12, 6116);
    			attr_dev(div3, "class", "formLine svelte-1macg6c");
    			add_location(div3, file$6, 129, 8, 6029);
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
    					listen_dev(input0, "input", /*input_handler*/ ctx[22], false, false, false, false),
    					listen_dev(input1, "change", /*change_handler_7*/ ctx[23], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_1*/ ctx[24], false, false, false, false),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[25])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 17 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].label) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].name) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].default) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17) {
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
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(117:4) {#if element.type !== 'layer_image' &&  element.type!==\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (135:4) {#if element.type === 'text' || element.type === 'textarea'}
    function create_if_block_6$2(ctx) {
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
    			attr_dev(label, "class", "svelte-1macg6c");
    			add_location(label, file$6, 136, 12, 6351);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "placeholder");
    			input.value = input_value_value = /*element*/ ctx[0].placeholder;
    			attr_dev(input, "class", "svelte-1macg6c");
    			add_location(input, file$6, 137, 8, 6409);
    			attr_dev(div, "class", "formLine svelte-1macg6c");
    			add_location(div, file$6, 135, 8, 6315);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler_2*/ ctx[26], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 17 && input_value_value !== (input_value_value = /*element*/ ctx[0].placeholder) && input.value !== input_value_value) {
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
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(135:4) {#if element.type === 'text' || element.type === 'textarea'}",
    		ctx
    	});

    	return block;
    }

    // (141:4) {#if element.type === 'layer_image' }
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
    			attr_dev(label0, "class", "svelte-1macg6c");
    			add_location(label0, file$6, 142, 12, 6660);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			input0.value = input0_value_value = /*element*/ ctx[0].name;
    			attr_dev(input0, "class", "svelte-1macg6c");
    			add_location(input0, file$6, 143, 12, 6708);
    			attr_dev(div0, "class", "formLine svelte-1macg6c");
    			add_location(div0, file$6, 141, 8, 6624);
    			attr_dev(label1, "for", "from_selection");
    			attr_dev(label1, "class", "svelte-1macg6c");
    			add_location(label1, file$6, 146, 12, 6883);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "from_selection");
    			attr_dev(input1, "class", "svelte-1macg6c");
    			add_location(input1, file$6, 147, 12, 6946);
    			attr_dev(div1, "class", "formLine svelte-1macg6c");
    			add_location(div1, file$6, 145, 8, 6847);
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
    					listen_dev(input0, "change", /*change_handler_8*/ ctx[27], false, false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 17 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].name) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17) {
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
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(141:4) {#if element.type === 'layer_image' }",
    		ctx
    	});

    	return block;
    }

    // (151:4) {#if element.type === 'dropdown'}
    function create_if_block_4$2(ctx) {
    	let t0;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*element*/ ctx[0].options;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			button.textContent = "Add Option";
    			attr_dev(button, "class", "svelte-1macg6c");
    			add_location(button, file$6, 160, 8, 7726);
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
    				dispose = listen_dev(button, "click", /*addOption*/ ctx[8], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*removeOption, element, handleOptionChange*/ 641) {
    				each_value_1 = /*element*/ ctx[0].options;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
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
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(151:4) {#if element.type === 'dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (152:8) {#each element.options as option, index}
    function create_each_block_1$4(ctx) {
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
    		return /*input_handler_3*/ ctx[29](/*index*/ ctx[44], ...args);
    	}

    	function input_handler_4(...args) {
    		return /*input_handler_4*/ ctx[30](/*index*/ ctx[44], ...args);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[31](/*index*/ ctx[44]);
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
    			attr_dev(label0, "class", "svelte-1macg6c");
    			add_location(label0, file$6, 153, 16, 7223);
    			attr_dev(input0, "name", "text");
    			attr_dev(input0, "type", "text");
    			input0.value = input0_value_value = /*option*/ ctx[42].text;
    			attr_dev(input0, "class", "svelte-1macg6c");
    			add_location(input0, file$6, 153, 55, 7262);
    			attr_dev(div0, "class", "formLine svelte-1macg6c");
    			add_location(div0, file$6, 152, 12, 7183);
    			attr_dev(label1, "for", "key");
    			attr_dev(label1, "class", "svelte-1macg6c");
    			add_location(label1, file$6, 156, 16, 7444);
    			attr_dev(input1, "name", "value");
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*option*/ ctx[42].value;
    			attr_dev(input1, "class", "svelte-1macg6c");
    			add_location(input1, file$6, 156, 55, 7483);
    			attr_dev(button, "class", "svelte-1macg6c");
    			add_location(button, file$6, 157, 16, 7612);
    			attr_dev(div1, "class", "formLine svelte-1macg6c");
    			add_location(div1, file$6, 155, 12, 7404);
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
    					listen_dev(button, "click", click_handler_1, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*element, $metadata*/ 17 && input0_value_value !== (input0_value_value = /*option*/ ctx[42].text) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input1_value_value !== (input1_value_value = /*option*/ ctx[42].value) && input1.value !== input1_value_value) {
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
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(152:8) {#each element.options as option, index}",
    		ctx
    	});

    	return block;
    }

    // (163:4) {#if element.type === 'pre_filled_dropdown'}
    function create_if_block_2$3(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let option;
    	let mounted;
    	let dispose;
    	let if_block = /*$metadata*/ ctx[4].combo_values && create_if_block_3$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Combo Widget:";
    			t1 = space();
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select...";
    			if (if_block) if_block.c();
    			attr_dev(label, "for", "widget_name");
    			attr_dev(label, "class", "svelte-1macg6c");
    			add_location(label, file$6, 164, 12, 7881);
    			option.__value = "Select...";
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1macg6c");
    			add_location(option, file$6, 166, 16, 8092);
    			attr_dev(select, "name", "widget_name");
    			attr_dev(select, "class", "svelte-1macg6c");
    			if (/*element*/ ctx[0].widget_name === void 0) add_render_callback(() => /*select_change_handler*/ ctx[33].call(select));
    			add_location(select, file$6, 165, 12, 7944);
    			attr_dev(div, "class", "formLine svelte-1macg6c");
    			add_location(div, file$6, 163, 8, 7845);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, select);
    			append_dev(select, option);
    			if (if_block) if_block.m(select, null);
    			select_option(select, /*element*/ ctx[0].widget_name, true);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*change_handler_9*/ ctx[32], false, false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[33])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*$metadata*/ ctx[4].combo_values) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$2(ctx);
    					if_block.c();
    					if_block.m(select, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*element, $metadata*/ 17) {
    				select_option(select, /*element*/ ctx[0].widget_name);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(163:4) {#if element.type === 'pre_filled_dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (168:16) {#if $metadata.combo_values}
    function create_if_block_3$2(ctx) {
    	let each_1_anchor;
    	let each_value = Object.entries(/*$metadata*/ ctx[4].combo_values);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
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
    			if (dirty[0] & /*$metadata*/ 16) {
    				each_value = Object.entries(/*$metadata*/ ctx[4].combo_values);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(168:16) {#if $metadata.combo_values}",
    		ctx
    	});

    	return block;
    }

    // (169:20) {#each Object.entries($metadata.combo_values) as [widget_name,values]}
    function create_each_block$5(ctx) {
    	let option;
    	let t_value = /*widget_name*/ ctx[38] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget_name*/ ctx[38];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1macg6c");
    			add_location(option, file$6, 169, 24, 8282);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16 && t_value !== (t_value = /*widget_name*/ ctx[38] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*$metadata*/ 16 && option_value_value !== (option_value_value = /*widget_name*/ ctx[38])) {
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
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(169:20) {#each Object.entries($metadata.combo_values) as [widget_name,values]}",
    		ctx
    	});

    	return block;
    }

    // (176:4) {#if element.type === 'slider' || element.type === 'number'}
    function create_if_block_1$4(ctx) {
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
    			attr_dev(label0, "class", "svelte-1macg6c");
    			add_location(label0, file$6, 177, 12, 8542);
    			attr_dev(input0, "name", "min");
    			attr_dev(input0, "type", "number");
    			input0.value = input0_value_value = /*element*/ ctx[0].min;
    			attr_dev(input0, "class", "svelte-1macg6c");
    			add_location(input0, file$6, 178, 12, 8587);
    			attr_dev(div0, "class", "formLine svelte-1macg6c");
    			add_location(div0, file$6, 176, 8, 8506);
    			attr_dev(label1, "for", "max");
    			attr_dev(label1, "class", "svelte-1macg6c");
    			add_location(label1, file$6, 181, 12, 8762);
    			attr_dev(input1, "name", "max");
    			attr_dev(input1, "type", "number");
    			input1.value = input1_value_value = /*element*/ ctx[0].max;
    			attr_dev(input1, "class", "svelte-1macg6c");
    			add_location(input1, file$6, 182, 12, 8807);
    			attr_dev(div1, "class", "formLine svelte-1macg6c");
    			add_location(div1, file$6, 180, 8, 8726);
    			attr_dev(label2, "for", "step");
    			attr_dev(label2, "class", "svelte-1macg6c");
    			add_location(label2, file$6, 185, 12, 8981);
    			attr_dev(input2, "name", "step");
    			attr_dev(input2, "type", "number");
    			input2.value = input2_value_value = /*element*/ ctx[0].step;
    			attr_dev(input2, "class", "svelte-1macg6c");
    			add_location(input2, file$6, 186, 12, 9028);
    			attr_dev(div2, "class", "formLine svelte-1macg6c");
    			add_location(div2, file$6, 184, 8, 8945);
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
    					listen_dev(input0, "input", /*input_handler_5*/ ctx[34], false, false, false, false),
    					listen_dev(input1, "input", /*input_handler_6*/ ctx[35], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_7*/ ctx[36], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 17 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].min) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].max) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].step) && input2.value !== input2_value_value) {
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(176:4) {#if element.type === 'slider' || element.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let if_block3_anchor;
    	let mounted;
    	let dispose;
    	let if_block0 = /*element*/ ctx[0].type === "advanced_options" && create_if_block_18(ctx);
    	let if_block1 = /*element*/ ctx[0].type === "layer_image" && create_if_block_17(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*element*/ ctx[0].type === 'text') return create_if_block_8$2;
    		if (/*element*/ ctx[0].type === 'textarea') return create_if_block_9$2;
    		if (/*element*/ ctx[0].type === 'checkbox') return create_if_block_10$2;
    		if (/*element*/ ctx[0].type === 'dropdown') return create_if_block_11$2;
    		if (/*element*/ ctx[0].type === 'pre_filled_dropdown') return create_if_block_12$2;
    		if (/*element*/ ctx[0].type === 'slider') return create_if_block_15;
    		if (/*element*/ ctx[0].type === 'number') return create_if_block_16;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block2 = current_block_type && current_block_type(ctx);
    	let if_block3 = /*showProperties*/ ctx[3] && create_if_block$5(ctx);

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
    			t4 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			attr_dev(div0, "class", "editElementButton svelte-1macg6c");
    			add_location(div0, file$6, 56, 4, 1809);
    			attr_dev(div1, "class", "element-preview svelte-1macg6c");
    			add_location(div1, file$6, 54, 0, 1712);
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
    			append_dev(div1, t3);
    			if (if_block2) if_block2.m(div1, null);
    			insert_dev(target, t4, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*openProperties*/ ctx[10], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*element*/ ctx[0].type === "advanced_options") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_18(ctx);
    					if_block0.c();
    					if_block0.m(div1, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*element*/ ctx[0].type === "layer_image") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_17(ctx);
    					if_block1.c();
    					if_block1.m(div1, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if (if_block2) if_block2.d(1);
    				if_block2 = current_block_type && current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			}

    			if (/*showProperties*/ ctx[3]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$5(ctx);
    					if_block3.c();
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();

    			if (if_block2) {
    				if_block2.d();
    			}

    			if (detaching) detach_dev(t4);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(4, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormElement', slots, []);
    	let { element } = $$props;
    	let { showProperties = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let { value } = $$props;

    	if (element.type === "slider") {
    		if (!value) value = element.min;
    	}

    	// Function to immediately update the parent component
    	function updateElement(updatedProps) {
    		$$invalidate(0, element = { ...element, ...updatedProps });
    		dispatch('update', element);
    		if (element.type === "slider" || element.type === "number") $$invalidate(1, value = element.default);
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

    	function changeValue(newValue) {
    		$$invalidate(1, value = newValue);
    		dispatch("change", { value });
    	}

    	let { advancedOptions = true } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (element === undefined && !('element' in $$props || $$self.$$.bound[$$self.$$.props['element']])) {
    			console.warn("<FormElement> was created without expected prop 'element'");
    		}

    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<FormElement> was created without expected prop 'value'");
    		}
    	});

    	const writable_props = ['element', 'showProperties', 'value', 'advancedOptions'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormElement> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(2, advancedOptions = !advancedOptions);
    		dispatch("redrawAll", {});
    	};

    	const change_handler = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_1 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_2 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_3 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_4 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_5 = e => {
    		changeValue(e.target.value);
    	};

    	const change_handler_6 = e => {
    		changeValue(e.target.value);
    	};

    	const input_handler = e => updateElement({ label: e.target.value });
    	const change_handler_7 = e => updateElement({ name: e.target.value });
    	const input_handler_1 = e => updateElement({ default: e.target.value });

    	function input3_change_handler() {
    		element.hidden = this.checked;
    		$$invalidate(0, element);
    	}

    	const input_handler_2 = e => updateElement({ placeholder: e.target.value });
    	const change_handler_8 = e => updateElement({ name: e.target.value });

    	function input1_change_handler() {
    		element.from_selection = this.checked;
    		$$invalidate(0, element);
    	}

    	const input_handler_3 = (index, e) => handleOptionChange(e, index, 'text');
    	const input_handler_4 = (index, e) => handleOptionChange(e, index, 'value');
    	const click_handler_1 = index => removeOption(index);
    	const change_handler_9 = e => updateElement({ widget_name: e.target.value });

    	function select_change_handler() {
    		element.widget_name = select_value(this);
    		$$invalidate(0, element);
    	}

    	const input_handler_5 = e => updateElement({ min: e.target.value });
    	const input_handler_6 = e => updateElement({ max: e.target.value });
    	const input_handler_7 = e => updateElement({ step: e.target.value });
    	const click_handler_2 = () => deleteElement();

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('showProperties' in $$props) $$invalidate(3, showProperties = $$props.showProperties);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('advancedOptions' in $$props) $$invalidate(2, advancedOptions = $$props.advancedOptions);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		element,
    		showProperties,
    		layer_image_preview,
    		metadata,
    		dispatch,
    		value,
    		updateElement,
    		handleOptionChange,
    		addOption,
    		removeOption,
    		openProperties,
    		closeProperties,
    		deleteElement,
    		changeValue,
    		advancedOptions,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('showProperties' in $$props) $$invalidate(3, showProperties = $$props.showProperties);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('advancedOptions' in $$props) $$invalidate(2, advancedOptions = $$props.advancedOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		value,
    		advancedOptions,
    		showProperties,
    		$metadata,
    		dispatch,
    		updateElement,
    		handleOptionChange,
    		addOption,
    		removeOption,
    		openProperties,
    		closeProperties,
    		deleteElement,
    		changeValue,
    		click_handler,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		change_handler_3,
    		change_handler_4,
    		change_handler_5,
    		change_handler_6,
    		input_handler,
    		change_handler_7,
    		input_handler_1,
    		input3_change_handler,
    		input_handler_2,
    		change_handler_8,
    		input1_change_handler,
    		input_handler_3,
    		input_handler_4,
    		click_handler_1,
    		change_handler_9,
    		select_change_handler,
    		input_handler_5,
    		input_handler_6,
    		input_handler_7,
    		click_handler_2
    	];
    }

    class FormElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				element: 0,
    				showProperties: 3,
    				value: 1,
    				advancedOptions: 2
    			},
    			add_css$7,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormElement",
    			options,
    			id: create_fragment$7.name
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

    	get value() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get advancedOptions() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set advancedOptions(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class mappingsHelper {

        getDefaultFields() {
            return [{name:"mergedImage",type:"image",notInRuleEditor:true},{name:"mask",type:"image",notInRuleEditor:true},{name:"hasMask"},{name:"prompt"},{name:"negativePrompt"},
            {name:"controlnet[].type"},{name:"controlnet[].image",type:"image",notInRuleEditor:true},{name:"controlnet[].strength"},{name:"controlnet[].start_percent"},{name:"controlnet[].end_percent"},{name:"controlnet[].model"}]
        }
    /**
         * get list of fields which can be used for widget mappings of each ComfyUI node:
         * fields: the form fields, defined by user
         * defaultFields: the fields whoch are usually available 
         * outputFields: the output fields, like an image or multiple images
         */
        getMappingFields(metadata) {
            let fields= [];
            if (metadata.forms && metadata.forms.default && metadata.forms.default.elements) fields=metadata.forms.default.elements;
            let defaultFields=this.getDefaultFields();
            let outputFields=[{name:"resultImage"}];
            let res= {fields,defaultFields,outputFields};
            return res
        }
    }

    class rulesExecution {
        constructor() {
            this.defaultFields=new mappingsHelper().getDefaultFields();

        }
        /**
         * @param {string} fieldName 
         * @param {array} fieldList 
         * @returns {object} the field object
         */
        getField(fieldName,fieldList) {
            if (!fieldList) return
            for(let i=0;i<fieldList.length;i++) {
                let field=fieldList[i];
                if (field.name===fieldName) return field
            }
            for(let i=0;i<this.defaultFields.length;i++) {
                let field=this.defaultFields[i];
                if (field.name===fieldName) return field
            }        
        }
        checkArray(fieldName) {
            return fieldName.includes("[]")
        }
        getArrayName(fieldName) {
            if (!this.checkArray(fieldName)) return
            return fieldName.split("[")[0]  // e.g. controlnet
        }    
        // type conversion based on field type
        convertValue(value,field) {
            if (field.type==="checkbox" || field.type==="boolean") {
                if (value==="true") return true
                if (value==="false") return false
            }
            if (field.type==="slider" || field.type==="number") {
                if (this.isInteger(field.step)) {
                    return parseInt(value)
                }
                if (this.isFloat(field.step)) {
                    return parseFloat(value)
                }
            }
            return value
        }
        /**
         * gets value from custim fields and default fields
         * @param {object} data the data object 
         * @param {string} fieldName the field name including array name
         * @param {array} fieldList all custom fields
         * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
         * @returns {*}  the value
         */
        getValue(data,fieldName,fieldList,arrayIdx) {
            let field=this.getField(fieldName,fieldList);
            if (!this.checkArray(fieldName)) {
                let value= data[fieldName];
                return this.convertValue(value,field)
            }
            let arrayName= fieldName.split("[")[0];  // e.g. controlnet
            let propertyName= fieldName.split(".")[1];  // e.g. image
            let i=arrayIdx[arrayName];
            let value= data[arrayName][i][propertyName];
            return  this.convertValue(value,field)
        }

        setValue(data,value,fieldName,fieldList,arrayIdx) {
            let field=this.getField(fieldName,fieldList);
            if (!this.checkArray(fieldName)) {
                data[fieldName]= this.convertValue(value,field);
                return
            }       
            let arrayName= fieldName.split("[")[0];  // e.g. controlnet
            let propertyName= fieldName.split(".")[1];  // e.g. image
            let i=arrayIdx[arrayName];
            value=this.convertValue(value,field);
            data[arrayName][i][propertyName]=value;

        }
        isInteger(value) {
            return !isNaN(value) && Number.isInteger(parseInt(value))
        }
        
        isFloat(value) {
            return !isNaN(value) && !Number.isInteger(parseInt(value)) && !isNaN(parseFloat(value))
        }    
        /**
         * execute rules on real data
         * @param {object} data the form data 
         * @param {array} fieldList the list of field definitions
         * @param {array} rules the rules list
         * @param {object} arrayIdx array index for each array (e.g. controlnet: 0)
         * @param {string} arrayName optional: limit rules execution to that array only
         * @returns {object} {data,hiddenFields}  data and list of hidden fields
         */
        execute(data,fieldList,rules,arrayIdx={},arrayName="") {
            if (!data) return {data,hiddenFields:{}}
            let hiddenFields=[];
            for(let i=0;i<rules.length;i++) {
                // { fieldName, condition, actionType, rightValue, targetField, actionValue }
                let rule=rules[i];
                let field=this.getField(rule.fieldName,fieldList);
                if (arrayName==="__ignore_arrays" &&  this.checkArray(field.name)) continue 
                let leftValue=this.getValue(data,rule.fieldName,fieldList,arrayIdx);
                let rightValue=rule.rightValue;
                if (!field) {
                    console.error("rule execution field not found:",rule.fieldName);
                    continue
                }
                if (arrayName && !this.checkArray(field.name)) continue  // array mode, but field is not an array
                if (arrayName && this.getArrayName(field.name)!==arrayName) continue    // other arrays ignore
                rightValue=this.convertValue(rightValue,field);
                leftValue=this.convertValue(leftValue,field);

                let res=false;
                switch (rule.condition) {   // ['==', '!=', '>', '<', '>=', '<=']
                    case "===":
                    case "==":
                        if (leftValue===rightValue) res=true;
                        break
                    case "!=":
                    case "!==":
                        if (leftValue!==rightValue) res=true;
                        break                    
                    case ">":
                        if (leftValue>rightValue) res=true;
                        break  
                    case "<=":
                        if (leftValue<=rightValue) res=true;
                        break                             
                    case ">=":
                        if (leftValue>=rightValue) res=true;
                        break 
                    case "<":
                        if (leftValue<rightValue) res=true;
                        break 

                }
                console.log("executed:",leftValue,rule.condition,rightValue,res);
                if (!res) continue // rule will be not executed because condition is false
                if (rule.actionType==="setValue") {

                    let targetFieldName=rule.targetField;
                    let targetField=this.getField(targetFieldName,fieldList);
                    if (!targetField) {
                        console.error("rule execution target field not found:",targetFieldName);
                        continue                    
                    }
                    let value=rule.actionValue;
                    this.setValue(data,value,targetFieldName,fieldList,arrayIdx);
                }
                if (rule.actionType==="hideField") {
                    hiddenFields.push(rule.targetField);
                }
            }        
            return {data,hiddenFields}
        }

    }

    /* src\FormBuilder.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\FormBuilder.svelte";

    function add_css$6(target) {
    	append_styles(target, "svelte-1yl6ahv", ".formBuilder.svelte-1yl6ahv.svelte-1yl6ahv{padding:10px;color:white;width:470px;display:block}.formBuilder.svelte-1yl6ahv h1.svelte-1yl6ahv{font-size:16px;margin-bottom:30px}.draggable.svelte-1yl6ahv.svelte-1yl6ahv{cursor:grab}.form.svelte-1yl6ahv.svelte-1yl6ahv{border-radius:5px;background-color:black;width:450px;padding:10px;color:white;font:\"Segoe UI\", Roboto, system-ui;font-size:14px;margin-bottom:10px}.formBuilder.svelte-1yl6ahv .add_field_select_label.svelte-1yl6ahv{display:inline-block}.formBuilder.svelte-1yl6ahv .add_field_select.svelte-1yl6ahv{margin-right:10px;background-color:black;color:white;padding:5px;display:inline-block}.formBuilder.svelte-1yl6ahv button.svelte-1yl6ahv{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUJ1aWxkZXIuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtQnVpbGRlci5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICBpbXBvcnQgRm9ybUVsZW1lbnQgZnJvbSAnLi9Gb3JtRWxlbWVudC5zdmVsdGUnO1xyXG4gIGltcG9ydCB7IG1ldGFkYXRhfSBmcm9tICcuL3N0b3Jlcy9tZXRhZGF0YSdcclxuICBpbXBvcnQgeyBydWxlc0V4ZWN1dGlvbiB9IGZyb20gJy4vcnVsZXNFeGVjdXRpb24uanMnXHJcbiAgXHJcbiAgaWYgKCEkbWV0YWRhdGEuZm9ybXMpICRtZXRhZGF0YS5mb3Jtcz17fVxyXG5cclxuICBleHBvcnQgbGV0IGZvcm1fa2V5PSdkZWZhdWx0JyAgLy8gc3VwcG9ydCBmb3IgbXVsdGlwbGUgZm9ybXMgKGUuZy4gd2l6YXJkcykgaW4gdGhlIGZ1dHVyZVxyXG4gIGV4cG9ydCBsZXQgZGF0YT17fSAgICAgICAgICAgIC8vIHRoZSBmb3JtIGRhdGFcclxuICBleHBvcnQgbGV0IHJlZnJlc2hcclxuICBpZiAoISRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0pICRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV09e2VsZW1lbnRzOltdfVxyXG4gIGlmICghJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XS5lbGVtZW50cykgJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XS5lbGVtZW50cz1bXVxyXG4gIGxldCBmb3JtRWxlbWVudHMgPSAkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldLmVsZW1lbnRzXHJcbiAgZW5zdXJlVW5pcXVlTmFtZXMoKVxyXG4gIHNldERlZmF1bHRWYWx1ZXMoKVxyXG5cclxuICBsZXQgZHJhZ1N0YXJ0SW5kZXg9LTFcclxuICBsZXQgc2hvd1Byb3BlcnRpZXNJZHg9LTFcclxuICBsZXQgc2VsZWN0ZWRUeXBlXHJcblxyXG4gIGZ1bmN0aW9uIGVuc3VyZVVuaXF1ZU5hbWVzKCkge1xyXG4gIGNvbnN0IG5hbWVNYXAgPSB7fTsgLy8gT2JqZWN0IHRvIGtlZXAgdHJhY2sgb2YgbmFtZXMgYW5kIHRoZWlyIG9jY3VycmVuY2VzXHJcblxyXG4gIGZvcm1FbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgbGV0IG5hbWUgPSBlbGVtZW50Lm5hbWU7XHJcbiAgICAvLyBDaGVjayBpZiB0aGUgbmFtZSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgbmFtZU1hcFxyXG4gICAgaWYgKG5hbWVNYXBbbmFtZV0pIHtcclxuICAgICAgLy8gSWYgdGhlIG5hbWUgZXhpc3RzLCBpbmNyZW1lbnQgdGhlIGNvdW50IGFuZCBhcHBlbmQgaXQgdG8gdGhlIG5hbWVcclxuICAgICAgbGV0IGNvdW50ID0gbmFtZU1hcFtuYW1lXTtcclxuICAgICAgbGV0IG5ld05hbWUgPSBgJHtuYW1lfV8ke2NvdW50fWA7XHJcbiAgICAgIHdoaWxlIChuYW1lTWFwW25ld05hbWVdKSB7IC8vIEVuc3VyZSB0aGUgbmV3IG5hbWUgaXMgYWxzbyB1bmlxdWVcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIG5ld05hbWUgPSBgJHtuYW1lfV8ke2NvdW50fWA7XHJcbiAgICAgIH1cclxuICAgICAgZWxlbWVudC5uYW1lID0gbmV3TmFtZTtcclxuICAgICAgbmFtZU1hcFtuYW1lXSsrO1xyXG4gICAgICBuYW1lTWFwW25ld05hbWVdID0gMTsgLy8gSW5pdGlhbGl6ZSB0aGlzIG5ldyBuYW1lIGluIHRoZSBuYW1lTWFwXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBJZiB0aGUgbmFtZSBkb2Vzbid0IGV4aXN0LCBhZGQgaXQgdG8gdGhlIG5hbWVNYXBcclxuICAgICAgbmFtZU1hcFtuYW1lXSA9IDFcclxuICAgIH1cclxuICB9KTtcclxufVxyXG4gICQ6IHtcclxuICAgIGlmIChyZWZyZXNoKSB7XHJcbiAgICAgIGZvcihsZXQgaT0wO2k8Zm9ybUVsZW1lbnRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICBsZXQgZWxlbWVudD1mb3JtRWxlbWVudHNbaV1cclxuICAgICAgICBpZiAoIWRhdGFbZWxlbWVudC5uYW1lXSkgZGF0YVtlbGVtZW50Lm5hbWVdPWVsZW1lbnQuZGVmYXVsdFxyXG4gICAgICB9XHJcbiAgICAgIGZvcm1FbGVtZW50cz1mb3JtRWxlbWVudHNcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gYWRkRWxlbWVudCh0eXBlKSB7XHJcbiAgICBpZiAoIXR5cGUpIHJldHVyblxyXG4gICAgbGV0IG5hbWU9XCJ2YWx1ZV9cIitNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgNSlcclxuICAgIFxyXG4gICAgbGV0IG5ld0VsZW1lbnQgPSB7XHJcbiAgICAgIG5hbWU6IG5hbWUsIC8vIFVuaXF1ZSBJRCBmb3Iga2V5IHRyYWNraW5nIGFuZCByZWFjdGl2aXR5XHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIGxhYmVsOiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKSxcclxuICAgICAgbmFtZTogbmFtZSwgLy8gRXhhbXBsZSBuYW1pbmcgY29udmVudGlvblxyXG4gICAgICBvcHRpb25zOiB0eXBlID09PSAnZHJvcGRvd24nID8gW3sgdGV4dDogJ09wdGlvbiAxJywga2V5OiAnMScgfV0gOiBbXSxcclxuICAgICAgZGVmYXVsdDogXCJcIlxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGU9PT1cInNsaWRlclwiIHx8IHR5cGU9PT1cIm51bWJlclwiKSB7XHJcbiAgICAgIG5ld0VsZW1lbnQubWluPTFcclxuICAgICAgbmV3RWxlbWVudC5tYXg9MjBcclxuICAgICAgbmV3RWxlbWVudC5zdGVwPTFcclxuICAgICAgbmV3RWxlbWVudC5kZWZhdWx0PTFcclxuICAgIH1cclxuICAgIGlmICh0eXBlPT09XCJjaGVja2JveFwiKSB7XHJcbiAgICAgIG5ld0VsZW1lbnQuZGVmYXVsdD1mYWxzZVxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGU9PT1cInRleHRcIiB8fCB0eXBlPT09XCJ0ZXh0YXJlYVwiKSB7XHJcbiAgICAgIG5ld0VsZW1lbnQucGxhY2Vob2xkZXI9XCJcIlxyXG4gICAgfVxyXG4gICAgZm9ybUVsZW1lbnRzLnB1c2gobmV3RWxlbWVudClcclxuICAgIGVuc3VyZVVuaXF1ZU5hbWVzKClcclxuICAgIGZvcm1FbGVtZW50cz1mb3JtRWxlbWVudHNcclxuICAgIHNob3dQcm9wZXJ0aWVzSWR4PWZvcm1FbGVtZW50cy5sZW5ndGgtMVxyXG4gICAgc2V0RGVmYXVsdFZhbHVlcygpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVEcmFnU3RhcnQoZXZlbnQsIGluZGV4KSB7XHJcbiAgICBpZiAoIWFkdmFuY2VkT3B0aW9ucykgcmV0dXJuXHJcbiAgICBkcmFnU3RhcnRJbmRleCA9IGluZGV4XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVEcmFnT3ZlcihldmVudCkge1xyXG4gICAgaWYgKCFhZHZhbmNlZE9wdGlvbnMpIHJldHVyblxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKSAvLyBOZWNlc3NhcnkgdG8gYWxsb3cgZHJvcHBpbmdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZURyb3AoZXZlbnQsIGRyb3BJbmRleCkge1xyXG4gICAgaWYgKCFhZHZhbmNlZE9wdGlvbnMpIHJldHVyblxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgaWYgKGRyYWdTdGFydEluZGV4ID09PSBkcm9wSW5kZXgpIHJldHVyblxyXG4gICAgXHJcbiAgICBjb25zdCBkcmFnZ2VkSXRlbSA9IGZvcm1FbGVtZW50c1tkcmFnU3RhcnRJbmRleF07XHJcbiAgICBjb25zdCByZW1haW5pbmdJdGVtcyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoKF8sIGluZGV4KSA9PiBpbmRleCAhPT0gZHJhZ1N0YXJ0SW5kZXgpXHJcbiAgICBjb25zdCByZW9yZGVyZWRJdGVtcyA9IFtcclxuICAgICAgICAuLi5yZW1haW5pbmdJdGVtcy5zbGljZSgwLCBkcm9wSW5kZXgpLFxyXG4gICAgICAgIGRyYWdnZWRJdGVtLFxyXG4gICAgICAgIC4uLnJlbWFpbmluZ0l0ZW1zLnNsaWNlKGRyb3BJbmRleClcclxuICAgIF1cclxuICAgIC8vIFJlYXNzaWduIHRoZSByZW9yZGVyZWQgaXRlbXMgYmFjayB0byBmb3JtRWxlbWVudHNcclxuICAgIGZvcm1FbGVtZW50cyA9IHJlb3JkZXJlZEl0ZW1zXHJcbiAgICBmb3JtRWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbiAgICAvLyBSZXNldCBkcmFnZ2VkIGluZGV4XHJcbiAgICBkcmFnU3RhcnRJbmRleCA9IC0xXHJcbn1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChpbmRleCkge1xyXG4gICAgZm9ybUVsZW1lbnRzLnVwZGF0ZShlbGVtZW50cyA9PiBlbGVtZW50cy5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KSlcclxuICB9XHJcblxyXG4gIGxldCBhZHZhbmNlZE9wdGlvbnM9dHJ1ZVxyXG4gIGZ1bmN0aW9uIGNoZWNrQWR2YW5jZWRPcHRpb25zKGVsZW1lbnQsaW5kZXgpIHtcclxuICAgIGlmIChhZHZhbmNlZE9wdGlvbnMpIHJldHVybiBcImJsb2NrXCJcclxuICAgIGlmIChlbGVtZW50LnR5cGU9PT1cImFkdmFuY2VkX29wdGlvbnNcIikgcmV0dXJuIFwiYmxvY2tcIlxyXG4gICAgbGV0IGFkdmFuY2VkT3B0aW9uc0luZGV4PS0xXHJcbiAgICBmb3IobGV0IGk9MDtpPGZvcm1FbGVtZW50cy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgIGxldCBlPWZvcm1FbGVtZW50c1tpXVxyXG4gICAgICBpZiAgKGUudHlwZT09PVwiYWR2YW5jZWRfb3B0aW9uc1wiKSBhZHZhbmNlZE9wdGlvbnNJbmRleD1pXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFkdmFuY2VkT3B0aW9uc0luZGV4PDApIHsgLy8gZWxlbWVudCBkb2VzIG5vdCBleGlzdHMgYW55bW9yZVxyXG4gICAgICBhZHZhbmNlZE9wdGlvbnM9dHJ1ZVxyXG4gICAgICByZXR1cm4gXCJibG9ja1wiXHJcbiAgICB9XHJcbiAgICBpZiAoaW5kZXggPGFkdmFuY2VkT3B0aW9uc0luZGV4KSByZXR1cm4gXCJibG9ja1wiIC8vIGJlZm9yZSBhZHZhbmNlZCBvcHRpb25zXHJcbiAgICByZXR1cm4gXCJub25lXCJcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGV4ZWN1dGVSdWxlcyhlbGVtZW50LHZhbHVlKSB7XHJcbiAgICAvLyBmaXJzdCBzZXQgdGhlIG5ldyB2YWx1ZVxyXG4gICAgZGF0YVtlbGVtZW50Lm5hbWVdPXZhbHVlXHJcbiAgICBkYXRhLmNvbnRyb2xuZXQ9W11cclxuICAgIGRhdGEuY29udHJvbG5ldFswXT17XCJ0eXBlXCI6XCJwb3NlXCJ9XHJcbiAgICAvLyBub3cgZXhlY3V0ZSBydWxlc1xyXG4gICAgbGV0IHJlPW5ldyBydWxlc0V4ZWN1dGlvbigpICAgIFxyXG4gICAgbGV0IHJlcz1yZS5leGVjdXRlKGRhdGEsZm9ybUVsZW1lbnRzLCRtZXRhZGF0YS5ydWxlcyx7XCJjb250cm9sbmV0XCI6MH0pXHJcbiAgICBpZiAoIXJlcykgcmV0dXJuXHJcbiAgICBkYXRhPXJlcy5kYXRhXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHNldERlZmF1bHRWYWx1ZXMoKSB7XHJcbiAgICBpZiAoIWZvcm1FbGVtZW50cykgcmV0dXJuXHJcbiAgICBmb3IobGV0IGk9MDtpPGZvcm1FbGVtZW50cy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgIGxldCBmaWVsZD1mb3JtRWxlbWVudHNbaV1cclxuICAgICAgaWYgKCFkYXRhW2ZpZWxkLm5hbWVdKSBkYXRhW2ZpZWxkLm5hbWVdPWZpZWxkLmRlZmF1bHRcclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuXHJcblxyXG48ZGl2IGNsYXNzPVwiZm9ybUJ1aWxkZXJcIj5cclxuPGgxPkVkaXQgZm9ybTwvaDE+XHJcbjxkaXYgY2xhc3M9XCJmb3JtXCI+XHJcbiAgeyNlYWNoIGZvcm1FbGVtZW50cyBhcyBlbGVtZW50LCBpbmRleCAoZWxlbWVudC5uYW1lKX1cclxuICAgIDxkaXZcclxuICAgICAgY2xhc3M9XCJkcmFnZ2FibGVcIlxyXG4gICAgICBkcmFnZ2FibGU9XCJ0cnVlXCJcclxuICAgICAgc3R5bGU9XCJkaXNwbGF5OntjaGVja0FkdmFuY2VkT3B0aW9ucyhlbGVtZW50LGluZGV4KX1cIlxyXG4gICAgICBvbjpkcmFnc3RhcnQ9eygpID0+IGhhbmRsZURyYWdTdGFydChldmVudCwgaW5kZXgpfVxyXG4gICAgICBvbjpkcmFnb3Zlcj17aGFuZGxlRHJhZ092ZXJ9XHJcbiAgICAgIG9uOmRyb3A9eygpID0+IGhhbmRsZURyb3AoZXZlbnQsIGluZGV4KX0+XHJcbiAgICAgIDxGb3JtRWxlbWVudCB7ZWxlbWVudH0gYmluZDphZHZhbmNlZE9wdGlvbnM9e2FkdmFuY2VkT3B0aW9uc31cclxuICAgICAgICBvbjpyZWRyYXdBbGw9eyhlKSA9PiB7Zm9ybUVsZW1lbnRzPWZvcm1FbGVtZW50c319XHJcbiAgICAgICAgb246cmVtb3ZlPXsoKSA9PiByZW1vdmVFbGVtZW50KGluZGV4KX0gIFxyXG4gICAgICAgIG9uOm9wZW5Qcm9wZXJ0aWVzPXsoKSA9PiB7c2hvd1Byb3BlcnRpZXNJZHg9aW5kZXggfX0gXHJcbiAgICAgICAgb246Y2xvc2VQcm9wZXJ0aWVzPXsoKSA9PiB7c2hvd1Byb3BlcnRpZXNJZHg9LTEgfX1cclxuICAgICAgICBvbjp1cGRhdGU9eyhlKSA9PiB7IGZvcm1FbGVtZW50c1tpbmRleF09ZS5kZXRhaWw7IGVuc3VyZVVuaXF1ZU5hbWVzKCkgfX1cclxuICAgICAgICBvbjpkZWxldGU9eyhlKSA9PiB7IGZvcm1FbGVtZW50cy5zcGxpY2Uoc2hvd1Byb3BlcnRpZXNJZHgsMSk7Zm9ybUVsZW1lbnRzPWZvcm1FbGVtZW50cztzaG93UHJvcGVydGllc0lkeD0tMSB9fVxyXG4gICAgICAgIHZhbHVlPXtkYXRhW2VsZW1lbnQubmFtZV19XHJcbiAgICAgICAgb246Y2hhbmdlPXtlID0+IHsgZXhlY3V0ZVJ1bGVzKGVsZW1lbnQsZS5kZXRhaWwudmFsdWUpfX1cclxuICAgICAgICBzaG93UHJvcGVydGllcz17c2hvd1Byb3BlcnRpZXNJZHg9PT1pbmRleH0vPlxyXG4gICAgICA8L2Rpdj5cclxuICB7L2VhY2h9XHJcbjwvZGl2PlxyXG48ZGl2PlxyXG48bGFiZWwgZm9yPVwiYWRkX2ZpZWxkX3NlbGVjdFwiIGNsYXNzPVwiYWRkX2ZpZWxkX3NlbGVjdF9sYWJlbFwiPiBBZGQgZm9ybSBmaWVsZDo8L2xhYmVsPiBcclxuICA8c2VsZWN0IGNsYXNzPVwiYWRkX2ZpZWxkX3NlbGVjdFwiIG5hbWU9XCJhZGRfZmllbGRfc2VsZWN0XCIgYmluZDp2YWx1ZT17c2VsZWN0ZWRUeXBlfT5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJ0ZXh0XCI+VGV4dCBJbnB1dDwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cInRleHRhcmVhXCI+VGV4dGFyZWE8L29wdGlvbj5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJjaGVja2JveFwiPkNoZWNrYm94PC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwiZHJvcGRvd25cIj5Ecm9wZG93bjwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cInByZV9maWxsZWRfZHJvcGRvd25cIj5QcmUtZmlsbGVkIERyb3Bkb3duPC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwic2xpZGVyXCI+U2xpZGVyPC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwibnVtYmVyXCI+TnVtYmVyPC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwibGF5ZXJfaW1hZ2VcIj5MYXllciBJbWFnZTwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cImFkdmFuY2VkX29wdGlvbnNcIj5BZHZhbmNlZCBPcHRpb25zIFN3aXRjaDwvb3B0aW9uPlxyXG4gIDwvc2VsZWN0PlxyXG4gIDxidXR0b24gb246Y2xpY2s9eygpID0+IGFkZEVsZW1lbnQoc2VsZWN0ZWRUeXBlKX0+QWRkPC9idXR0b24+XHJcbjwvZGl2PlxyXG48L2Rpdj5cclxuPHN0eWxlPlxyXG4gIC5mb3JtQnVpbGRlciB7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgd2lkdGg6IDQ3MHB4O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfVxyXG4gIC5mb3JtQnVpbGRlciBoMSB7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gIH1cclxuICAuZHJhZ2dhYmxlIHtcclxuICAgIGN1cnNvcjogZ3JhYjtcclxuICB9XHJcbiAgLmZvcm0ge1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICB3aWR0aDogNDUwcHg7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udDogXCJTZWdvZSBVSVwiLCBSb2JvdG8sIHN5c3RlbS11aTtcclxuICAgIGZvbnQtc2l6ZToxNHB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICB9XHJcbiAgLmZvcm1CdWlsZGVyIC5hZGRfZmllbGRfc2VsZWN0X2xhYmVsIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcbiAgLmZvcm1CdWlsZGVyIC5hZGRfZmllbGRfc2VsZWN0IHtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDsgICBcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgfVxyXG4gICAgLmZvcm1CdWlsZGVyIGJ1dHRvbiB7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIG1pbi13aWR0aDogNzBweDtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogcmdiKDEyOCwgMTI4LCAxMjgpO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFzTUUsMENBQWEsQ0FDWCxPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxLQUFLLENBQ1osS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsS0FDWCxDQUNBLDJCQUFZLENBQUMsaUJBQUcsQ0FDZCxTQUFTLENBQUUsSUFBSSxDQUNmLGFBQWEsQ0FBRSxJQUNqQixDQUNBLHdDQUFXLENBQ1QsTUFBTSxDQUFFLElBQ1YsQ0FDQSxtQ0FBTSxDQUNKLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxLQUFLLENBQ1osSUFBSSxDQUFFLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FDbkMsVUFBVSxJQUFJLENBQ2QsYUFBYSxDQUFFLElBQ2pCLENBQ0EsMkJBQVksQ0FBQyxzQ0FBd0IsQ0FDbkMsT0FBTyxDQUFFLFlBQ1gsQ0FDQSwyQkFBWSxDQUFDLGdDQUFrQixDQUN6QixZQUFZLENBQUUsSUFBSSxDQUNsQixnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLEtBQUssQ0FBRSxLQUFLLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FDWixPQUFPLENBQUUsWUFDZixDQUNFLDJCQUFZLENBQUMscUJBQU8sQ0FDaEIsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksU0FBUyxDQUFFLElBQUksQ0FDZixTQUFTLENBQUUsSUFBSSxDQUNmLEtBQUssQ0FBRSxLQUFLLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDcEMsWUFBWSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ2hDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsWUFBWSxDQUFFLElBQ2xCIn0= */");
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[32] = i;
    	return child_ctx;
    }

    // (160:2) {#each formElements as element, index (element.name)}
    function create_each_block$4(key_1, ctx) {
    	let div;
    	let formelement;
    	let updating_advancedOptions;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	function formelement_advancedOptions_binding(value) {
    		/*formelement_advancedOptions_binding*/ ctx[15](value);
    	}

    	function remove_handler() {
    		return /*remove_handler*/ ctx[17](/*index*/ ctx[32]);
    	}

    	function openProperties_handler() {
    		return /*openProperties_handler*/ ctx[18](/*index*/ ctx[32]);
    	}

    	function update_handler(...args) {
    		return /*update_handler*/ ctx[20](/*index*/ ctx[32], ...args);
    	}

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[22](/*element*/ ctx[30], ...args);
    	}

    	let formelement_props = {
    		element: /*element*/ ctx[30],
    		value: /*data*/ ctx[0][/*element*/ ctx[30].name],
    		showProperties: /*showPropertiesIdx*/ ctx[2] === /*index*/ ctx[32]
    	};

    	if (/*advancedOptions*/ ctx[4] !== void 0) {
    		formelement_props.advancedOptions = /*advancedOptions*/ ctx[4];
    	}

    	formelement = new FormElement({ props: formelement_props, $$inline: true });
    	binding_callbacks.push(() => bind(formelement, 'advancedOptions', formelement_advancedOptions_binding));
    	formelement.$on("redrawAll", /*redrawAll_handler*/ ctx[16]);
    	formelement.$on("remove", remove_handler);
    	formelement.$on("openProperties", openProperties_handler);
    	formelement.$on("closeProperties", /*closeProperties_handler*/ ctx[19]);
    	formelement.$on("update", update_handler);
    	formelement.$on("delete", /*delete_handler*/ ctx[21]);
    	formelement.$on("change", change_handler);

    	function dragstart_handler() {
    		return /*dragstart_handler*/ ctx[23](/*index*/ ctx[32]);
    	}

    	function drop_handler() {
    		return /*drop_handler*/ ctx[24](/*index*/ ctx[32]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(formelement.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "draggable svelte-1yl6ahv");
    			attr_dev(div, "draggable", "true");
    			set_style(div, "display", /*checkAdvancedOptions*/ ctx[11](/*element*/ ctx[30], /*index*/ ctx[32]));
    			add_location(div, file$5, 160, 4, 4972);
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
    					listen_dev(div, "dragover", /*handleDragOver*/ ctx[8], false, false, false, false),
    					listen_dev(div, "drop", drop_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formelement_changes = {};
    			if (dirty[0] & /*formElements*/ 2) formelement_changes.element = /*element*/ ctx[30];
    			if (dirty[0] & /*data, formElements*/ 3) formelement_changes.value = /*data*/ ctx[0][/*element*/ ctx[30].name];
    			if (dirty[0] & /*showPropertiesIdx, formElements*/ 6) formelement_changes.showProperties = /*showPropertiesIdx*/ ctx[2] === /*index*/ ctx[32];

    			if (!updating_advancedOptions && dirty[0] & /*advancedOptions*/ 16) {
    				updating_advancedOptions = true;
    				formelement_changes.advancedOptions = /*advancedOptions*/ ctx[4];
    				add_flush_callback(() => updating_advancedOptions = false);
    			}

    			formelement.$set(formelement_changes);

    			if (!current || dirty[0] & /*formElements*/ 2) {
    				set_style(div, "display", /*checkAdvancedOptions*/ ctx[11](/*element*/ ctx[30], /*index*/ ctx[32]));
    			}
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(160:2) {#each formElements as element, index (element.name)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
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
    	let option8;
    	let option9;
    	let t15;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*formElements*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*element*/ ctx[30].name;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
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
    			option5.textContent = "Pre-filled Dropdown";
    			option6 = element("option");
    			option6.textContent = "Slider";
    			option7 = element("option");
    			option7.textContent = "Number";
    			option8 = element("option");
    			option8.textContent = "Layer Image";
    			option9 = element("option");
    			option9.textContent = "Advanced Options Switch";
    			t15 = space();
    			button = element("button");
    			button.textContent = "Add";
    			attr_dev(h1, "class", "svelte-1yl6ahv");
    			add_location(h1, file$5, 157, 0, 4871);
    			attr_dev(div0, "class", "form svelte-1yl6ahv");
    			add_location(div0, file$5, 158, 0, 4891);
    			attr_dev(label, "for", "add_field_select");
    			attr_dev(label, "class", "add_field_select_label svelte-1yl6ahv");
    			add_location(label, file$5, 181, 0, 5930);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$5, 183, 4, 6109);
    			option1.__value = "text";
    			option1.value = option1.__value;
    			add_location(option1, file$5, 184, 4, 6150);
    			option2.__value = "textarea";
    			option2.value = option2.__value;
    			add_location(option2, file$5, 185, 4, 6196);
    			option3.__value = "checkbox";
    			option3.value = option3.__value;
    			add_location(option3, file$5, 186, 4, 6244);
    			option4.__value = "dropdown";
    			option4.value = option4.__value;
    			add_location(option4, file$5, 187, 4, 6292);
    			option5.__value = "pre_filled_dropdown";
    			option5.value = option5.__value;
    			add_location(option5, file$5, 188, 4, 6340);
    			option6.__value = "slider";
    			option6.value = option6.__value;
    			add_location(option6, file$5, 189, 4, 6410);
    			option7.__value = "number";
    			option7.value = option7.__value;
    			add_location(option7, file$5, 190, 4, 6454);
    			option8.__value = "layer_image";
    			option8.value = option8.__value;
    			add_location(option8, file$5, 191, 4, 6498);
    			option9.__value = "advanced_options";
    			option9.value = option9.__value;
    			add_location(option9, file$5, 192, 4, 6552);
    			attr_dev(select, "class", "add_field_select svelte-1yl6ahv");
    			attr_dev(select, "name", "add_field_select");
    			if (/*selectedType*/ ctx[3] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[25].call(select));
    			add_location(select, file$5, 182, 2, 6020);
    			attr_dev(button, "class", "svelte-1yl6ahv");
    			add_location(button, file$5, 194, 2, 6634);
    			add_location(div1, file$5, 180, 0, 5923);
    			attr_dev(div2, "class", "formBuilder svelte-1yl6ahv");
    			add_location(div2, file$5, 156, 0, 4844);
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
    			append_dev(select, option8);
    			append_dev(select, option9);
    			select_option(select, /*selectedType*/ ctx[3], true);
    			append_dev(div1, t15);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[25]),
    					listen_dev(button, "click", /*click_handler*/ ctx[26], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkAdvancedOptions, formElements, handleDragStart, handleDragOver, handleDrop, data, showPropertiesIdx, advancedOptions, removeElement, ensureUniqueNames, executeRules*/ 8119) {
    				each_value = /*formElements*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				check_outros();
    			}

    			if (dirty[0] & /*selectedType*/ 8) {
    				select_option(select, /*selectedType*/ ctx[3]);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(28, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormBuilder', slots, []);
    	if (!$metadata.forms) set_store_value(metadata, $metadata.forms = {}, $metadata);
    	let { form_key = 'default' } = $$props; // support for multiple forms (e.g. wizards) in the future
    	let { data = {} } = $$props; // the form data
    	let { refresh } = $$props;
    	if (!$metadata.forms[form_key]) set_store_value(metadata, $metadata.forms[form_key] = { elements: [] }, $metadata);
    	if (!$metadata.forms[form_key].elements) set_store_value(metadata, $metadata.forms[form_key].elements = [], $metadata);
    	let formElements = $metadata.forms[form_key].elements;
    	ensureUniqueNames();
    	setDefaultValues();
    	let dragStartIndex = -1;
    	let showPropertiesIdx = -1;
    	let selectedType;

    	function ensureUniqueNames() {
    		const nameMap = {}; // Object to keep track of names and their occurrences

    		formElements.forEach(element => {
    			let name = element.name;

    			// Check if the name already exists in the nameMap
    			if (nameMap[name]) {
    				// If the name exists, increment the count and append it to the name
    				let count = nameMap[name];

    				let newName = `${name}_${count}`;

    				while (nameMap[newName]) {
    					// Ensure the new name is also unique
    					count++;

    					newName = `${name}_${count}`;
    				}

    				element.name = newName;
    				nameMap[name]++;
    				nameMap[newName] = 1; // Initialize this new name in the nameMap
    			} else {
    				// If the name doesn't exist, add it to the nameMap
    				nameMap[name] = 1;
    			}
    		});
    	}

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
    		ensureUniqueNames();
    		(($$invalidate(1, formElements), $$invalidate(14, refresh)), $$invalidate(0, data));
    		$$invalidate(2, showPropertiesIdx = formElements.length - 1);
    		setDefaultValues();
    	}

    	function handleDragStart(event, index) {
    		if (!advancedOptions) return;
    		dragStartIndex = index;
    	}

    	function handleDragOver(event) {
    		if (!advancedOptions) return;
    		event.preventDefault(); // Necessary to allow dropping
    	}

    	function handleDrop(event, dropIndex) {
    		if (!advancedOptions) return;
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
    		$$invalidate(1, formElements = reorderedItems);

    		(($$invalidate(1, formElements), $$invalidate(14, refresh)), $$invalidate(0, data));

    		// Reset dragged index
    		dragStartIndex = -1;
    	}

    	function removeElement(index) {
    		formElements.update(elements => elements.filter((_, i) => i !== index));
    	}

    	let advancedOptions = true;

    	function checkAdvancedOptions(element, index) {
    		if (advancedOptions) return "block";
    		if (element.type === "advanced_options") return "block";
    		let advancedOptionsIndex = -1;

    		for (let i = 0; i < formElements.length; i++) {
    			let e = formElements[i];
    			if (e.type === "advanced_options") advancedOptionsIndex = i;
    		}

    		if (advancedOptionsIndex < 0) {
    			// element does not exists anymore
    			$$invalidate(4, advancedOptions = true);

    			return "block";
    		}

    		if (index < advancedOptionsIndex) return "block"; // before advanced options
    		return "none";
    	}

    	function executeRules(element, value) {
    		// first set the new value
    		$$invalidate(0, data[element.name] = value, data);

    		$$invalidate(0, data.controlnet = [], data);
    		$$invalidate(0, data.controlnet[0] = { "type": "pose" }, data);

    		// now execute rules
    		let re = new rulesExecution();

    		let res = re.execute(data, formElements, $metadata.rules, { "controlnet": 0 });
    		if (!res) return;
    		$$invalidate(0, data = res.data);
    	}

    	function setDefaultValues() {
    		if (!formElements) return;

    		for (let i = 0; i < formElements.length; i++) {
    			let field = formElements[i];
    			if (!data[field.name]) $$invalidate(0, data[field.name] = field.default, data);
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (refresh === undefined && !('refresh' in $$props || $$self.$$.bound[$$self.$$.props['refresh']])) {
    			console.warn("<FormBuilder> was created without expected prop 'refresh'");
    		}
    	});

    	const writable_props = ['form_key', 'data', 'refresh'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormBuilder> was created with unknown prop '${key}'`);
    	});

    	function formelement_advancedOptions_binding(value) {
    		advancedOptions = value;
    		$$invalidate(4, advancedOptions);
    	}

    	const redrawAll_handler = e => {
    		(($$invalidate(1, formElements), $$invalidate(14, refresh)), $$invalidate(0, data));
    	};

    	const remove_handler = index => removeElement(index);

    	const openProperties_handler = index => {
    		$$invalidate(2, showPropertiesIdx = index);
    	};

    	const closeProperties_handler = () => {
    		$$invalidate(2, showPropertiesIdx = -1);
    	};

    	const update_handler = (index, e) => {
    		$$invalidate(1, formElements[index] = e.detail, formElements);
    		ensureUniqueNames();
    	};

    	const delete_handler = e => {
    		formElements.splice(showPropertiesIdx, 1);
    		(($$invalidate(1, formElements), $$invalidate(14, refresh)), $$invalidate(0, data));
    		$$invalidate(2, showPropertiesIdx = -1);
    	};

    	const change_handler = (element, e) => {
    		executeRules(element, e.detail.value);
    	};

    	const dragstart_handler = index => handleDragStart(event, index);
    	const drop_handler = index => handleDrop(event, index);

    	function select_change_handler() {
    		selectedType = select_value(this);
    		$$invalidate(3, selectedType);
    	}

    	const click_handler = () => addElement(selectedType);

    	$$self.$$set = $$props => {
    		if ('form_key' in $$props) $$invalidate(13, form_key = $$props.form_key);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('refresh' in $$props) $$invalidate(14, refresh = $$props.refresh);
    	};

    	$$self.$capture_state = () => ({
    		FormElement,
    		metadata,
    		rulesExecution,
    		form_key,
    		data,
    		refresh,
    		formElements,
    		dragStartIndex,
    		showPropertiesIdx,
    		selectedType,
    		ensureUniqueNames,
    		addElement,
    		handleDragStart,
    		handleDragOver,
    		handleDrop,
    		removeElement,
    		advancedOptions,
    		checkAdvancedOptions,
    		executeRules,
    		setDefaultValues,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('form_key' in $$props) $$invalidate(13, form_key = $$props.form_key);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('refresh' in $$props) $$invalidate(14, refresh = $$props.refresh);
    		if ('formElements' in $$props) $$invalidate(1, formElements = $$props.formElements);
    		if ('dragStartIndex' in $$props) dragStartIndex = $$props.dragStartIndex;
    		if ('showPropertiesIdx' in $$props) $$invalidate(2, showPropertiesIdx = $$props.showPropertiesIdx);
    		if ('selectedType' in $$props) $$invalidate(3, selectedType = $$props.selectedType);
    		if ('advancedOptions' in $$props) $$invalidate(4, advancedOptions = $$props.advancedOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*refresh, formElements, data*/ 16387) {
    			{
    				if (refresh) {
    					for (let i = 0; i < formElements.length; i++) {
    						let element = formElements[i];
    						if (!data[element.name]) $$invalidate(0, data[element.name] = element.default, data);
    					}

    					(($$invalidate(1, formElements), $$invalidate(14, refresh)), $$invalidate(0, data));
    				}
    			}
    		}
    	};

    	return [
    		data,
    		formElements,
    		showPropertiesIdx,
    		selectedType,
    		advancedOptions,
    		ensureUniqueNames,
    		addElement,
    		handleDragStart,
    		handleDragOver,
    		handleDrop,
    		removeElement,
    		checkAdvancedOptions,
    		executeRules,
    		form_key,
    		refresh,
    		formelement_advancedOptions_binding,
    		redrawAll_handler,
    		remove_handler,
    		openProperties_handler,
    		closeProperties_handler,
    		update_handler,
    		delete_handler,
    		change_handler,
    		dragstart_handler,
    		drop_handler,
    		select_change_handler,
    		click_handler
    	];
    }

    class FormBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { form_key: 13, data: 0, refresh: 14 }, add_css$6, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormBuilder",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get form_key() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form_key(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get refresh() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set refresh(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Icon.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\Icon.svelte";

    function add_css$5(target) {
    	append_styles(target, "svelte-e4n68z", ".default.svelte-e4n68z.svelte-e4n68z{fill:white;display:inline-block;cursor:pointer;width:30px;text-align:center}.default.svelte-e4n68z.svelte-e4n68z:hover,.active.svelte-e4n68z.svelte-e4n68z{fill:black;background-color:#ddb74f;border-radius:5px}.deactivate.svelte-e4n68z.svelte-e4n68z{fill:grey;cursor:default}.deactivate.svelte-e4n68z.svelte-e4n68z:hover{fill:grey;background:transparent}.default.svelte-e4n68z svg.svelte-e4n68z{display:inline-block}.leftMenuIcon.svelte-e4n68z.svelte-e4n68z{padding-top:8px;height:30px}.leftMenuIcon2.svelte-e4n68z.svelte-e4n68z{padding-top:4px;height:30px}.leftMenuTopMargin.svelte-e4n68z.svelte-e4n68z{margin-top:20px}.outer.svelte-e4n68z.svelte-e4n68z{display:inline-block;cursor:pointer}.arrowRight.svelte-e4n68z.svelte-e4n68z{fill:white;display:inline-block;width:30px;text-align:center;vertical-align:-5px}.comboList.svelte-e4n68z.svelte-e4n68z{vertical-align:-4px;margin-left:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5zdmVsdGUiLCJzb3VyY2VzIjpbIkljb24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBcdGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYW1lPVwiXCJcclxuICAgICAgICBleHBvcnQgbGV0IHN0YXRlPVwiXCJcclxuICAgICAgICBleHBvcnQgbGV0IGRlYWN0aXZhdGU9XCJcIlxyXG4gICAgICAgIGxldCBhY3RpdmVDbGFzcz1cIlwiXHJcbiAgICAgICAgaWYgKHN0YXRlPT09bmFtZSkgYWN0aXZlQ2xhc3M9XCIgYWN0aXZlXCJcclxuICAgICAgICBpZiAoZGVhY3RpdmF0ZT09PVwiZGVhY3RpdmF0ZVwiKSBhY3RpdmVDbGFzcz1cIiBkZWFjdGl2YXRlXCJcclxuXHJcbiAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcclxuICAgICAgICBsZXQgaWNvbnNJbmZvPXtcclxuICAgICAgICAgICAgXCJkb3duXCI6e2NsYXNzOlwiZGVmYXVsdFwifSwgXHJcbiAgICAgICAgICAgIFwidXBcIjp7Y2xhc3M6XCJkZWZhdWx0XCJ9LFxyXG4gICAgICAgICAgICBcImNsb3NlXCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb25cIn0sXHJcbiAgICAgICAgICAgIFwibGlzdFwiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uXCJ9LFxyXG4gICAgICAgICAgICBcImFycm93UmlnaHRcIjp7Y2xhc3M6XCIgYXJyb3dSaWdodCBcIn0sXHJcbiAgICAgICAgICAgIFwiY29tYm9MaXN0XCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb24yIGNvbWJvTGlzdFwifSxcclxuICAgICAgICAgICAgXCJyZW1vdmVGcm9tTGlzdFwiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uXCJ9LFxyXG4gICAgICAgICAgICBcInByb3BlcnRpZXNcIjp7Y2xhc3M6XCJkZWZhdWx0IGxlZnRNZW51SWNvbjIgbGVmdE1lbnVUb3BNYXJnaW5cIn0sXHJcbiAgICAgICAgICAgIFwiZWRpdEZvcm1cIjp7Y2xhc3M6XCJkZWZhdWx0IGxlZnRNZW51SWNvbjIgbGVmdE1lbnVUb3BNYXJnaW5cIn0sXHJcbiAgICAgICAgICAgIFwiZWRpdFJ1bGVzXCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb24yIGxlZnRNZW51VG9wTWFyZ2luXCJ9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaW5mbz1pY29uc0luZm9bbmFtZV1cclxuICAgICAgICBsZXQgY2xhc3NOYW1lPVwib3V0ZXJcIlxyXG4gICAgICAgIGlmIChpbmZvKSBjbGFzc05hbWU9aW5mby5jbGFzc1xyXG4gICAgICAgIGNsYXNzTmFtZSs9YWN0aXZlQ2xhc3NcclxuPC9zY3JpcHQ+XHJcbjwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbjxkaXYgY2xhc3M9e2NsYXNzTmFtZX0gIG9uOm1vdXNlZG93bj17KGUpID0+IHsgZGlzcGF0Y2goXCJtb3VzZWRvd25cIixlKSB9fSAgb246Y2xpY2s9eyhlKSA9PiB7IGRpc3BhdGNoKFwiY2xpY2tcIixlKSB9fSAgICA+XHJcbiAgICB7I2lmIG5hbWU9PT1cIm1vdmVcIn1cclxuICAgICAgICA8c3ZnICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIiNGRkZcIlxyXG4gICAgICAgIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIlxyXG4gICAgICAgIGlkPVwiZHJhZ01vZGVsTWFuYWdlclRvcEJhckljb25cIiBjdXJzb3I9XCJtb3ZlXCI+XHJcbiAgICAgICAgPHBhdGggZD1cIk05IDVtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwXCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNOSAxMm0tMSAwYTEgMSAwIDEgMCAyIDBhMSAxIDAgMSAwIC0yIDBcIj48L3BhdGg+XHJcbiAgICAgICAgPHBhdGggZD1cIk05IDE5bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTE1IDVtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwXCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNMTUgMTJtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwXCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNMTUgMTltLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwXCI+PC9wYXRoPlxyXG4gICAgICAgIDwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwiZG93blwifVxyXG4gICAgICAgIDxzdmcgIHZpZXdCb3g9XCIwIDAgMzIwIDUxMlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiAgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCI+PHBhdGggZD1cIk0zMTAuNiAyNDYuNmwtMTI3LjEgMTI4QzE3Ni40IDM4MC45IDE2OC4yIDM4NCAxNjAgMzg0cy0xNi4zOC0zLjEyNS0yMi42My05LjM3NWwtMTI3LjEtMTI4Qy4yMjQ0IDIzNy41LTIuNTE2IDIyMy43IDIuNDM4IDIxMS44UzE5LjA3IDE5MiAzMiAxOTJoMjU1LjFjMTIuOTQgMCAyNC42MiA3Ljc4MSAyOS41OCAxOS43NVMzMTkuOCAyMzcuNSAzMTAuNiAyNDYuNnpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJ1cFwifVxyXG4gICAgICAgIDxzdmcgIHZpZXdCb3g9XCIwIDAgMzIwIDUxMlwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiAgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCI+PHBhdGggZD1cIk05LjM5IDI2NS40bDEyNy4xLTEyOEMxNDMuNiAxMzEuMSAxNTEuOCAxMjggMTYwIDEyOHMxNi4zOCAzLjEyNSAyMi42MyA5LjM3NWwxMjcuMSAxMjhjOS4xNTYgOS4xNTYgMTEuOSAyMi45MSA2Ljk0MyAzNC44OFMzMDAuOSAzMjAgMjg3LjEgMzIwSDMyLjAxYy0xMi45NCAwLTI0LjYyLTcuNzgxLTI5LjU4LTE5Ljc1Uy4yMzMzIDI3NC41IDkuMzkgMjY1LjR6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwic2F2ZVwifVxyXG4gICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjNcIiBoZWlnaHQ9XCIyM1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cIndoaXRlXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwidGFibGVyLWljb24gdGFibGVyLWljb24tZGV2aWNlLWZsb3BweVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGZvY3VzYWJsZT1cImZhbHNlXCI+PHBhdGggZD1cIk02IDRoMTBsNCA0djEwYTIgMiAwIDAgMSAtMiAyaC0xMmEyIDIgMCAwIDEgLTIgLTJ2LTEyYTIgMiAwIDAgMSAyIC0yXCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTIgMTRtLTIgMGEyIDIgMCAxIDAgNCAwYTIgMiAwIDEgMCAtNCAwXCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTQgNGwwIDRsLTYgMGwwIC00XCI+PC9wYXRoPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwiR3lyZVwifVxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxyXG4gICAgICAgIDxpbWcgc3JjPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCNEFBQUFkQ0FNQUFBQ0tlaXcrQUFBQy9WQk1WRVVBQUFBZlExRkpORVE0VFZFZlBGY3NkNU1nU0dFZVNscHpmNWMrc01nWGlhOFhUMjB2Z3BjbU9GRWROVTBZWW9XalEycE1UMm9nYW5KZUxVeFpOMEJPU2xBY2svaDFocWNrNVBaUVhuMGJMRVFvdGRjVUd5MUgrLzhVZktoQWdkM3FpTGM4MXVndnlONGpkOHJwV29zbk0wMUVvTEZKd2MzV2NhTllYMkltdDhoNmU0WkRlcmUzdmMyc3NiOGZncDZaSFZodWM0QWxpNkpSZHAyb1dFQ0prSmtKUm10Q1NWQW9RRmw0ZTM4bWRuMWxaMklrUGxxa1ZQOEhrdjhHQlJBQWgvODhZV29ORHgxSy92ODcrZjhCeGY4SmZmL2hrUG9OUisvL2M1TXNVRm9mTmtjVEdDZ0JBQVZuLy85WC8vOHgvUDhiN3Y5YTMvOGF6djhEcC8vVGdQK2FUUCs1UmYrd1FQOE56djRmMnYyL2FQM2ttUHc3NHZ2SmVmczEydm00MmZrQmJ1N3lqT2l1dGRZRlE5VG9uOU1DTTg3c1dNdnVhTXJqYnNZQ0pMTlVNcEVLRzMvN1YzQWZRRzh0VVd4MEFHVW5TMk0wUmxVblFWUnZBRk1uTkZBY0xFai9uajRXS0RvVEhEZ1dJalVVSVN6K3d3MTcvLzgyOFA4ejdQOE01Ly9RNXY5cTNQLzExUDhBdlA4QXNmL2xvdi8vbmY5QW12Ly9iUCs2VHYvL1J2K2lSZjhOVnY1SDZ2MVl6LzNTaVAySTRmeG10ZnpZdC92cXl2Z2FtL2NBZ3ZlZWR2ZTRZUGFSMHZWcDBQUlp4UFJCeGZLeVN2R2h6UEJBci9EL2Mrd0h1T3NEVStya2xPblhhdW5LV2VuQ2hlVFJSdU9UbitJOGlPQ1V6ZDNsVWR6L2xOdi90dHJhY3RxMXFOa1psdGNCWmRRWGhOSS91ZEdNeHRCcHFzL1NlczN1aE1jQ1lNZi80c0xMWThFa1lzRUdQYjBTZTdwbFNiam1WYmUyYzdiaWxyVWZpN1AxYWJEL1M2L3JTcTF0WEt3b1E2ejFzS1NkVEtUMHM2RnZmNkJMZFo3V1o1NXBaNTR1aEpzR0hwZjRVcFhhb3BNc2dwTExBSkw2WTQraUFJN2pSWXZrQUluRkpvYzBlb2I4YUlNY09ZSjRJb0pEVm9EMHdYOVdKSDRSTEhqelBuZkpQblRvWFhCTkFIQ2JFMndUSjJsaGptTnhvR0lnT1dHdEkyQmhpbDJhRVZTZkpGS1JDMUgvdFV5WkFFdi9nMHBuZDBobkFFUE1uenIvdGlmL3B5Yi9pU0NZaUJUL3BBRG1uZ0RTbXdERmtRRC9qUUROTjNON0FBQUFQWFJTVGxNQUdSQUtrM3czS2RxL2xaV05lM0ZuWDBoRFF4c1YvZjM2K3ZyMjl2THQ1K0hnMmRIUHk4bkV3NzJwbXBpVGpJeUtmWGh5Y1cxallGcFhOU1FkMGxTMnZRQUFBY2hKUkVGVUtNOWlvQ0l3VXVQUnNzSXBxKzhYMnlDaHhJaExtdE12S3BDVmdSbTdKQnU3dXZPc0pqWWNXaG1OZVRoZFpqYXpZcGNWWmRTUlh6ay9QcUZSaUlFSml6US9sM0pILzZUcFN4Y3NFOFFpeXk2OWQ0NUxRRzFDMHVMMnRTYm9rc3lNUW5LYlhhTG1uYno3SVB2WStwMHFBdWptY3g5eWRrMSs5dVh0dS9jbFQvZE42ZFJBODUxWnJHdlEyWSs1VnoxdlAzbGRrajI1VzBFVTFXWDFyUk92UDhxWTY1NlU0Zm00NEZ6YjZqWEN5TktzZGE1YmN2ZUhBUlk5SWM1MmllZk5nbFZCbVNKSXNpSmJneU5mL2xodUc1TjZJc1oyM2NWckI1eFhDQ0JrcmJYUFRBMjgvQ3ZkTnZSZ3phbFEyOE5YZHZuUE5rQzQzcFNqYUxlZHc4OXY0YmJ1bDFMZGJUTnZiT3VMUjdKYjkzUnBmcHJkeGo4ZndudWk0MmFFSFQyU3ZGQVd5V285OGNxaU94NTJPLzdXYk8rS2lFai9kSDlEZ0NLU3RDVkhXWlZqam9kZDR1ZmYzOHZMLzMzZEZPblBoUnlvaHZlY2lvSHliZzZKdDk2OE9EK3RKVmdNSmMwd1NWYmFlemsreitwMWMzQ3dDd2x4VzRTV0tzeExuWHlMSGZNZlhzaEtTMG5aY3h3alVua3I3SDJyQzcyOEN2UHlYbmxyWXNhNFJabVB2YTlUaGJkM3RZOHF0dVRFeENKVjVXUnY3eVBEaXlNMXN2T3hjTFB3MlJDZmJRQnVPNTMwYk84Y0d3QUFBQUJKUlU1RXJrSmdnZz09XCI+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJsaXN0XCJ9XHJcbiAgICAgICAgPHN2ZyAgdmlld0JveD1cIjAgMCAxNCAxNFwiICB3aWR0aD1cIjE1XCIgaGVpZ2h0PVwiMTVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIm0xIDkuNjI2MjcxNWgxMnYyLjY4MzcxOTVoLTEyem0wLTMuOTA5ODQ0aDEydjIuNjgyODhoLTEyem0wLTQuMDI2NDE4aDEydjIuNjg0NTU4aC0xMnpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJwcm9wZXJ0aWVzXCJ9XHJcbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDE0IDE0XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtMy42NTgwNzAzIDEwLjgxNjE0MnEwLS4xODk3NzktLjEzODgyODMtLjMyODYwNy0uMTM4ODI4My0uMTM4ODI4LS4zMjg2MDctLjEzODgyOC0uMTg5Nzc4OCAwLS4zMjg2MDcxLjEzODgyOC0uMTM4ODI4My4xMzg4MjgtLjEzODgyODMuMzI4NjA3IDAgLjE4OTc3OS4xMzg4MjgzLjMyODYwNy4xMzg4MjgzLjEzODgyOC4zMjg2MDcxLjEzODgyOC4xODk3Nzg3IDAgLjMyODYwNy0uMTM4ODI4LjEzODgyODMtLjEzODgyOC4xMzg4MjgzLS4zMjg2MDd6bTQuNzAzODAxOC0zLjA2NzMxMDYtNC45ODA5OTEgNC45ODA5OTA2cS0uMjcwMTc3Ni4yNzAxNzgtLjY1NzIxNC4yNzAxNzgtLjM3OTU1NzUgMC0uNjY0NjkzMS0uMjcwMTc4bC0uNzc0MDcyOS0uNzg4NTYzcS0uMjc3NjU2Ni0uMjYyNjk5LS4yNzc2NTY2LS42NTcyMTQgMC0uMzg3MDM3LjI3NzY1NjYtLjY2NDY5M2w0Ljk3Mzk3OTQtNC45NzM5Nzk2cS4yODQ2NjgxLjcxNTY0MzUuODM2MjQxOCAxLjI2NzIxNzIuNTUxNTczNy41NTE1NzM3IDEuMjY3MjE3Mi44MzYyNDE4em00LjYzMDQxMzktMy4xNzcxNThxMCAuMjg0NjY4MS0uMTY3ODA4Ljc3NDA3MjktLjM0MzA5OS45Nzg4MDk2LTEuMjAxMzEgMS41ODgzNDUzLS44NTgyMTEuNjA5NTM1Ny0xLjg4Nzk3MDkuNjEwMDAzMS0xLjM1MTM1NTUgMC0yLjMxMTQ2NzctLjk2MDU3OTYtLjk2MDExMjItLjk2MDU3OTYtLjk2MDU3OTYtMi4zMTE0Njc3LS4wMDA0Njc1LTEuMzUwODg4Mi45NjA1Nzk2LTIuMzExNDY3OC45NjEwNDctLjk2MDU3OTYgMi4zMTE0Njc3LS45NjA1Nzk2LjQyMzQ5NTkgMCAuODg3MTkxOS4xMjA1OTgzLjQ2MzY5Ni4xMjA1OTgzLjc4NTI5Mi4zMzk4MjU1LjExNjg1OS4wODAzOTkuMTE2ODU5LjIwNDczNjcgMCAuMTI0MzM3OC0uMTE2ODU5LjIwNDczNjdsLTIuMTM5OTE5MiAxLjIzNDQ5Njd2MS42MzYwMjM3bDEuNDA5Nzg1Mi43ODE1NTE5cS4wMzY0Ni0uMDIxOTY5LjU3NjgxNC0uMzU0MzE2LjU0MDM1Ni0uMzMyMzQ2Ni45ODk1NjItLjU5MTc3MzIuNDQ5MjA0LS4yNTk0MjY2LjUxNTExNC0uMjU5NDI2Ni4xMDkzNzkgMCAuMTcxNTQ4LjA3MjkyLjA2MjE3LjA3MjkyLjA2MjE3LjE4Mjc2NzN6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwiZWRpdEZvcm1cIn1cclxuICAgICAgICA8c3ZnICB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBhcmlhLWhpZGRlbj1cInRydWVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAxNCAxNFwiPjxwYXRoIGQ9XCJtIDEuMTk5Nzk5NSwxMi45OTM5MTYgYyAtMC4wNzkwMzQsLTAuMDIzIC0wLjE2NDA3MSwtMC4xMDkzIC0wLjE4Nzk4MTMsLTAuMTkxNCAtMC4wMTIwMDUsLTAuMDQyIC0wLjAxMzAwNiwtMC42ODk1IC0wLjAxMTAwNSwtNS44MjEwMDAzIGwgMCwtNS43NzQgMC4wMjIwMSwtMC4wNDUgYyAwLjAyODAxMiwtMC4wNTcgMC4wODMwMzYsLTAuMTExNyAwLjE0MDE2MDYsLTAuMTQwMSBsIDAuMDQ1MDE5LC0wLjAyMiA1Ljc5MjIwNDEsMCA1Ljc5MjMwNDEsMCAwLjA1MTAyLDAuMDI1IGMgMC4wNTYwMiwwLjAyNyAwLjEwMzY0NSwwLjA3NSAwLjEzNTQ1OSwwLjEzNDUgbCAwLjAyMTAxLDAuMDM5IDAsNS43ODMyIGMgMCw1LjM3NjUwMDMgMCw1Ljc4NjYwMDMgLTAuMDEzMDEsNS44MzExMDAzIC0wLjAxOTAxLDAuMDYgLTAuMDc5MDMsMC4xMjkxIC0wLjE0MTc2MSwwLjE2MjEgbCAtMC4wNDYwMiwwLjAyNCAtNS43ODc3MDIzLDAgYyAtMy40NTYyOTQyLDllLTQgLTUuNzk5MjA3LDAgLTUuODE2MDE0MywtMC4wMSB6IG0gMTEuMjM2NjU3NSwtNS45OTE5MDAzIDAsLTUuNDM0MiAtNS40MzE5NDgxLDAgLTUuNDMxODQ4MiwwIDAsNS40MjI5IGMgMCwyLjk4MjYgLTQuMDAyZS00LDUuNDI4MDAwMyAwLDUuNDM0MjAwMyAwLDAuMDEgMS4wOTkwNzUxLDAuMDExIDUuNDM2NTUwMiwwLjAxMSBsIDUuNDMyMTQ4MSwwIDAsLTUuNDM0MjAwMyB6IG0gLTYuODYxOTY2MywzLjcxODEwMDMgMCwtMC44NjAzMDAzIDAuODU1NzY5OSwwIDAuODU1NzcsMCAwLDAuODYwMzAwMyAwLDAuODYwMyAtMC44NTU3NywwIC0wLjg1NTc2OTksMCAwLC0wLjg2MDMgeiBtIDEuMTQzOTk0NSwwIDAsLTAuMjgzOCAtMC4yODgyMjQ2LDAgLTAuMjg4MzI0NiwwIDAsMC4yODM4IDAsMC4yODM3IDAuMjg4MzI0NiwwIDAuMjg4MjI0NiwwIDAsLTAuMjgzNyB6IG0gMS4xNDQwOTQ3LDAgMCwtMC4yODM4IDEuNzE2MDQxOCwwIDEuNzE2MDQxMywwIDAsMC4yODM4IDAsMC4yODM3IC0xLjcxNjA0MTMsMCAtMS43MTYwNDE4LDAgMCwtMC4yODM3IHogbSAtMi4yODgwODkyLC0zLjE0ODMwMDMgMCwtMS4xNDQxIDIuODYwMDM2NCwwIDIuODYwMTM1OSwwIDAsMS4xNDQxIDAsMS4xNDM5IC0yLjg2MDEzNTksMCAtMi44NjAwMzY0LDAgMCwtMS4xNDM5IHogbSA1LjE0MzYyMzMsMCAwLC0wLjU3MjEgLTIuMjg4MDg4OCwwIC0yLjI4ODA4OTIsMCAwLDAuNTY2MSBjIDAsMC4zMTEzIDAsMC41Njg3IDAuMDEwMDA0LDAuNTcyIDAsMCAxLjAzMjk0NjYsMC4wMSAyLjI4ODA4OTIsMC4wMSBsIDIuMjgyMDg2OCwwIDAsLTAuNTcyIHogbSAtNy45OTkyNTc4LDAgMCwtMC4yODg0IDEuMTM5NTkyNywwIDEuMTM5NDkyNSwwIDAsMC4yODg0IDAsMC4yODgyIC0xLjEzOTQ5MjUsMCAtMS4xMzk1OTI3LDAgMCwtMC4yODgyIHogbSAyLjg1NTYzNDUsLTMuNDMyMSAwLC0xLjE0NDEgMi44NjAwMzY0LDAgMi44NjAxMzU5LDAgMCwxLjE0NDEgMCwxLjE0NCAtMi44NjAxMzU5LDAgLTIuODYwMDM2NCwwIDAsLTEuMTQ0IHogbSA1LjE0MzYyMzMsMCAwLC0wLjU3MjEgLTIuMjg4MDg4OCwwIC0yLjI4ODA4OTIsMCAwLDAuNTY2MSBjIDAsMC4zMTEyIDAsMC41Njg2IDAuMDEwMDA0LDAuNTcxOSAwLDAgMS4wMzI5NDY2LDAuMDEgMi4yODgwODkyLDAuMDEgbCAyLjI4MjA4NjgsMCAwLC0wLjU3MTkgeiBtIC03Ljk5OTI1NzgsMCAwLC0wLjI4MzkgMS4xMzk1OTI3LDAgMS4xMzk0OTI1LDAgMCwwLjI4MzkgMCwwLjI4MzcgLTEuMTM5NDkyNSwwIC0xLjEzOTU5MjcsMCAwLC0wLjI4MzcgelwiLz48L3N2Zz5cclxuICAgIHsvaWZ9ICAgIFxyXG4gICAgeyNpZiBuYW1lPT09XCJlZGl0UnVsZXNcIn1cclxuICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMTQgMTRcIiAgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtNi42IDYuOTk2OTI1cTAtLjY2MjUtLjQ2ODc1LTEuMTMxMjUtLjQ2ODc1LS40Njg3NS0xLjEzMTI1LS40Njg3NS0uNjYyNSAwLTEuMTMxMjUuNDY4NzUtLjQ2ODc1LjQ2ODc1LS40Njg3NSAxLjEzMTI1IDAgLjY2MjUuNDY4NzUgMS4xMzEyNS40Njg3NS40Njg3NSAxLjEzMTI1LjQ2ODc1LjY2MjUgMCAxLjEzMTI1LS40Njg3NS40Njg3NS0uNDY4NzUuNDY4NzUtMS4xMzEyNXptNC44IDMuMnEwLS4zMjUtLjIzNzUtLjU2MjUtLjIzNzUtLjIzNzUtLjU2MjUtLjIzNzUtLjMyNSAwLS41NjI1LjIzNzUtLjIzNzUuMjM3NS0uMjM3NS41NjI1IDAgLjMzMTI1LjIzNDM4LjU2NTYyLjIzNDM3LjIzNDM4LjU2NTYyLjIzNDM4LjMzMTI1IDAgLjU2NTYyLS4yMzQzOC4yMzQzOC0uMjM0MzcuMjM0MzgtLjU2NTYyem0wLTYuNHEwLS4zMjUtLjIzNzUtLjU2MjUtLjIzNzUtLjIzNzUtLjU2MjUtLjIzNzUtLjMyNSAwLS41NjI1LjIzNzUtLjIzNzUuMjM3NS0uMjM3NS41NjI1IDAgLjMzMTI1LjIzNDM4LjU2NTYzLjIzNDM3LjIzNDM3LjU2NTYyLjIzNDM3LjMzMTI1IDAgLjU2NTYyLS4yMzQzNy4yMzQzOC0uMjM0MzguMjM0MzgtLjU2NTYzem0tMi40IDIuNjMxMjV2MS4xNTYyNXEwIC4wNjI1LS4wNDM4LjEyMTg4LS4wNDM4LjA1OTQtLjEuMDY1NmwtLjk2ODc1LjE1cS0uMDY4OC4yMTg3NS0uMi40NzUuMjEyNS4zLjU2MjUuNzE4NzUuMDQzOC4wNjI1LjA0MzguMTI1IDAgLjA3NS0uMDQzOC4xMTg3NS0uMTQzNzUuMTg3NS0uNTE1NjMuNTU5MzctLjM3MTg3LjM3MTg4LS40OTA2Mi4zNzE4OC0uMDY4OCAwLS4xMzEyNS0uMDQzOGwtLjcxODc1LS41NjI1cS0uMjMxMjUuMTE4NzUtLjQ4MTI1LjE5Mzc1LS4wNjg3LjY3NS0uMTQzNzUuOTY4NzUtLjA0MzguMTUtLjE4NzUuMTVoLTEuMTYyNXEtLjA2ODggMC0uMTI1LS4wNDY5LS4wNTYzLS4wNDY5LS4wNjI1LS4xMDkzOGwtLjE0Mzc1LS45NTYyNXEtLjIxMjUtLjA2MjUtLjQ2ODc1LS4xOTM3NWwtLjczNzUuNTU2MjVxLS4wNDM3LjA0MzgtLjEyNS4wNDM4LS4wNjg3IDAtLjEzMTI1LS4wNS0uOS0uODMxMjUtLjktMSAwLS4wNTYzLjA0Mzc1LS4xMTg3NS4wNjI1LS4wODc1LjI1NjI1LS4zMzEyNS4xOTM3NS0uMjQzNzUuMjkzNzUtLjM4MTI1LS4xNDM3NS0uMjc1LS4yMTg3NS0uNTEyNWwtLjk1LS4xNXEtLjA2MjUtLjAwNi0uMTA2MjUtLjA1OTQtLjA0MzctLjA1MzA1LS4wNDM3LS4xMjE4di0xLjE1NjI1cTAtLjA2MjUuMDQzNzUtLjEyMTg4LjA0Mzc1LS4wNTk0LjEtLjA2NTZsLjk2ODc1LS4xNXEuMDY4OC0uMjE4NzUuMi0uNDc1LS4yMTI1LS4zLS41NjI1LS43MTg3NS0uMDQzNzUtLjA2ODgtLjA0Mzc1LS4xMjUgMC0uMDc1LjA0Mzc1LS4xMjUuMTM3NS0uMTg3NS41MTI1LS41NTYyNS4zNzUtLjM2ODc1LjQ5Mzc1LS4zNjg3NS4wNjg4IDAgLjEzMTI1LjA0MzdsLjcxODc1LjU2MjVxLjIxMjUtLjExMjUuNDgxMjUtLjIuMDY4Ny0uNjc1LjE0Mzc1LS45NjI1LjA0MzgtLjE1LjE4NzUtLjE1aDEuMTYyNXEuMDY4OCAwIC4xMjUuMDQ2OS4wNTYzLjA0NjkuMDYyNS4xMDkzN2wuMTQzNzUuOTU2MjVxLjIxMjUuMDYyNS40Njg3NS4xOTM3NWwuNzM3NS0uNTU2MjVxLjA1LS4wNDM3LjEyNS0uMDQzNy4wNjg3IDAgLjEzMTI1LjA1LjkuODMxMjUuOSAxIDAgLjA1NjItLjA0MzguMTE4NzUtLjA3NS4xLS4yNjI1LjMzNzUtLjE4NzUuMjM3NS0uMjgxMjUuMzc1LjE0Mzc1LjMuMjEyNS41MTI1bC45NS4xNDM3NXEuMDYyNS4wMTI1LjEwNjI1LjA2NTYuMDQzOC4wNTMxLjA0MzguMTIxODd6bTQgMy4zMzEyNXYuODc1cTAgLjEtLjkzMTI1LjE5Mzc1LS4wNzUuMTY4NzUtLjE4NzUuMzI1LjMxODc1LjcwNjI1LjMxODc1Ljg2MjUgMCAuMDI1LS4wMjUuMDQzNy0uNzYyNS40NDM3NS0uNzc1LjQ0Mzc1LS4wNSAwLS4yODc1LS4yOTM3NS0uMjM3NS0uMjkzNzUtLjMyNS0uNDI1LS4xMjUuMDEyNS0uMTg3NS4wMTI1LS4wNjI1IDAtLjE4NzUtLjAxMjUtLjA4NzUuMTMxMjUtLjMyNS40MjUtLjIzNzUuMjkzNzUtLjI4NzUuMjkzNzUtLjAxMjUgMC0uNzc1LS40NDM3NS0uMDI1LS4wMTg3LS4wMjUtLjA0MzcgMC0uMTU2MjUuMzE4NzUtLjg2MjUtLjExMjUtLjE1NjI1LS4xODc1LS4zMjUtLjkzMTI1LS4wOTM3LS45MzEyNS0uMTkzNzV2LS44NzVxMC0uMS45MzEyNS0uMTkzNzUuMDgxMy0uMTgxMjUuMTg3NS0uMzI1LS4zMTg3NS0uNzA2MjUtLjMxODc1LS44NjI1IDAtLjAyNS4wMjUtLjA0MzguMDI1LS4wMTI1LjIxODc1LS4xMjUuMTkzNzUtLjExMjUuMzY4NzUtLjIxMjUuMTc1LS4xLjE4NzUtLjEuMDUgMCAuMjg3NS4yOTA2My4yMzc1LjI5MDYyLjMyNS40MjE4Ny4xMjUtLjAxMjUuMTg3NS0uMDEyNS4wNjI1IDAgLjE4NzUuMDEyNS4zMTg3NS0uNDQzNzUuNTc1LS43bC4wMzc1LS4wMTI1cS4wMjUgMCAuNzc1LjQzNzUuMDI1LjAxODguMDI1LjA0MzggMCAuMTU2MjUtLjMxODc1Ljg2MjUuMTA2MjUuMTQzNzUuMTg3NS4zMjUuOTMxMjUuMDkzNy45MzEyNS4xOTM3NXptMC02LjR2Ljg3NXEwIC4xLS45MzEyNS4xOTM3NS0uMDc1LjE2ODc1LS4xODc1LjMyNS4zMTg3NS43MDYyNS4zMTg3NS44NjI1IDAgLjAyNS0uMDI1LjA0MzgtLjc2MjUuNDQzNzUtLjc3NS40NDM3NS0uMDUgMC0uMjg3NS0uMjkzNzUtLjIzNzUtLjI5Mzc1LS4zMjUtLjQyNS0uMTI1LjAxMjUtLjE4NzUuMDEyNS0uMDYyNSAwLS4xODc1LS4wMTI1LS4wODc1LjEzMTI1LS4zMjUuNDI1LS4yMzc1LjI5Mzc1LS4yODc1LjI5Mzc1LS4wMTI1IDAtLjc3NS0uNDQzNzUtLjAyNS0uMDE4OC0uMDI1LS4wNDM4IDAtLjE1NjI1LjMxODc1LS44NjI1LS4xMTI1LS4xNTYyNS0uMTg3NS0uMzI1LS45MzEyNS0uMDkzNy0uOTMxMjUtLjE5Mzc1di0uODc1cTAtLjEuOTMxMjUtLjE5Mzc1LjA4MTMtLjE4MTI1LjE4NzUtLjMyNS0uMzE4NzUtLjcwNjI1LS4zMTg3NS0uODYyNSAwLS4wMjUuMDI1LS4wNDM4LjAyNS0uMDEyNS4yMTg3NS0uMTI1LjE5Mzc1LS4xMTI1LjM2ODc1LS4yMTI1LjE3NS0uMS4xODc1LS4xLjA1IDAgLjI4NzUuMjkwNjIuMjM3NS4yOTA2My4zMjUuNDIxODguMTI1LS4wMTI1LjE4NzUtLjAxMjUuMDYyNSAwIC4xODc1LjAxMjUuMzE4NzUtLjQ0Mzc1LjU3NS0uN2wuMDM3NS0uMDEyNXEuMDI1IDAgLjc3NS40Mzc1LjAyNS4wMTg4LjAyNS4wNDM4IDAgLjE1NjI1LS4zMTg3NS44NjI1LjEwNjI1LjE0Mzc1LjE4NzUuMzI1LjkzMTI1LjA5MzcuOTMxMjUuMTkzNzV6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn0gICAgXHJcbiAgICB7I2lmIG5hbWU9PT1cImNsb3NlXCJ9XHJcbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDE0IDE0XCIgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtMTIgMTAuMDQ3MTQycTAgLjMzNjctLjIzNTY5Mi41NzIzODNsLTEuMTQ0NzgzIDEuMTQ0NzgzcS0uMjM1NjgzLjIzNTY5Mi0uNTcyMzgzLjIzNTY5Mi0uMzM2NzAwMyAwLS41NzIzOTItLjIzNTY5MmwtMi40NzQ3NS0yLjQ3NDc1LTIuNDc0NzUgMi40NzQ3NXEtLjIzNTY5MTcuMjM1NjkyLS41NzIzOTE3LjIzNTY5Mi0uMzM2NyAwLS41NzIzODMzLS4yMzU2OTJsLTEuMTQ0NzgzMy0xLjE0NDc4M3EtLjIzNTY5MTctLjIzNTY4My0uMjM1NjkxNy0uNTcyMzgzIDAtLjMzNjcuMjM1NjkxNy0uNTcyMzkybDIuNDc0NzUtMi40NzQ3NS0yLjQ3NDc1LTIuNDc0NzVxLS4yMzU2OTE3LS4yMzU2OTE3LS4yMzU2OTE3LS41NzIzOTE3IDAtLjMzNjcuMjM1NjkxNy0uNTcyMzgzM2wxLjE0NDc4MzMtMS4xNDQ3ODMzcS4yMzU2ODMzLS4yMzU2OTE3LjU3MjM4MzMtLjIzNTY5MTcuMzM2NyAwIC41NzIzOTE3LjIzNTY5MTdsMi40NzQ3NSAyLjQ3NDc1IDIuNDc0NzUtMi40NzQ3NXEuMjM1NjkxNy0uMjM1NjkxNy41NzIzOTItLjIzNTY5MTcuMzM2NyAwIC41NzIzODMuMjM1NjkxN2wxLjE0NDc4MyAxLjE0NDc4MzNxLjIzNTY5Mi4yMzU2ODMzLjIzNTY5Mi41NzIzODMzIDAgLjMzNjctLjIzNTY5Mi41NzIzOTE3bC0yLjQ3NDc0OTcgMi40NzQ3NSAyLjQ3NDc0OTcgMi40NzQ3NXEuMjM1NjkyLjIzNTY5Mi4yMzU2OTIuNTcyMzkyelwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImFycm93UmlnaHRcIn1cclxuICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMTQgMTRcIiAgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtOC41Nzg5NDcgMy4zMDU1MXYyLjQzMTMzMmgtNy41Nzg5NDd2Mi41MjYzMTZoNy41Nzg5NDd2Mi40MzEzMzJsNC40MjEwNTMtMy42OTQ0OXpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJyZW1vdmVGcm9tTGlzdFwifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3R5bGU9XCJmaWxsOnJlZFwiPjxwYXRoIGQ9XCJtNS40OTk5Mzc3IDUuNzUwMTk3OXY0LjUwMDE4NzFxMCAuMTA5NTA1LS4wNzA1MDMuMTc5NTA4LS4wNzA1MDMuMDctLjE3OTUwNzQuMDcwNWgtLjUwMDAyMDlxLS4xMDk1MDQ1IDAtLjE3OTUwNzUtLjA3MDUtLjA3MDAwMy0uMDcwNS0uMDcwNTAzLS4xNzk1MDh2LTQuNTAwMTg3MXEwLS4xMDk1MDQ1LjA3MDUwMy0uMTc5NTA3NS4wNzA1MDMtLjA3MDAwMy4xNzk1MDc1LS4wNzA1MDNoLjUwMDAyMDlxLjEwOTUwNDUgMCAuMTc5NTA3NC4wNzA1MDMuMDcwMDAzLjA3MDUwMy4wNzA1MDMuMTc5NTA3NXptMi4wMDAwODMzIDB2NC41MDAxODcxcTAgLjEwOTUwNS0uMDcwNTAzLjE3OTUwOC0uMDcwNTAzLjA3LS4xNzk1MDc1LjA3MDVoLS41MDAwMjA3cS0uMTA5NTA0NiAwLS4xNzk1MDc1LS4wNzA1LS4wNzAwMDMtLjA3MDUtLjA3MDUwMy0uMTc5NTA4di00LjUwMDE4NzFxMC0uMTA5NTA0NS4wNzA1MDMtLjE3OTUwNzUuMDcwNTAzLS4wNzAwMDMuMTc5NTA3NS0uMDcwNTAzaC41MDAwMjA4cS4xMDk1MDQ2IDAgLjE3OTUwNzUuMDcwNTAzLjA3MDAwMy4wNzA1MDMuMDcwNTAzLjE3OTUwNzV6bTIuMDAwMDgzMyAwdjQuNTAwMTg3MXEwIC4xMDk1MDUtLjA3MDUwMy4xNzk1MDgtLjA3MDUwMy4wNy0uMTc5NTA3NS4wNzA1aC0uNTAwMDIwN3EtLjEwOTUwNDYgMC0uMTc5NTA3NS0uMDcwNS0uMDcwMDAzLS4wNzA1LS4wNzA1MDMtLjE3OTUwOHYtNC41MDAxODcxcTAtLjEwOTUwNDUuMDcwNTAzLS4xNzk1MDc1LjA3MDUwMy0uMDcwMDAzLjE3OTUwNzUtLjA3MDUwM2guNTAwMDIwOXEuMTA5NTA0NiAwIC4xNzk1MDc1LjA3MDUwMy4wNzAwMDMuMDcwNTAzLjA3MDUwMy4xNzk1MDc1em0xLjAwMDA0MTcgNS42NTY3MzYxdi03LjQwNjMwOWgtNy4wMDAyOTE3djcuNDA2MzA5cTAgLjE3MjAwNy4wNTQ1MDIuMzE2NTEzLjA1NDUwMi4xNDQ1MDYuMTEzNTA0Ny4yMTEwMDkuMDU5MDAzLjA2NjUuMDgyMDA0LjA2NjVoNi41MDAyNzFxLjAyMzUgMCAuMDgyLS4wNjY1LjA1ODUtLjA2NjUuMTEzNTA0LS4yMTEwMDkuMDU1LS4xNDQ1MDYuMDU0NS0uMzE2NTEzem0tNS4yNTAyMTg3LTguNDA2ODUwN2gzLjUwMDE0NThsLS4zNzUwMTU2LS45MTQwMzhxLS4wNTQ1MDIzLS4wNzA1MDMtLjEzMzAwNTYtLjA4NjAwMzZoLTIuNDc2NjAzMnEtLjA3ODAwMy4wMTU1MDEtLjEzMzAwNTUuMDg2MDA0em03LjI1MDMwMTcuMjUwMDEwNXYuNTAwMDIwOHEwIC4xMDk1MDQ2LS4wNzA1LjE3OTUwNzUtLjA3MDUuMDcwMDAzLS4xNzk1MDcuMDcwNTAzaC0uNzUwMDMxdjcuNDA2MzA4OXEwIC42NDg1MjctLjM2NzAxNiAxLjEyMTA0Ni0uMzY3MDE4LjQ3MjUyLS44ODMwMzkuNDcyNTJoLTYuNTAwMjcxMnEtLjUxNTUyMTUgMC0uODgzMDM2OC0uNDU3MDE5LS4zNjc1MTU0LS40NTcwMTktLjM2NzAxNTMtMS4xMDU1NDZ2LTcuNDM3ODFoLS43NTAwMzEzcS0uMTA5NTA0NiAwLS4xNzk1MDc1LS4wNzA1MDMtLjA3MDAwMjktLjA3MDUwMjktLjA3MDUwMjktLjE3OTUwNzR2LS41MDAwMjA5cTAtLjEwOTUwNDUuMDcwNTAzLS4xNzk1MDc0LjA3MDUwMy0uMDcwMDAzLjE3OTUwNzUtLjA3MDUwM2gyLjQxNDEwMDVsLjU0NzAyMjgtMS4zMDQ1NTQzcS4xMTcwMDQ5LS4yODkwMTIxLjQyMjAxNzYtLjQ5MjAyMDUuMzA1MDEyNy0uMjAzMDA4NS42MTcwMjU3LS4yMDMwMDg1aDIuNTAwMTA0MnEuMzEyNTEzIDAgLjYxNzAyNTcuMjAzMDA4NS4zMDQ1MTI3LjIwMzAwODQuNDIyMDE3Ni40OTIwMjA1bC41NDcwMjI3IDEuMzA0NTU0M2gyLjQxNDEwMDdxLjEwOTUwNCAwIC4xNzk1MDcuMDcwNTAzLjA3LjA3MDUwMy4wNzA1LjE3OTUwNzR6XCIvPjwvc3ZnPiAgICBcclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImNvbWJvTGlzdFwifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiICB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIm0xIDIuOGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyelwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbjwvZGl2PlxyXG5cclxuPHN0eWxlPlxyXG4gICAgLmRlZmF1bHQge1xyXG4gICAgICAgIGZpbGw6IHdoaXRlO1xyXG4gICAgICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjsgICAgICAgIFxyXG4gICAgICAgIHdpZHRoOiAzMHB4O1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIH1cclxuICAgIC5kZWZhdWx0OmhvdmVyLCAuYWN0aXZlIHtcclxuICAgICAgICBmaWxsOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRiNzRmO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgIH0gIFxyXG4gICAgLmRlYWN0aXZhdGUge1xyXG4gICAgICAgIGZpbGw6IGdyZXk7XHJcbiAgICAgICAgY3Vyc29yOiBkZWZhdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC5kZWFjdGl2YXRlOmhvdmVyIHtcclxuICAgICAgICBmaWxsOiBncmV5O1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC5kZWZhdWx0IHN2ZyB7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgfSAgXHJcbiAgICAubGVmdE1lbnVJY29uIHtcclxuICAgICAgICBwYWRkaW5nLXRvcDogOHB4O1xyXG4gICAgICAgIGhlaWdodDogMzBweDtcclxuICAgIH1cclxuICAgIC5sZWZ0TWVudUljb24yIHtcclxuICAgICAgICBwYWRkaW5nLXRvcDogNHB4O1xyXG4gICAgICAgIGhlaWdodDogMzBweDtcclxuICAgIH0gICAgXHJcblxyXG4gICAgLmxlZnRNZW51VG9wTWFyZ2luIHtcclxuICAgICAgICBtYXJnaW4tdG9wOiAyMHB4O1xyXG4gICAgfVxyXG4gICAgLm91dGVyIHtcclxuICAgICAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICB9XHJcbiAgICAuYXJyb3dSaWdodCB7XHJcbiAgICAgICAgZmlsbDogd2hpdGU7XHJcbiAgICAgICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgd2lkdGg6IDMwcHg7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiAtNXB4O1xyXG4gICAgfVxyXG4gICAgLmNvbWJvTGlzdCB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IC00cHg7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDEwcHg7XHJcbiAgICB9XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1GSSxvQ0FBUyxDQUNMLElBQUksQ0FBRSxLQUFLLENBQ1gsUUFBUSxZQUFZLENBQ3BCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsS0FBSyxDQUFFLElBQUksQ0FDWCxVQUFVLENBQUUsTUFDaEIsQ0FDQSxvQ0FBUSxNQUFNLENBQUUsbUNBQVEsQ0FDcEIsSUFBSSxDQUFFLEtBQUssQ0FDWCxnQkFBZ0IsQ0FBRSxPQUFPLENBQ3pCLGFBQWEsQ0FBRSxHQUNuQixDQUNBLHVDQUFZLENBQ1IsSUFBSSxDQUFFLElBQUksQ0FDVixNQUFNLENBQUUsT0FDWixDQUVBLHVDQUFXLE1BQU8sQ0FDZCxJQUFJLENBQUUsSUFBSSxDQUNWLFVBQVUsQ0FBRSxXQUNoQixDQUVBLHNCQUFRLENBQUMsaUJBQUksQ0FDVCxPQUFPLENBQUUsWUFDYixDQUNBLHlDQUFjLENBQ1YsV0FBVyxDQUFFLEdBQUcsQ0FDaEIsTUFBTSxDQUFFLElBQ1osQ0FDQSwwQ0FBZSxDQUNYLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLE1BQU0sQ0FBRSxJQUNaLENBRUEsOENBQW1CLENBQ2YsVUFBVSxDQUFFLElBQ2hCLENBQ0Esa0NBQU8sQ0FDSCxRQUFRLFlBQVksQ0FDcEIsTUFBTSxDQUFFLE9BQ1osQ0FDQSx1Q0FBWSxDQUNSLElBQUksQ0FBRSxLQUFLLENBQ1gsUUFBUSxZQUFZLENBQ3BCLEtBQUssQ0FBRSxJQUFJLENBQ1gsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsY0FBYyxDQUFFLElBQ3BCLENBQ0Esc0NBQVcsQ0FDUCxjQUFjLENBQUUsSUFBSSxDQUNwQixXQUFXLENBQUUsSUFDakIifQ== */");
    }

    // (32:4) {#if name==="move"}
    function create_if_block_12$1(ctx) {
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
    			add_location(path0, file$4, 35, 8, 1599);
    			attr_dev(path1, "d", "M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path1, file$4, 36, 8, 1665);
    			attr_dev(path2, "d", "M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path2, file$4, 37, 8, 1732);
    			attr_dev(path3, "d", "M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path3, file$4, 38, 8, 1799);
    			attr_dev(path4, "d", "M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path4, file$4, 39, 8, 1866);
    			attr_dev(path5, "d", "M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path5, file$4, 40, 8, 1934);
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
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 32, 8, 1350);
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
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(32:4) {#if name===\\\"move\\\"}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#if name==="down"}
    function create_if_block_11$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z");
    			add_location(path, file$4, 44, 95, 2141);
    			attr_dev(svg, "viewBox", "0 0 320 512");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 44, 8, 2054);
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
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(44:4) {#if name===\\\"down\\\"}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#if name==="up"}
    function create_if_block_10$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z");
    			add_location(path, file$4, 47, 95, 2495);
    			attr_dev(svg, "viewBox", "0 0 320 512");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 47, 8, 2408);
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
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(47:4) {#if name===\\\"up\\\"}",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#if name==="save"}
    function create_if_block_9$1(ctx) {
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
    			add_location(path0, file$4, 50, 265, 3019);
    			attr_dev(path1, "d", "M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0");
    			add_location(path1, file$4, 50, 351, 3105);
    			attr_dev(path2, "d", "M14 4l0 4l-6 0l0 -4");
    			add_location(path2, file$4, 50, 409, 3163);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "23");
    			attr_dev(svg, "height", "23");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "white");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "tabler-icon tabler-icon-device-floppy svelte-e4n68z");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			add_location(svg, file$4, 50, 8, 2762);
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
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(50:4) {#if name===\\\"save\\\"}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#if name==="Gyre"}
    function create_if_block_8$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAMAAACKeiw+AAAC/VBMVEUAAAAfQ1FJNEQ4TVEfPFcsd5MgSGEeSlpzf5c+sMgXia8XT20vgpcmOFEdNU0YYoWjQ2pMT2oganJeLUxZN0BOSlAck/h1hqck5PZQXn0bLEQotdcUGy1H+/8UfKhAgd3qiLc81ugvyN4jd8rpWosnM01EoLFJwc3WcaNYX2Imt8h6e4ZDere3vc2ssb8fgp6ZHVhuc4Ali6JRdp2oWECJkJkJRmtCSVAoQFl4e38mdn1lZ2IkPlqkVP8Hkv8GBRAAh/88YWoNDx1K/v87+f8Bxf8Jff/hkPoNR+//c5MsUFofNkcTGCgBAAVn//9X//8x/P8b7v9a3/8azv8Dp//TgP+aTP+5Rf+wQP8Nzv4f2v2/aP3kmPw74vvJefs12vm42fkBbu7yjOiutdYFQ9Ton9MCM87sWMvuaMrjbsYCJLNUMpEKG3/7V3AfQG8tUWx0AGUnS2M0RlUnQVRvAFMnNFAcLEj/nj4WKDoTHDgWIjUUISz+ww17//828P8z7P8M5//Q5v9q3P/11P8AvP8Asf/lov//nf9Amv//bP+6Tv//Rv+iRf8NVv5H6v1Yz/3SiP2I4fxmtfzYt/vqyvgam/cAgveedve4YPaR0vVp0PRZxPRBxfKySvGhzPBAr/D/c+wHuOsDU+rklOnXaunKWenCheTRRuOTn+I8iOCUzd3lUdz/lNv/ttractq1qNkZltcBZdQXhNI/udGMxtBpqs/Ses3uhMcCYMf/4sLLY8EkYsEGPb0Se7plSbjmVbe2c7bilrUfi7P1abD/S6/rSq1tXKwoQ6z1sKSdTKT0s6Fvf6BLdZ7WZ55pZ54uhJsGHpf4UpXaopMsgpLLAJL6Y4+iAI7jRYvkAInFJoc0eob8aIMcOYJ4IoJDVoD0wX9WJH4RLHjzPnfJPnToXXBNAHCbE2wTJ2lhjmNxoGIgOWGtI2Bhil2aEVSfJFKRC1H/tUyZAEv/g0pnd0hnAEPMnzr/tif/pyb/iSCYiBT/pADmngDSmwDFkQD/jQDNN3N7AAAAPXRSTlMAGRAKk3w3Kdq/lZWNe3FnX0hDQxsV/f36+vr29vLt5+Hg2dHPy8nEw72pmpiTjIyKfXhycW1jYFpXNSQd0lS2vQAAAchJREFUKM9ioCIwUuPRssIpq+8X2yChxIhLmtMvKpCVgRm7JBu7uvOsJjYcWhmNeThdZjazYpcVZdSRXzk/PqFRiIEJizQ/l3JH/6TpSxcsE8Qiyy69d45LQG1C0uL2tSboksyMQnKbXaLmnbz7IPvY+p0qAujmcx9ydk1+9uXtu/clT/dN6dRA851ZrGvQ2Y+5Vz1vP3ldkj25W0EU1WX1rROvP8qY656U4fm44Fzb6jXCyNKsda5bcveHARY9Ic52iefNglVBmSJIsiJbgyNf/lhuG5N6IsZ23cVrB5xXCCBkrbXPTA28/CvdNvRgzalQ28NXdvnPNkC43pSjaLedw89v4bbul1LdbTNvbOuLR7Jb93Rpfprdxj8fwnui42aEHT2SvFAWyWo98cqiOx52O/7WbO+KiEj/dH9DgCKStCVHWZVjjodd4uff38vL/33dFOnPhRyohvecioHybg6Jt968OD+tJVgMJc0wSVbaezk+z+p1c3CwCwlxW4SWKsxLnXyLHfMfXshKS0nZcxwjUnkr7H2rC728CvPyXnlrYsa4RZmPva9Thbd3tY8qtuTExCJV5WRv7yPDiyM1svOxcLPw2RCfbQBuO530bO8cGwAAAABJRU5ErkJggg==")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$4, 54, 8, 3307);
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
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(53:4) {#if name===\\\"Gyre\\\"}",
    		ctx
    	});

    	return block;
    }

    // (57:4) {#if name==="list"}
    function create_if_block_7$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m1 9.6262715h12v2.6837195h-12zm0-3.909844h12v2.68288h-12zm0-4.026418h12v2.684558h-12z");
    			add_location(path, file$4, 57, 93, 5292);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 57, 8, 5207);
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
    		source: "(57:4) {#if name===\\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (60:4) {#if name==="properties"}
    function create_if_block_6$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m3.6580703 10.816142q0-.189779-.1388283-.328607-.1388283-.138828-.328607-.138828-.1897788 0-.3286071.138828-.1388283.138828-.1388283.328607 0 .189779.1388283.328607.1388283.138828.3286071.138828.1897787 0 .328607-.138828.1388283-.138828.1388283-.328607zm4.7038018-3.0673106-4.980991 4.9809906q-.2701776.270178-.657214.270178-.3795575 0-.6646931-.270178l-.7740729-.788563q-.2776566-.262699-.2776566-.657214 0-.387037.2776566-.664693l4.9739794-4.9739796q.2846681.7156435.8362418 1.2672172.5515737.5515737 1.2672172.8362418zm4.6304139-3.177158q0 .2846681-.167808.7740729-.343099.9788096-1.20131 1.5883453-.858211.6095357-1.8879709.6100031-1.3513555 0-2.3114677-.9605796-.9601122-.9605796-.9605796-2.3114677-.0004675-1.3508882.9605796-2.3114678.961047-.9605796 2.3114677-.9605796.4234959 0 .8871919.1205983.463696.1205983.785292.3398255.116859.080399.116859.2047367 0 .1243378-.116859.2047367l-2.1399192 1.2344967v1.6360237l1.4097852.7815519q.03646-.021969.576814-.354316.540356-.3323466.989562-.5917732.449204-.2594266.515114-.2594266.109379 0 .171548.07292.06217.07292.06217.1827673z");
    			add_location(path, file$4, 60, 91, 5530);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 60, 8, 5447);
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
    		source: "(60:4) {#if name===\\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if name==="editForm"}
    function create_if_block_5$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m 1.1997995,12.993916 c -0.079034,-0.023 -0.164071,-0.1093 -0.1879813,-0.1914 -0.012005,-0.042 -0.013006,-0.6895 -0.011005,-5.8210003 l 0,-5.774 0.02201,-0.045 c 0.028012,-0.057 0.083036,-0.1117 0.1401606,-0.1401 l 0.045019,-0.022 5.7922041,0 5.7923041,0 0.05102,0.025 c 0.05602,0.027 0.103645,0.075 0.135459,0.1345 l 0.02101,0.039 0,5.7832 c 0,5.3765003 0,5.7866003 -0.01301,5.8311003 -0.01901,0.06 -0.07903,0.1291 -0.141761,0.1621 l -0.04602,0.024 -5.7877023,0 c -3.4562942,9e-4 -5.799207,0 -5.8160143,-0.01 z m 11.2366575,-5.9919003 0,-5.4342 -5.4319481,0 -5.4318482,0 0,5.4229 c 0,2.9826 -4.002e-4,5.4280003 0,5.4342003 0,0.01 1.0990751,0.011 5.4365502,0.011 l 5.4321481,0 0,-5.4342003 z m -6.8619663,3.7181003 0,-0.8603003 0.8557699,0 0.85577,0 0,0.8603003 0,0.8603 -0.85577,0 -0.8557699,0 0,-0.8603 z m 1.1439945,0 0,-0.2838 -0.2882246,0 -0.2883246,0 0,0.2838 0,0.2837 0.2883246,0 0.2882246,0 0,-0.2837 z m 1.1440947,0 0,-0.2838 1.7160418,0 1.7160413,0 0,0.2838 0,0.2837 -1.7160413,0 -1.7160418,0 0,-0.2837 z m -2.2880892,-3.1483003 0,-1.1441 2.8600364,0 2.8601359,0 0,1.1441 0,1.1439 -2.8601359,0 -2.8600364,0 0,-1.1439 z m 5.1436233,0 0,-0.5721 -2.2880888,0 -2.2880892,0 0,0.5661 c 0,0.3113 0,0.5687 0.010004,0.572 0,0 1.0329466,0.01 2.2880892,0.01 l 2.2820868,0 0,-0.572 z m -7.9992578,0 0,-0.2884 1.1395927,0 1.1394925,0 0,0.2884 0,0.2882 -1.1394925,0 -1.1395927,0 0,-0.2882 z m 2.8556345,-3.4321 0,-1.1441 2.8600364,0 2.8601359,0 0,1.1441 0,1.144 -2.8601359,0 -2.8600364,0 0,-1.144 z m 5.1436233,0 0,-0.5721 -2.2880888,0 -2.2880892,0 0,0.5661 c 0,0.3112 0,0.5686 0.010004,0.5719 0,0 1.0329466,0.01 2.2880892,0.01 l 2.2820868,0 0,-0.5719 z m -7.9992578,0 0,-0.2839 1.1395927,0 1.1394925,0 0,0.2839 0,0.2837 -1.1394925,0 -1.1395927,0 0,-0.2837 z");
    			add_location(path, file$4, 63, 111, 6782);
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 63, 8, 6679);
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
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(63:4) {#if name===\\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (66:4) {#if name==="editRules"}
    function create_if_block_4$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m6.6 6.996925q0-.6625-.46875-1.13125-.46875-.46875-1.13125-.46875-.6625 0-1.13125.46875-.46875.46875-.46875 1.13125 0 .6625.46875 1.13125.46875.46875 1.13125.46875.6625 0 1.13125-.46875.46875-.46875.46875-1.13125zm4.8 3.2q0-.325-.2375-.5625-.2375-.2375-.5625-.2375-.325 0-.5625.2375-.2375.2375-.2375.5625 0 .33125.23438.56562.23437.23438.56562.23438.33125 0 .56562-.23438.23438-.23437.23438-.56562zm0-6.4q0-.325-.2375-.5625-.2375-.2375-.5625-.2375-.325 0-.5625.2375-.2375.2375-.2375.5625 0 .33125.23438.56563.23437.23437.56562.23437.33125 0 .56562-.23437.23438-.23438.23438-.56563zm-2.4 2.63125v1.15625q0 .0625-.0438.12188-.0438.0594-.1.0656l-.96875.15q-.0688.21875-.2.475.2125.3.5625.71875.0438.0625.0438.125 0 .075-.0438.11875-.14375.1875-.51563.55937-.37187.37188-.49062.37188-.0688 0-.13125-.0438l-.71875-.5625q-.23125.11875-.48125.19375-.0687.675-.14375.96875-.0438.15-.1875.15h-1.1625q-.0688 0-.125-.0469-.0563-.0469-.0625-.10938l-.14375-.95625q-.2125-.0625-.46875-.19375l-.7375.55625q-.0437.0438-.125.0438-.0687 0-.13125-.05-.9-.83125-.9-1 0-.0563.04375-.11875.0625-.0875.25625-.33125.19375-.24375.29375-.38125-.14375-.275-.21875-.5125l-.95-.15q-.0625-.006-.10625-.0594-.0437-.05305-.0437-.1218v-1.15625q0-.0625.04375-.12188.04375-.0594.1-.0656l.96875-.15q.0688-.21875.2-.475-.2125-.3-.5625-.71875-.04375-.0688-.04375-.125 0-.075.04375-.125.1375-.1875.5125-.55625.375-.36875.49375-.36875.0688 0 .13125.0437l.71875.5625q.2125-.1125.48125-.2.0687-.675.14375-.9625.0438-.15.1875-.15h1.1625q.0688 0 .125.0469.0563.0469.0625.10937l.14375.95625q.2125.0625.46875.19375l.7375-.55625q.05-.0437.125-.0437.0687 0 .13125.05.9.83125.9 1 0 .0562-.0438.11875-.075.1-.2625.3375-.1875.2375-.28125.375.14375.3.2125.5125l.95.14375q.0625.0125.10625.0656.0438.0531.0438.12187zm4 3.33125v.875q0 .1-.93125.19375-.075.16875-.1875.325.31875.70625.31875.8625 0 .025-.025.0437-.7625.44375-.775.44375-.05 0-.2875-.29375-.2375-.29375-.325-.425-.125.0125-.1875.0125-.0625 0-.1875-.0125-.0875.13125-.325.425-.2375.29375-.2875.29375-.0125 0-.775-.44375-.025-.0187-.025-.0437 0-.15625.31875-.8625-.1125-.15625-.1875-.325-.93125-.0937-.93125-.19375v-.875q0-.1.93125-.19375.0813-.18125.1875-.325-.31875-.70625-.31875-.8625 0-.025.025-.0438.025-.0125.21875-.125.19375-.1125.36875-.2125.175-.1.1875-.1.05 0 .2875.29063.2375.29062.325.42187.125-.0125.1875-.0125.0625 0 .1875.0125.31875-.44375.575-.7l.0375-.0125q.025 0 .775.4375.025.0188.025.0438 0 .15625-.31875.8625.10625.14375.1875.325.93125.0937.93125.19375zm0-6.4v.875q0 .1-.93125.19375-.075.16875-.1875.325.31875.70625.31875.8625 0 .025-.025.0438-.7625.44375-.775.44375-.05 0-.2875-.29375-.2375-.29375-.325-.425-.125.0125-.1875.0125-.0625 0-.1875-.0125-.0875.13125-.325.425-.2375.29375-.2875.29375-.0125 0-.775-.44375-.025-.0188-.025-.0438 0-.15625.31875-.8625-.1125-.15625-.1875-.325-.93125-.0937-.93125-.19375v-.875q0-.1.93125-.19375.0813-.18125.1875-.325-.31875-.70625-.31875-.8625 0-.025.025-.0438.025-.0125.21875-.125.19375-.1125.36875-.2125.175-.1.1875-.1.05 0 .2875.29062.2375.29063.325.42188.125-.0125.1875-.0125.0625 0 .1875.0125.31875-.44375.575-.7l.0375-.0125q.025 0 .775.4375.025.0188.025.0438 0 .15625-.31875.8625.10625.14375.1875.325.93125.0937.93125.19375z");
    			add_location(path, file$4, 66, 92, 8693);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 66, 8, 8609);
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
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(66:4) {#if name===\\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    // (69:4) {#if name==="close"}
    function create_if_block_3$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m12 10.047142q0 .3367-.235692.572383l-1.144783 1.144783q-.235683.235692-.572383.235692-.3367003 0-.572392-.235692l-2.47475-2.47475-2.47475 2.47475q-.2356917.235692-.5723917.235692-.3367 0-.5723833-.235692l-1.1447833-1.144783q-.2356917-.235683-.2356917-.572383 0-.3367.2356917-.572392l2.47475-2.47475-2.47475-2.47475q-.2356917-.2356917-.2356917-.5723917 0-.3367.2356917-.5723833l1.1447833-1.1447833q.2356833-.2356917.5723833-.2356917.3367 0 .5723917.2356917l2.47475 2.47475 2.47475-2.47475q.2356917-.2356917.572392-.2356917.3367 0 .572383.2356917l1.144783 1.1447833q.235692.2356833.235692.5723833 0 .3367-.235692.5723917l-2.4747497 2.47475 2.4747497 2.47475q.235692.235692.235692.572392z");
    			add_location(path, file$4, 69, 91, 12041);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 69, 8, 11958);
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
    		source: "(69:4) {#if name===\\\"close\\\"}",
    		ctx
    	});

    	return block;
    }

    // (72:4) {#if name==="arrowRight"}
    function create_if_block_2$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m8.578947 3.30551v2.431332h-7.578947v2.526316h7.578947v2.431332l4.421053-3.69449z");
    			add_location(path, file$4, 72, 92, 12881);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 72, 8, 12797);
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
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(72:4) {#if name===\\\"arrowRight\\\"}",
    		ctx
    	});

    	return block;
    }

    // (75:4) {#if name==="removeFromList"}
    function create_if_block_1$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m5.4999377 5.7501979v4.5001871q0 .109505-.070503.179508-.070503.07-.1795074.0705h-.5000209q-.1095045 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000209q.1095045 0 .1795074.070503.070003.070503.070503.1795075zm2.0000833 0v4.5001871q0 .109505-.070503.179508-.070503.07-.1795075.0705h-.5000207q-.1095046 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000208q.1095046 0 .1795075.070503.070003.070503.070503.1795075zm2.0000833 0v4.5001871q0 .109505-.070503.179508-.070503.07-.1795075.0705h-.5000207q-.1095046 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000209q.1095046 0 .1795075.070503.070003.070503.070503.1795075zm1.0000417 5.6567361v-7.406309h-7.0002917v7.406309q0 .172007.054502.316513.054502.144506.1135047.211009.059003.0665.082004.0665h6.500271q.0235 0 .082-.0665.0585-.0665.113504-.211009.055-.144506.0545-.316513zm-5.2502187-8.4068507h3.5001458l-.3750156-.914038q-.0545023-.070503-.1330056-.0860036h-2.4766032q-.078003.015501-.1330055.086004zm7.2503017.2500105v.5000208q0 .1095046-.0705.1795075-.0705.070003-.179507.070503h-.750031v7.4063089q0 .648527-.367016 1.121046-.367018.47252-.883039.47252h-6.5002712q-.5155215 0-.8830368-.457019-.3675154-.457019-.3670153-1.105546v-7.43781h-.7500313q-.1095046 0-.1795075-.070503-.0700029-.0705029-.0705029-.1795074v-.5000209q0-.1095045.070503-.1795074.070503-.070003.1795075-.070503h2.4141005l.5470228-1.3045543q.1170049-.2890121.4220176-.4920205.3050127-.2030085.6170257-.2030085h2.5001042q.312513 0 .6170257.2030085.3045127.2030084.4220176.4920205l.5470227 1.3045543h2.4141007q.109504 0 .179507.070503.07.070503.0705.1795074z");
    			add_location(path, file$4, 75, 109, 13137);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			set_style(svg, "fill", "red");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 75, 8, 13036);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(75:4) {#if name===\\\"removeFromList\\\"}",
    		ctx
    	});

    	return block;
    }

    // (78:4) {#if name==="comboList"}
    function create_if_block$4(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m1 2.8h12v1.2h-12zm0 2.4h12v1.2h-12zm0 2.4h12v1.2h-12zm0 2.4h12v1.2h-12z");
    			add_location(path, file$4, 78, 92, 15086);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$4, 78, 8, 15002);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(78:4) {#if name===\\\"comboList\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let div_class_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*name*/ ctx[0] === "move" && create_if_block_12$1(ctx);
    	let if_block1 = /*name*/ ctx[0] === "down" && create_if_block_11$1(ctx);
    	let if_block2 = /*name*/ ctx[0] === "up" && create_if_block_10$1(ctx);
    	let if_block3 = /*name*/ ctx[0] === "save" && create_if_block_9$1(ctx);
    	let if_block4 = /*name*/ ctx[0] === "Gyre" && create_if_block_8$1(ctx);
    	let if_block5 = /*name*/ ctx[0] === "list" && create_if_block_7$1(ctx);
    	let if_block6 = /*name*/ ctx[0] === "properties" && create_if_block_6$1(ctx);
    	let if_block7 = /*name*/ ctx[0] === "editForm" && create_if_block_5$1(ctx);
    	let if_block8 = /*name*/ ctx[0] === "editRules" && create_if_block_4$1(ctx);
    	let if_block9 = /*name*/ ctx[0] === "close" && create_if_block_3$1(ctx);
    	let if_block10 = /*name*/ ctx[0] === "arrowRight" && create_if_block_2$2(ctx);
    	let if_block11 = /*name*/ ctx[0] === "removeFromList" && create_if_block_1$3(ctx);
    	let if_block12 = /*name*/ ctx[0] === "comboList" && create_if_block$4(ctx);

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
    			t8 = space();
    			if (if_block9) if_block9.c();
    			t9 = space();
    			if (if_block10) if_block10.c();
    			t10 = space();
    			if (if_block11) if_block11.c();
    			t11 = space();
    			if (if_block12) if_block12.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-e4n68z"));
    			add_location(div, file$4, 30, 0, 1194);
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
    			append_dev(div, t8);
    			if (if_block9) if_block9.m(div, null);
    			append_dev(div, t9);
    			if (if_block10) if_block10.m(div, null);
    			append_dev(div, t10);
    			if (if_block11) if_block11.m(div, null);
    			append_dev(div, t11);
    			if (if_block12) if_block12.m(div, null);

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
    					if_block0 = create_if_block_12$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*name*/ ctx[0] === "down") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_11$1(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*name*/ ctx[0] === "up") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_10$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*name*/ ctx[0] === "save") {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_9$1(ctx);
    					if_block3.c();
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*name*/ ctx[0] === "Gyre") {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_8$1(ctx);
    					if_block4.c();
    					if_block4.m(div, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*name*/ ctx[0] === "list") {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_7$1(ctx);
    					if_block5.c();
    					if_block5.m(div, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*name*/ ctx[0] === "properties") {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_6$1(ctx);
    					if_block6.c();
    					if_block6.m(div, t6);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*name*/ ctx[0] === "editForm") {
    				if (if_block7) ; else {
    					if_block7 = create_if_block_5$1(ctx);
    					if_block7.c();
    					if_block7.m(div, t7);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*name*/ ctx[0] === "editRules") {
    				if (if_block8) ; else {
    					if_block8 = create_if_block_4$1(ctx);
    					if_block8.c();
    					if_block8.m(div, t8);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*name*/ ctx[0] === "close") {
    				if (if_block9) ; else {
    					if_block9 = create_if_block_3$1(ctx);
    					if_block9.c();
    					if_block9.m(div, t9);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*name*/ ctx[0] === "arrowRight") {
    				if (if_block10) ; else {
    					if_block10 = create_if_block_2$2(ctx);
    					if_block10.c();
    					if_block10.m(div, t10);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (/*name*/ ctx[0] === "removeFromList") {
    				if (if_block11) ; else {
    					if_block11 = create_if_block_1$3(ctx);
    					if_block11.c();
    					if_block11.m(div, t11);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}

    			if (/*name*/ ctx[0] === "comboList") {
    				if (if_block12) ; else {
    					if_block12 = create_if_block$4(ctx);
    					if_block12.c();
    					if_block12.m(div, null);
    				}
    			} else if (if_block12) {
    				if_block12.d(1);
    				if_block12 = null;
    			}

    			if (dirty & /*className*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-e4n68z"))) {
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
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			if (if_block12) if_block12.d();
    			mounted = false;
    			run_all(dispose);
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
    		"close": { class: "default leftMenuIcon" },
    		"list": { class: "default leftMenuIcon" },
    		"arrowRight": { class: " arrowRight " },
    		"comboList": { class: "default leftMenuIcon2 comboList" },
    		"removeFromList": { class: "default leftMenuIcon" },
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { name: 0, state: 3, deactivate: 4 }, add_css$5);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$5.name
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

    /* src\InputCombo.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\InputCombo.svelte";

    function add_css$4(target) {
    	append_styles(target, "svelte-12v7n6u", ".input.svelte-12v7n6u.svelte-12v7n6u{background-color:black;color:white;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}.input.svelte-12v7n6u option.svelte-12v7n6u{background-color:black;color:white}.input.svelte-12v7n6u optgroup.svelte-12v7n6u{background-color:black;color:white}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5wdXRDb21iby5zdmVsdGUiLCJzb3VyY2VzIjpbIklucHV0Q29tYm8uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgXHJcblxyXG4gIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gXCIuL3N0b3Jlcy9tZXRhZGF0YVwiO1xyXG5cclxuICBleHBvcnQgbGV0IHZhbHVlPVwiXCJcclxuICBpbXBvcnQgSWNvbiBmcm9tICcuL0ljb24uc3ZlbHRlJ1xyXG4gIGxldCBzaG93Qm94PWZhbHNlXHJcbiAgPC9zY3JpcHQ+XHJcbiAgXHJcbiAgPHN0eWxlPlxyXG4gICAgXHJcbiAgICAuaW5wdXQge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBwYWRkaW5nOiAzcHg7XHJcbiAgICB9XHJcbiAgICAuaW5wdXQgb3B0aW9uIHtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gICAgLmlucHV0IG9wdGdyb3VwIHtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gIDwvc3R5bGU+XHJcbjxpbnB1dCB0eXBlPVwidGV4dFwiIHt2YWx1ZX0gY2xhc3M9XCJpbnB1dFwiPjxJY29uIG5hbWU9XCJjb21ib0xpc3RcIiBvbjpjbGljaz17KGUpID0+IHtzaG93Qm94PXRydWV9fT48L0ljb24+XHJcbnsjaWYgc2hvd0JveH1cclxuICA8c2VsZWN0IGNsYXNzPVwiaW5wdXRcIiBvbjpjaGFuZ2U9eyhlKSA9PiB7IHZhbHVlPWUudGFyZ2V0LnZhbHVlOyBzaG93Qm94PWZhbHNlfX0+XHJcbiAgICA8b3B0aW9uPlNlbGVjdC4uLjwvb3B0aW9uPlxyXG4gICAgeyNlYWNoIE9iamVjdC5lbnRyaWVzKCRtZXRhZGF0YS5jb21ib192YWx1ZXMpIGFzIFt0aXRsZSx2YWx1ZXNdfVxyXG4gICAgICA8b3B0Z3JvdXAgbGFiZWw9e3RpdGxlfT5cclxuICAgICAgeyNlYWNoIHZhbHVlcyBhcyB2fVxyXG4gICAgICAgIDxvcHRpb24ge3Z9Pnt2fTwvb3B0aW9uPlxyXG4gICAgICB7L2VhY2h9XHJcbiAgICA8L29wdGdyb3VwPlxyXG4gICAgey9lYWNofVxyXG4gIDwvc2VsZWN0PlxyXG57L2lmfSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFZSSxvQ0FBTyxDQUNILGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsS0FBSyxDQUFFLEtBQUssQ0FDWixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUNuSSxPQUFPLENBQUUsR0FDYixDQUNBLHFCQUFNLENBQUMscUJBQU8sQ0FDWixnQkFBZ0IsQ0FBRSxLQUFLLENBQ3JCLEtBQUssQ0FBRSxLQUNYLENBQ0EscUJBQU0sQ0FBQyx1QkFBUyxDQUNkLGdCQUFnQixDQUFFLEtBQUssQ0FDckIsS0FBSyxDQUFFLEtBQ1gifQ== */");
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i][0];
    	child_ctx[6] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (29:0) {#if showBox}
    function create_if_block$3(ctx) {
    	let select;
    	let option;
    	let mounted;
    	let dispose;
    	let each_value = Object.entries(/*$metadata*/ ctx[2].combo_values);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			option = element("option");
    			option.textContent = "Select...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			option.__value = "Select...";
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-12v7n6u");
    			add_location(option, file$3, 30, 4, 811);
    			attr_dev(select, "class", "input svelte-12v7n6u");
    			add_location(select, file$3, 29, 2, 725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*change_handler*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, $metadata*/ 4) {
    				each_value = Object.entries(/*$metadata*/ ctx[2].combo_values);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(29:0) {#if showBox}",
    		ctx
    	});

    	return block;
    }

    // (34:6) {#each values as v}
    function create_each_block_1$3(ctx) {
    	let option;
    	let t_value = /*v*/ ctx[9] + "";
    	let t;
    	let option_v_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "v", option_v_value = /*v*/ ctx[9]);
    			option.__value = option_value_value = /*v*/ ctx[9];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-12v7n6u");
    			add_location(option, file$3, 34, 8, 976);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$metadata*/ 4 && t_value !== (t_value = /*v*/ ctx[9] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$metadata*/ 4 && option_v_value !== (option_v_value = /*v*/ ctx[9])) {
    				attr_dev(option, "v", option_v_value);
    			}

    			if (dirty & /*$metadata*/ 4 && option_value_value !== (option_value_value = /*v*/ ctx[9])) {
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
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(34:6) {#each values as v}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#each Object.entries($metadata.combo_values) as [title,values]}
    function create_each_block$3(ctx) {
    	let optgroup;
    	let optgroup_label_value;
    	let each_value_1 = /*values*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			optgroup = element("optgroup");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(optgroup, "label", optgroup_label_value = /*title*/ ctx[5]);
    			attr_dev(optgroup, "class", "svelte-12v7n6u");
    			add_location(optgroup, file$3, 32, 6, 915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, optgroup, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(optgroup, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, $metadata*/ 4) {
    				each_value_1 = /*values*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(optgroup, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*$metadata*/ 4 && optgroup_label_value !== (optgroup_label_value = /*title*/ ctx[5])) {
    				attr_dev(optgroup, "label", optgroup_label_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(optgroup);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(32:4) {#each Object.entries($metadata.combo_values) as [title,values]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let input;
    	let icon;
    	let t;
    	let if_block_anchor;
    	let current;

    	icon = new Icon({
    			props: { name: "comboList" },
    			$$inline: true
    		});

    	icon.$on("click", /*click_handler*/ ctx[3]);
    	let if_block = /*showBox*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			create_component(icon.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "text");
    			input.value = /*value*/ ctx[0];
    			attr_dev(input, "class", "input svelte-12v7n6u");
    			add_location(input, file$3, 27, 0, 602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			mount_component(icon, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				prop_dev(input, "value", /*value*/ ctx[0]);
    			}

    			if (/*showBox*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
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
    			if (detaching) detach_dev(input);
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(2, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputCombo', slots, []);
    	let { value = "" } = $$props;
    	let showBox = false;
    	const writable_props = ['value'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputCombo> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(1, showBox = true);
    	};

    	const change_handler = e => {
    		$$invalidate(0, value = e.target.value);
    		$$invalidate(1, showBox = false);
    	};

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		metadata,
    		value,
    		Icon,
    		showBox,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('showBox' in $$props) $$invalidate(1, showBox = $$props.showBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, showBox, $metadata, click_handler, change_handler];
    }

    class InputCombo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { value: 0 }, add_css$4);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputCombo",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get value() {
    		throw new Error("<InputCombo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputCombo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\RuleEditor.svelte generated by Svelte v3.59.2 */

    const { console: console_1$2 } = globals;
    const file$2 = "src\\RuleEditor.svelte";

    function add_css$3(target) {
    	append_styles(target, "svelte-14rkto5", ".rule-row.svelte-14rkto5.svelte-14rkto5{position:relative;padding:10px;border:1px solid #ccc;margin-bottom:5px}.rule-row.svelte-14rkto5:hover .edit-button.svelte-14rkto5{display:block}.edit-button.svelte-14rkto5.svelte-14rkto5{display:none;position:absolute;top:0;right:0;cursor:pointer;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;padding:5px}.close-button.svelte-14rkto5.svelte-14rkto5{position:absolute;top:5px;right:5px;cursor:pointer}.action-row.svelte-14rkto5.svelte-14rkto5{}.oneLine.svelte-14rkto5.svelte-14rkto5{display:inline-block;margin-right:10px;width:120px;font-size:14px}.input.svelte-14rkto5.svelte-14rkto5{background-color:black;color:white;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}.rightValue.svelte-14rkto5.svelte-14rkto5{width:150px}.ruleEditor.svelte-14rkto5 button.svelte-14rkto5{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.ruleEditor.svelte-14rkto5 .delete.svelte-14rkto5{background-color:red;color:white}.ruleEditor.svelte-14rkto5 h1.svelte-14rkto5{font-size:16px;margin-bottom:30px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVsZUVkaXRvci5zdmVsdGUiLCJzb3VyY2VzIjpbIlJ1bGVFZGl0b3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgXHJcbiAgICBcclxuXHJcbiAgICBpbXBvcnQgeyBtZXRhZGF0YX0gZnJvbSAnLi9zdG9yZXMvbWV0YWRhdGEnXHJcbiAgICBpbXBvcnQgSW5wdXRDb21ibyAgZnJvbSAnLi9JbnB1dENvbWJvLnN2ZWx0ZSdcclxuICAgIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tICdzdmVsdGUnO1xyXG4gICAgaW1wb3J0IHsgbWFwcGluZ3NIZWxwZXIgfSBmcm9tICcuL21hcHBpbmdzSGVscGVyLmpzJ1xyXG4gICAgbGV0IG1IPW5ldyBtYXBwaW5nc0hlbHBlcigpXHJcblxyXG4gICAgbGV0IE1hcHBpbmdzQ29wbXBvbmVudFxyXG4gICAgbGV0IGNvbmRpdGlvbnMgPSBbJz09JywgJyE9JywgJz4nLCAnPCcsICc+PScsICc8PSddO1xyXG4gICAgbGV0IGVkaXRpbmdJbmRleCA9IG51bGw7IC8vIEluZGV4IG9mIHRoZSBjdXJyZW50bHkgZWRpdGluZyBydWxlXHJcbiAgICBpZiAoISRtZXRhZGF0YS5ydWxlcykgJG1ldGFkYXRhLnJ1bGVzPVtdXHJcbiAgICBsZXQgZmllbGRzPSRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzIC8vIGdldCBmb3JtIGZpZWxkc1xyXG4gICAgbGV0IHJ1bGVzID0gJG1ldGFkYXRhLnJ1bGVzXHJcbiAgICBsZXQgbWFwcGluZ0ZpZWxkcz17ZGVmYXVsdGZpZWxkczpbXX1cclxuICAgIGZ1bmN0aW9uIGFkZFJ1bGUoKSB7XHJcbiAgICAgIHJ1bGVzLnB1c2goeyBmaWVsZE5hbWU6ICcnLCBjb25kaXRpb246ICcnLCBhY3Rpb25UeXBlOiAnJywgcmlnaHRWYWx1ZTonJywgdGFyZ2V0RmllbGQ6ICcnLCBhY3Rpb25WYWx1ZTogJycgfSk7XHJcbiAgICAgIHJ1bGVzPXJ1bGVzXHJcbiAgICAgIGVkaXRpbmdJbmRleD1ydWxlcy5sZW5ndGgtMVxyXG4gICAgICAkbWV0YWRhdGEucnVsZXMgPSBydWxlcztcclxuICAgIH1cclxuICAgIG9uTW91bnQoKCkgPT4ge1xyXG4gICAgICBtYXBwaW5nRmllbGRzPW1ILmdldE1hcHBpbmdGaWVsZHMoJG1ldGFkYXRhKVxyXG4gICAgICBjb25zb2xlLmxvZyhtYXBwaW5nRmllbGRzKVxyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiBkZWxldGVSdWxlKGluZGV4KSB7XHJcbiAgICAgIHJ1bGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGlmIChlZGl0aW5nSW5kZXggPT09IGluZGV4KSB7XHJcbiAgICAgICAgZWRpdGluZ0luZGV4ID0gbnVsbDsgLy8gUmVzZXQgZWRpdGluZyBpbmRleCBpZiB0aGUgY3VycmVudGx5IGVkaXRlZCBydWxlIGlzIGRlbGV0ZWRcclxuICAgICAgfVxyXG4gICAgICBydWxlcz1ydWxlc1xyXG4gICAgICAkbWV0YWRhdGEucnVsZXMgPSBydWxlcztcclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIGVkaXRSdWxlKGluZGV4KSB7XHJcbiAgICAgIGVkaXRpbmdJbmRleCA9IGluZGV4O1xyXG4gICAgfVxyXG4gIDwvc2NyaXB0PlxyXG4gIFxyXG4gIDxzdHlsZT5cclxuICAgIC5ydWxlLXJvdyB7XHJcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgcGFkZGluZzogMTBweDtcclxuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcclxuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xyXG4gICAgfVxyXG4gICAgLnJ1bGUtcm93OmhvdmVyIC5lZGl0LWJ1dHRvbiB7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgfVxyXG4gICAgLmVkaXQtYnV0dG9uIHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgIH1cclxuICAgIC5jbG9zZS1idXR0b24ge1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIHRvcDogNXB4O1xyXG4gICAgICByaWdodDogNXB4O1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcblxyXG4gICAgfSAgICBcclxuICAgIC5hY3Rpb24tcm93IHtcclxuXHJcbiAgICB9XHJcbiAgICAub25lTGluZSB7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgICAgICB3aWR0aDoxMjBweDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcblxyXG4gICAgfVxyXG4gICAgLmlucHV0IHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgcGFkZGluZzogM3B4O1xyXG4gICAgfVxyXG4gICAgLnJpZ2h0VmFsdWUge1xyXG4gICAgICAgIHdpZHRoOiAxNTBweDtcclxuICAgIH1cclxuICAgIC5ydWxlRWRpdG9yIGJ1dHRvbiB7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIG1pbi13aWR0aDogNzBweDtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogcmdiKDEyOCwgMTI4LCAxMjgpO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfVxyXG4gICAgLnJ1bGVFZGl0b3IgLmRlbGV0ZSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxuICAgIC5ydWxlRWRpdG9yIGgxIHtcclxuICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gICAgfVxyXG4gIDwvc3R5bGU+XHJcbiAgXHJcblxyXG4gPGRpdiBjbGFzcz1cInJ1bGVFZGl0b3JcIj5cclxuICA8aDE+UnVsZXM8L2gxPlxyXG5cclxuICB7I2VhY2ggcnVsZXMgYXMgcnVsZSwgaW5kZXh9XHJcbiAgICA8ZGl2IGNsYXNzPVwicnVsZS1yb3dcIj5cclxuICAgICAgeyNpZiBlZGl0aW5nSW5kZXggPT09IGluZGV4fVxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNsb3NlLWJ1dHRvblwiIG9uOmNsaWNrPXsoKSA9PiB7IGVkaXRpbmdJbmRleD0tMSB9fT5YPC9kaXY+XHJcblxyXG4gICAgICAgIDwhLS0gSW5wdXRzIGZvciBlZGl0aW5nIC0tPlxyXG5cclxuICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS5maWVsZE5hbWV9ICBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPkZpZWxkLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkZvcm1cIj5cclxuICAgICAgICAgICAgICB7I2VhY2ggZmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiRGVmYXVsdHNcIj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCBtYXBwaW5nRmllbGRzLmRlZmF1bHRGaWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS5jb25kaXRpb259IGNsYXNzPVwib25lTGluZSBpbnB1dFwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+Q29uZGl0aW9uLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsjZWFjaCBjb25kaXRpb25zIGFzIGNvbmRpdGlvbn1cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtjb25kaXRpb259Pntjb25kaXRpb259PC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJpbnB1dCByaWdodFZhbHVlXCIgcGxhY2Vob2xkZXI9XCJWYWx1ZVwiIGJpbmQ6dmFsdWU9e3J1bGUucmlnaHRWYWx1ZX0+XHJcblxyXG4gICAgICAgICAgPHNlbGVjdCBiaW5kOnZhbHVlPXtydWxlLmFjdGlvblR5cGV9ICBjbGFzcz1cImlucHV0XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5BY3Rpb24uLi48L29wdGlvbj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNldFZhbHVlXCI+U2V0IFZhbHVlPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzaG93RmllbGRcIj5TaG93L0hpZGU8L29wdGlvbj5cclxuICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIHsjaWYgcnVsZS5hY3Rpb25UeXBlID09PSAnc2V0VmFsdWUnfVxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbi1yb3dcIj5cclxuICAgICAgICAgICAgICA8c2VsZWN0IGJpbmQ6dmFsdWU9e3J1bGUudGFyZ2V0RmllbGR9IGNsYXNzPVwib25lTGluZSBpbnB1dFwiPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPkZpZWxkLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJGb3JtXCI+XHJcbiAgICAgICAgICAgICAgICAgIHsjZWFjaCBmaWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJEZWZhdWx0c1wiPlxyXG4gICAgICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5kZWZhdWx0RmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICA8L29wdGdyb3VwPlxyXG4gICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgID0gPElucHV0Q29tYm8gIGJpbmQ6dmFsdWU9e3J1bGUuYWN0aW9uVmFsdWV9IH0+PC9JbnB1dENvbWJvPlxyXG4gICAgICAgICAgICAgIDwhLS0gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYmluZDp2YWx1ZT17cnVsZS5hY3Rpb25WYWx1ZX0gcGxhY2Vob2xkZXI9XCJWYWx1ZVwiICBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIiBzdHlsZT1cIndpZHRoOjI3MHB4XCI+LS0+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7L2lmfVxyXG4gICAgICAgIDxkaXY+PGJ1dHRvbiBvbjpjbGljaz17KCkgPT4gZGVsZXRlUnVsZShpbmRleCl9IGNsYXNzPVwiZGVsZXRlXCI+RGVsZXRlPC9idXR0b24+PC9kaXY+XHJcbiAgICAgICAgXHJcblxyXG4gICAgICB7OmVsc2V9XHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdC1idXR0b25cIiBvbjpjbGljaz17KCkgPT4gZWRpdFJ1bGUoaW5kZXgpfT5FZGl0PC9kaXY+XHJcbiAgICAgICAgPCEtLSBEaXNwbGF5IFJ1bGUgU3VtbWFyeSAtLT5cclxuICAgICAgICA8ZGl2PiBpZiB7cnVsZS5maWVsZE5hbWV9IHtydWxlLmNvbmRpdGlvbn0ge3J1bGUucmlnaHRWYWx1ZX06IHsjaWYgcnVsZS5hY3Rpb25UeXBlPT09XCJzZXRWYWx1ZVwifXNldCB7cnVsZS50YXJnZXRGaWVsZH09e3J1bGUuYWN0aW9uVmFsdWV9ey9pZn08L2Rpdj5cclxuICAgICAgey9pZn1cclxuICAgIDwvZGl2PlxyXG4gIHsvZWFjaH1cclxuICA8YnV0dG9uIG9uOmNsaWNrPXthZGRSdWxlfT5BZGQgUnVsZTwvYnV0dG9uPlxyXG48L2Rpdj5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTBDSSx1Q0FBVSxDQUNSLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUN0QixhQUFhLENBQUUsR0FDakIsQ0FDQSx3QkFBUyxNQUFNLENBQUMsMkJBQWEsQ0FDM0IsT0FBTyxDQUFFLEtBQ1gsQ0FDQSwwQ0FBYSxDQUNYLE9BQU8sQ0FBRSxJQUFJLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLENBQUMsQ0FDTixLQUFLLENBQUUsQ0FBQyxDQUNSLE1BQU0sQ0FBRSxPQUFPLENBQ2YsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDakksS0FBSyxDQUFFLEtBQUssQ0FDWixnQkFBZ0IsQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxZQUFZLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDaEMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsT0FBTyxDQUFFLEdBQ2IsQ0FDQSwyQ0FBYyxDQUNaLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxHQUFHLENBQ1IsS0FBSyxDQUFFLEdBQUcsQ0FDVixNQUFNLENBQUUsT0FFVixDQUNBLHlDQUFZLENBRVosQ0FDQSxzQ0FBUyxDQUNMLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLFlBQVksQ0FBRSxJQUFJLENBQ2xCLE1BQU0sS0FBSyxDQUNYLFNBQVMsQ0FBRSxJQUVmLENBQ0Esb0NBQU8sQ0FDSCxnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLEtBQUssQ0FBRSxLQUFLLENBQ1osV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksT0FBTyxDQUFFLEdBQ2IsQ0FDQSx5Q0FBWSxDQUNSLEtBQUssQ0FBRSxLQUNYLENBQ0EsMEJBQVcsQ0FBQyxxQkFBTyxDQUNmLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLFNBQVMsQ0FBRSxJQUFJLENBQ2YsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsS0FBSyxDQUNaLGdCQUFnQixDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLFlBQVksQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxhQUFhLENBQUUsR0FBRyxDQUNsQixNQUFNLENBQUUsT0FBTyxDQUNmLFlBQVksQ0FBRSxJQUNsQixDQUNBLDBCQUFXLENBQUMsc0JBQVEsQ0FDaEIsZ0JBQWdCLENBQUUsR0FBRyxDQUNyQixLQUFLLENBQUUsS0FDWCxDQUNBLDBCQUFXLENBQUMsaUJBQUcsQ0FDYixTQUFTLENBQUUsSUFBSSxDQUNmLGFBQWEsQ0FBRSxJQUNqQiJ9 */");
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[21] = list;
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_5$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (172:6) {:else}
    function create_else_block$1(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let t3_value = /*rule*/ ctx[20].fieldName + "";
    	let t3;
    	let t4;
    	let t5_value = /*rule*/ ctx[20].condition + "";
    	let t5;
    	let t6;
    	let t7_value = /*rule*/ ctx[20].rightValue + "";
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[16](/*index*/ ctx[22]);
    	}

    	let if_block = /*rule*/ ctx[20].actionType === "setValue" && create_if_block_2$1(ctx);

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
    			attr_dev(div0, "class", "edit-button svelte-14rkto5");
    			add_location(div0, file$2, 173, 8, 5768);
    			add_location(div1, file$2, 175, 8, 5885);
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
    			if (dirty[0] & /*rules*/ 2 && t3_value !== (t3_value = /*rule*/ ctx[20].fieldName + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*rules*/ 2 && t5_value !== (t5_value = /*rule*/ ctx[20].condition + "")) set_data_dev(t5, t5_value);
    			if (dirty[0] & /*rules*/ 2 && t7_value !== (t7_value = /*rule*/ ctx[20].rightValue + "")) set_data_dev(t7, t7_value);

    			if (/*rule*/ ctx[20].actionType === "setValue") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
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
    		source: "(172:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (118:6) {#if editingIndex === index}
    function create_if_block$2(ctx) {
    	let div0;
    	let t1;
    	let select0;
    	let option0;
    	let optgroup0;
    	let optgroup1;
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
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_5 = /*fields*/ ctx[4];
    	validate_each_argument(each_value_5);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_2[i] = create_each_block_5$1(get_each_context_5$1(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*mappingFields*/ ctx[2].defaultFields;
    	validate_each_argument(each_value_4);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_1[i] = create_each_block_4$2(get_each_context_4$2(ctx, each_value_4, i));
    	}

    	function select0_change_handler() {
    		/*select0_change_handler*/ ctx[9].call(select0, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	let each_value_3 = /*conditions*/ ctx[3];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$2(get_each_context_3$2(ctx, each_value_3, i));
    	}

    	function select1_change_handler() {
    		/*select1_change_handler*/ ctx[10].call(select1, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[11].call(input, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	function select2_change_handler() {
    		/*select2_change_handler*/ ctx[12].call(select2, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	let if_block = /*rule*/ ctx[20].actionType === 'setValue' && create_if_block_1$2(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[15](/*index*/ ctx[22]);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "X";
    			t1 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Field...";
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			optgroup1 = element("optgroup");

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
    			attr_dev(div0, "class", "close-button svelte-14rkto5");
    			add_location(div0, file$2, 119, 8, 3351);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 124, 12, 3547);
    			attr_dev(optgroup0, "label", "Form");
    			add_location(optgroup0, file$2, 125, 12, 3595);
    			attr_dev(optgroup1, "label", "Defaults");
    			add_location(optgroup1, file$2, 130, 14, 3789);
    			attr_dev(select0, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[20].fieldName === void 0) add_render_callback(select0_change_handler);
    			add_location(select0, file$2, 123, 10, 3474);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 137, 12, 4103);
    			attr_dev(select1, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[20].condition === void 0) add_render_callback(select1_change_handler);
    			add_location(select1, file$2, 136, 10, 4031);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "input rightValue svelte-14rkto5");
    			attr_dev(input, "placeholder", "Value");
    			add_location(input, file$2, 142, 10, 4302);
    			option2.__value = "";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 145, 12, 4475);
    			option3.__value = "setValue";
    			option3.value = option3.__value;
    			add_location(option3, file$2, 146, 12, 4524);
    			option4.__value = "showField";
    			option4.value = option4.__value;
    			add_location(option4, file$2, 147, 12, 4581);
    			attr_dev(select2, "class", "input svelte-14rkto5");
    			if (/*rule*/ ctx[20].actionType === void 0) add_render_callback(select2_change_handler);
    			add_location(select2, file$2, 144, 10, 4409);
    			attr_dev(button, "class", "delete svelte-14rkto5");
    			add_location(button, file$2, 168, 13, 5586);
    			add_location(div1, file$2, 168, 8, 5581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, select0, anchor);
    			append_dev(select0, option0);
    			append_dev(select0, optgroup0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(optgroup0, null);
    				}
    			}

    			append_dev(select0, optgroup1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(optgroup1, null);
    				}
    			}

    			select_option(select0, /*rule*/ ctx[20].fieldName, true);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, select1, anchor);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select1, null);
    				}
    			}

    			select_option(select1, /*rule*/ ctx[20].condition, true);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*rule*/ ctx[20].rightValue);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, select2, anchor);
    			append_dev(select2, option2);
    			append_dev(select2, option3);
    			append_dev(select2, option4);
    			select_option(select2, /*rule*/ ctx[20].actionType, true);
    			insert_dev(target, t10, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[8], false, false, false, false),
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

    			if (dirty[0] & /*fields*/ 16) {
    				each_value_5 = /*fields*/ ctx[4];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5$1(ctx, each_value_5, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_5$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_5.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 4) {
    				each_value_4 = /*mappingFields*/ ctx[2].defaultFields;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$2(ctx, each_value_4, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_4$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_4.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 22) {
    				select_option(select0, /*rule*/ ctx[20].fieldName);
    			}

    			if (dirty[0] & /*conditions*/ 8) {
    				each_value_3 = /*conditions*/ ctx[3];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$2(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 22) {
    				select_option(select1, /*rule*/ ctx[20].condition);
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 22 && input.value !== /*rule*/ ctx[20].rightValue) {
    				set_input_value(input, /*rule*/ ctx[20].rightValue);
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 22) {
    				select_option(select2, /*rule*/ ctx[20].actionType);
    			}

    			if (/*rule*/ ctx[20].actionType === 'setValue') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*rules*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t11.parentNode, t11);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(select0);
    			destroy_each(each_blocks_2, detaching);
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
    		source: "(118:6) {#if editingIndex === index}",
    		ctx
    	});

    	return block;
    }

    // (176:70) {#if rule.actionType==="setValue"}
    function create_if_block_2$1(ctx) {
    	let t0;
    	let t1_value = /*rule*/ ctx[20].targetField + "";
    	let t1;
    	let t2;
    	let t3_value = /*rule*/ ctx[20].actionValue + "";
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
    			if (dirty[0] & /*rules*/ 2 && t1_value !== (t1_value = /*rule*/ ctx[20].targetField + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*rules*/ 2 && t3_value !== (t3_value = /*rule*/ ctx[20].actionValue + "")) set_data_dev(t3, t3_value);
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(176:70) {#if rule.actionType===\\\"setValue\\\"}",
    		ctx
    	});

    	return block;
    }

    // (127:14) {#each fields as field}
    function create_each_block_5$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[23].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[23].name;
    			option.value = option.__value;
    			add_location(option, file$2, 127, 16, 3675);
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
    		id: create_each_block_5$1.name,
    		type: "each",
    		source: "(127:14) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (132:16) {#each mappingFields.defaultFields as field}
    function create_each_block_4$2(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[23].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[23].name;
    			option.value = option.__value;
    			add_location(option, file$2, 132, 18, 3898);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 4 && t_value !== (t_value = /*field*/ ctx[23].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 4 && option_value_value !== (option_value_value = /*field*/ ctx[23].name)) {
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
    		id: create_each_block_4$2.name,
    		type: "each",
    		source: "(132:16) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (139:12) {#each conditions as condition}
    function create_each_block_3$2(ctx) {
    	let option;
    	let t_value = /*condition*/ ctx[28] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*condition*/ ctx[28];
    			option.value = option.__value;
    			add_location(option, file$2, 139, 14, 4202);
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
    		id: create_each_block_3$2.name,
    		type: "each",
    		source: "(139:12) {#each conditions as condition}",
    		ctx
    	});

    	return block;
    }

    // (150:8) {#if rule.actionType === 'setValue'}
    function create_if_block_1$2(ctx) {
    	let div;
    	let select;
    	let option;
    	let optgroup0;
    	let optgroup1;
    	let t1;
    	let inputcombo;
    	let updating_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*fields*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*mappingFields*/ ctx[2].defaultFields;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[13].call(select, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	function inputcombo_value_binding(value) {
    		/*inputcombo_value_binding*/ ctx[14](value, /*rule*/ ctx[20]);
    	}

    	let inputcombo_props = { "}": true };

    	if (/*rule*/ ctx[20].actionValue !== void 0) {
    		inputcombo_props.value = /*rule*/ ctx[20].actionValue;
    	}

    	inputcombo = new InputCombo({ props: inputcombo_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputcombo, 'value', inputcombo_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			option = element("option");
    			option.textContent = "Field...";
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			optgroup1 = element("optgroup");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = text("\r\n              = ");
    			create_component(inputcombo.$$.fragment);
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$2, 152, 16, 4822);
    			attr_dev(optgroup0, "label", "Form");
    			add_location(optgroup0, file$2, 153, 16, 4874);
    			attr_dev(optgroup1, "label", "Defaults");
    			add_location(optgroup1, file$2, 158, 16, 5084);
    			attr_dev(select, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[20].targetField === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$2, 151, 14, 4744);
    			attr_dev(div, "class", "action-row svelte-14rkto5");
    			add_location(div, file$2, 150, 10, 4704);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);
    			append_dev(select, option);
    			append_dev(select, optgroup0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(optgroup0, null);
    				}
    			}

    			append_dev(select, optgroup1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(optgroup1, null);
    				}
    			}

    			select_option(select, /*rule*/ ctx[20].targetField, true);
    			append_dev(div, t1);
    			mount_component(inputcombo, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", select_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*fields*/ 16) {
    				each_value_2 = /*fields*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 4) {
    				each_value_1 = /*mappingFields*/ ctx[2].defaultFields;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 22) {
    				select_option(select, /*rule*/ ctx[20].targetField);
    			}

    			const inputcombo_changes = {};

    			if (!updating_value && dirty[0] & /*rules*/ 2) {
    				updating_value = true;
    				inputcombo_changes.value = /*rule*/ ctx[20].actionValue;
    				add_flush_callback(() => updating_value = false);
    			}

    			inputcombo.$set(inputcombo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputcombo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputcombo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(inputcombo);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(150:8) {#if rule.actionType === 'setValue'}",
    		ctx
    	});

    	return block;
    }

    // (155:18) {#each fields as field}
    function create_each_block_2$2(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[23].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[23].name;
    			option.value = option.__value;
    			add_location(option, file$2, 155, 20, 4962);
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
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(155:18) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (160:18) {#each mappingFields.defaultFields as field}
    function create_each_block_1$2(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[23].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[23].name;
    			option.value = option.__value;
    			add_location(option, file$2, 160, 20, 5197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 4 && t_value !== (t_value = /*field*/ ctx[23].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 4 && option_value_value !== (option_value_value = /*field*/ ctx[23].name)) {
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
    		source: "(160:18) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (116:2) {#each rules as rule, index}
    function create_each_block$2(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*editingIndex*/ ctx[0] === /*index*/ ctx[22]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "rule-row svelte-14rkto5");
    			add_location(div, file$2, 116, 4, 3217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
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
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(116:2) {#each rules as rule, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let t2;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*rules*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Rules";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			button = element("button");
    			button.textContent = "Add Rule";
    			attr_dev(h1, "class", "svelte-14rkto5");
    			add_location(h1, file$2, 113, 2, 3163);
    			attr_dev(button, "class", "svelte-14rkto5");
    			add_location(button, file$2, 179, 2, 6073);
    			attr_dev(div, "class", "ruleEditor svelte-14rkto5");
    			add_location(div, file$2, 112, 1, 3135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(div, t2);
    			append_dev(div, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addRule*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteRule, rules, mappingFields, fields, conditions, editingIndex, editRule*/ 223) {
    				each_value = /*rules*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
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
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
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
    	component_subscribe($$self, metadata, $$value => $$invalidate(17, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RuleEditor', slots, []);
    	let mH = new mappingsHelper();
    	let MappingsCopmponent;
    	let conditions = ['==', '!=', '>', '<', '>=', '<='];
    	let editingIndex = null; // Index of the currently editing rule
    	if (!$metadata.rules) set_store_value(metadata, $metadata.rules = [], $metadata);
    	let fields = $metadata.forms.default.elements; // get form fields
    	let rules = $metadata.rules;
    	let mappingFields = { defaultfields: [] };

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

    	onMount(() => {
    		$$invalidate(2, mappingFields = mH.getMappingFields($metadata));
    		console.log(mappingFields);
    	});

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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<RuleEditor> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, editingIndex = -1);
    	};

    	function select0_change_handler(each_value, index) {
    		each_value[index].fieldName = select_value(this);
    		$$invalidate(1, rules);
    		$$invalidate(2, mappingFields);
    		$$invalidate(4, fields);
    	}

    	function select1_change_handler(each_value, index) {
    		each_value[index].condition = select_value(this);
    		$$invalidate(1, rules);
    		$$invalidate(2, mappingFields);
    		$$invalidate(4, fields);
    	}

    	function input_input_handler(each_value, index) {
    		each_value[index].rightValue = this.value;
    		$$invalidate(1, rules);
    		$$invalidate(2, mappingFields);
    		$$invalidate(4, fields);
    	}

    	function select2_change_handler(each_value, index) {
    		each_value[index].actionType = select_value(this);
    		$$invalidate(1, rules);
    		$$invalidate(2, mappingFields);
    		$$invalidate(4, fields);
    	}

    	function select_change_handler(each_value, index) {
    		each_value[index].targetField = select_value(this);
    		$$invalidate(1, rules);
    		$$invalidate(2, mappingFields);
    		$$invalidate(4, fields);
    	}

    	function inputcombo_value_binding(value, rule) {
    		if ($$self.$$.not_equal(rule.actionValue, value)) {
    			rule.actionValue = value;
    			$$invalidate(1, rules);
    		}
    	}

    	const click_handler_1 = index => deleteRule(index);
    	const click_handler_2 = index => editRule(index);

    	$$self.$capture_state = () => ({
    		metadata,
    		InputCombo,
    		onMount,
    		mappingsHelper,
    		mH,
    		MappingsCopmponent,
    		conditions,
    		editingIndex,
    		fields,
    		rules,
    		mappingFields,
    		addRule,
    		deleteRule,
    		editRule,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('mH' in $$props) mH = $$props.mH;
    		if ('MappingsCopmponent' in $$props) MappingsCopmponent = $$props.MappingsCopmponent;
    		if ('conditions' in $$props) $$invalidate(3, conditions = $$props.conditions);
    		if ('editingIndex' in $$props) $$invalidate(0, editingIndex = $$props.editingIndex);
    		if ('fields' in $$props) $$invalidate(4, fields = $$props.fields);
    		if ('rules' in $$props) $$invalidate(1, rules = $$props.rules);
    		if ('mappingFields' in $$props) $$invalidate(2, mappingFields = $$props.mappingFields);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		editingIndex,
    		rules,
    		mappingFields,
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
    		inputcombo_value_binding,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class RuleEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {}, add_css$3, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RuleEditor",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Mappings.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\Mappings.svelte";

    function add_css$2(target) {
    	append_styles(target, "svelte-mlofvx", "#gyre_mappings.svelte-mlofvx .mapping.svelte-mlofvx{border:1px solid white;margin-top:10px;padding:5px;position:relative}#gyre_mappings.svelte-mlofvx .mapping .del.svelte-mlofvx{position:absolute;right:10px;top:2px}#gyre_mappings.svelte-mlofvx button.svelte-mlofvx{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}#gyre_mappings.svelte-mlofvx.svelte-mlofvx{z-index:200;position:fixed;left:10px;top:10px;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:20px;backdrop-filter:blur(20px) brightness(80%);box-shadow:0 0 1rem 0 rgba(255, 255, 255, 0.2);color:white;width:540px;display:block;border-radius:10px;font-size:14px}#gyre_mappings.svelte-mlofvx.svelte-mlofvx{display:none;width:480px;left:200px;top:200px}#gyre_mappings.svelte-mlofvx select.svelte-mlofvx{background-color:grey;font-size:14px;color:white;border:none;margin-top:10px;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}#gyre_mappings.svelte-mlofvx select.svelte-mlofvx{background:transparent;border:1px solid white;border-radius:5px}#gyre_mappings.svelte-mlofvx select option.svelte-mlofvx,#gyre_mappings.svelte-mlofvx select optgroup.svelte-mlofvx{background:black}#gyre_mappings.svelte-mlofvx h1.svelte-mlofvx{font-size:16px;margin-top:5px;margin-bottom:30px}#gyre_mappings.svelte-mlofvx .close.svelte-mlofvx{position:absolute;right:20px;top:20px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwcGluZ3Muc3ZlbHRlIiwic291cmNlcyI6WyJNYXBwaW5ncy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IG1ldGFkYXRhfSBmcm9tICcuL3N0b3Jlcy9tZXRhZGF0YSdcclxuICAgIGltcG9ydCBJY29uIGZyb20gJy4vSWNvbi5zdmVsdGUnXHJcbiAgICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnO1xyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyPXRydWVcclxuICAgIGltcG9ydCB7IG1hcHBpbmdzSGVscGVyIH0gZnJvbSAnLi9tYXBwaW5nc0hlbHBlci5qcydcclxuXHJcbiAgICBsZXQgc2hvd0d5cmVNYXBwaW5ncz1cIm5vbmVcIlxyXG4gICAgbGV0IGd5cmVNYXBwaW5nc0RpYWxvZ0xlZnQ9XCIxMDBweFwiXHJcbiAgICBsZXQgZ3lyZU1hcHBpbmdzRGlhbG9nVG9wPVwiMTAwcHhcIlxyXG4gICAgbGV0IHdpZGdldHM9W11cclxuICAgIGxldCBub2RlVHlwZT1cIlwiXHJcbiAgICBsZXQgbUg9bmV3IG1hcHBpbmdzSGVscGVyKClcclxuICAgIGxldCBtYXBwaW5nRmllbGRzPW1ILmdldE1hcHBpbmdGaWVsZHMoJG1ldGFkYXRhKVxyXG4gICAgbGV0IG5vZGVJZD0wXHJcbiAgICBmdW5jdGlvbiBvcGVuR3lyZU1hcHBpbmdzKG5vZGUsZSkge1xyXG4gICAgICAgIG1hcHBpbmdGaWVsZHM9bUguZ2V0TWFwcGluZ0ZpZWxkcygkbWV0YWRhdGEpXHJcbiAgICAgICAgc2hvd0d5cmVNYXBwaW5ncz1cImJsb2NrXCJcclxuICAgICAgICBub2RlSWQ9bm9kZS5pZFxyXG4gICAgICAgIGd5cmVNYXBwaW5nc0RpYWxvZ0xlZnQ9ZS5jbGllbnRYLTEwMCtcInB4XCJcclxuICAgICAgICBneXJlTWFwcGluZ3NEaWFsb2dUb3A9ZS5jbGllbnRZLTIwMCtcInB4XCJcclxuICAgICAgICB3aWRnZXRzPW5vZGUud2lkZ2V0c1xyXG4gICAgICAgIG5vZGVUeXBlPW5vZGUudHlwZVxyXG4gICAgICAgIGlmICghJG1ldGFkYXRhLm1hcHBpbmdzKSAkbWV0YWRhdGEubWFwcGluZ3M9e31cclxuICAgICAgICBtYXBwaW5ncz0kbWV0YWRhdGEubWFwcGluZ3Nbbm9kZUlkXVxyXG4gICAgICAgIGlmICghbWFwcGluZ3MpIG1hcHBpbmdzPVtdXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93Lm9wZW5HeXJlTWFwcGluZ3M9b3Blbkd5cmVNYXBwaW5ncyAgICAvLyBleHBvc2Ugb3BlbiBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgY2FsbGVkIGZyb20gQ29tZnlVSSBtZW51IGV4dGVuc2lvblxyXG5cclxuICAgIC8vIGNoZWNrIG9mIGEgd2lkZ2V0ICg9YSBub2RlIHByb3BlcnR5KSBpcyBjb25uZWN0ZWQgdG8gYSBmb3JtIGZpZWxkXHJcbiAgICBmdW5jdGlvbiBjaGVja0d5cmVNYXBwaW5nKG5vZGUsd2lkZ2V0KSB7XHJcbiAgICAgICAgaWYgICghJG1ldGFkYXRhLm1hcHBpbmdzKSByZXR1cm5cclxuICAgICAgICBpZiAoISRtZXRhZGF0YS5tYXBwaW5nc1tub2RlLmlkXSkgcmV0dXJuXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTwkbWV0YWRhdGEubWFwcGluZ3Nbbm9kZS5pZF0ubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgbWFwcGluZz0kbWV0YWRhdGEubWFwcGluZ3Nbbm9kZS5pZF1baV1cclxuICAgICAgICAgICAgaWYgKG1hcHBpbmcudG9GaWVsZD09PXdpZGdldC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBtYXBwaW5nLnRvSW5kZXg9aVxyXG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsPSh3aWRnZXQubGFiZWwgfHwgd2lkZ2V0Lm5hbWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWwrXCI9XCIrbWFwcGluZy5mcm9tRmllbGRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHdpbmRvdy5jaGVja0d5cmVNYXBwaW5nPWNoZWNrR3lyZU1hcHBpbmdcclxuXHJcbiAgICBmdW5jdGlvbiBneXJlU2V0Q29tYm9WYWx1ZXMod2lkZ2V0KSB7ICAgICAgICAgICAvLyB0b2RvOiBmaW5kIG91dCBpbiBmdXR1cmUgd2hlcmUgdG8gZGlyZWN0bHkgZ2V0IHRoZXNlIGluZm9ybWF0aW9uXHJcbiAgICAgICAgaWYgKHdpZGdldC50eXBlIT09XCJjb21ib1wiIHx8ICF3aWRnZXQub3B0aW9ucyAgfHwgIXdpZGdldC5vcHRpb25zLnZhbHVlcyB8fCAhd2lkZ2V0Lm5hbWUgKSByZXR1cm5cclxuICAgICAgICBpZiAod2lkZ2V0Lm5hbWU9PT1cImltYWdlXCIpIHJldHVyblxyXG4gICAgICAgIGlmKCEkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSAkbWV0YWRhdGEuY29tYm9fdmFsdWVzID0ge31cclxuICAgICAgICAkbWV0YWRhdGEuY29tYm9fdmFsdWVzW3dpZGdldC5uYW1lXT13aWRnZXQub3B0aW9ucy52YWx1ZXMgLy93aWRnZXQub3B0aW9uc1xyXG4gICAgfVxyXG4gICAgd2luZG93Lmd5cmVTZXRDb21ib1ZhbHVlcz1neXJlU2V0Q29tYm9WYWx1ZXNcclxuXHJcbiAgICBmdW5jdGlvbiBneXJlQ2xlYXJBbGxDb21ib1ZhbHVlcygpIHtcclxuICAgICAgICAkbWV0YWRhdGEuY29tYm9fdmFsdWVzID0ge31cclxuICAgIH1cclxuICAgIHdpbmRvdy5neXJlQ2xlYXJBbGxDb21ib1ZhbHVlcz1neXJlQ2xlYXJBbGxDb21ib1ZhbHVlc1xyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlRGlhbG9nKCkge1xyXG4gICAgICAgIHNob3dHeXJlTWFwcGluZ3M9XCJub25lXCJcclxuICAgIH1cclxuXHJcblxyXG4gICAgbGV0IG1hcHBpbmdzID0gW11cclxuICAgIGxldCBmcm9tRmllbGQ9XCJcIlxyXG4gICAgbGV0IHRvRmllbGQ9XCJcIlxyXG4gICAgbGV0IGFkZEZpZWxkPVwiXCJcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRNYXBwaW5nKCkge1xyXG4gICAgICAgIGlmICghdG9GaWVsZCB8fCAhZnJvbUZpZWxkKSByZXR1cm5cclxuICAgICAgICBpZiAoIW5vZGVJZCkgcmV0dXJuXHJcbiAgICAgICAgbWFwcGluZ3MucHVzaCh7IGZyb21GaWVsZCx0b0ZpZWxkICB9KVxyXG4gICAgICAgIG1hcHBpbmdzPW1hcHBpbmdzXHJcbiAgICAgICAgJG1ldGFkYXRhLm1hcHBpbmdzW25vZGVJZF0gPSBtYXBwaW5nc1xyXG4gICAgICAgIGZyb21GaWVsZD10b0ZpZWxkPWFkZEZpZWxkPVwiXCJcclxuICAgIH0gICAgXHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRm9ybUZpZWxkKGZpZWxkTmFtZSkge1xyXG4gICAgICAgIGlmICghbm9kZUlkKSByZXR1cm5cclxuICAgICAgICBpZiAoIWZpZWxkTmFtZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGNoZWNrSWZGaWVsZE5hbWVFeGlzdHMoZmllbGROYW1lKSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IHdpZGdldD1nZXRXaWRnZXQoZmllbGROYW1lKVxyXG4gICAgICAgIGlmICghd2lkZ2V0KSByZXR1cm5cclxuICAgICAgICBjb25zb2xlLmxvZyh3aWRnZXQpXHJcblxyXG4gICAgICAgIGxldCB0eXBlPXdpZGdldC50eXBlXHJcbiAgICAgICAgbGV0IGxhYmVsPWZpZWxkTmFtZVxyXG4gICAgICAgIGxhYmVsPWxhYmVsLnJlcGxhY2UoL18vZywgXCIgXCIpO1xyXG4gICAgICAgIGxhYmVsPWxhYmVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbGFiZWwuc2xpY2UoMSlcclxuICAgICAgICBsZXQgZmllbGQ9e25hbWU6ZmllbGROYW1lLGxhYmVsLGRlZmF1bHQ6d2lkZ2V0LnZhbHVlfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgaWYgKHdpZGdldC5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5taW49d2lkZ2V0Lm9wdGlvbnMubWluXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5tYXg9d2lkZ2V0Lm9wdGlvbnMubWF4XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5zdGVwPXdpZGdldC5vcHRpb25zLnJvdW5kICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBmaWVsZC5kZWZhdWx0PWZpZWxkLm1pbiAgICAgICAgIFxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJjdXN0b210ZXh0XCIpIHtcclxuICAgICAgICAgICAgZmllbGQudHlwZT1cInRleHRhcmVhXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGU9PT1cInRleHRcIikge1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlPVwidGV4dFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJjb21ib1wiKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGU9XCJwcmVfZmlsbGVkX2Ryb3Bkb3duXCJcclxuICAgICAgICAgICAgZmllbGQud2lkZ2V0X25hbWU9ZmllbGROYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJ0b2dnbGVcIikge1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAvLyAgIGZpZWxkLmRlZmF1bHQ9XCJmYWxzZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZmllbGQudHlwZSkgcmV0dXJuXHJcbiAgICBcclxuICAgICAgICBpZiAoISRtZXRhZGF0YS5mb3JtcykgJG1ldGFkYXRhLmZvcm1zPXt9XHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdCkgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQ9e31cclxuICAgICAgICBpZiAoISRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzKSAkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50cz1bXVxyXG4gICAgICAgIGxldCBmb3JtRmllbGRzPSRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzXHJcbiAgICAgICAgZm9ybUZpZWxkcy5wdXNoKGZpZWxkKVxyXG4gICAgICAgIG1hcHBpbmdzLnB1c2goeyBmcm9tRmllbGQ6ZmllbGROYW1lLHRvRmllbGQ6ZmllbGROYW1lICB9KVxyXG4gICAgICAgIG1hcHBpbmdzPW1hcHBpbmdzXHJcbiAgICAgICAgJG1ldGFkYXRhLm1hcHBpbmdzW25vZGVJZF0gPSBtYXBwaW5nc1xyXG4gICAgICAgIGZyb21GaWVsZD10b0ZpZWxkPWFkZEZpZWxkPVwiXCJcclxuICAgICAgLy8gXHJcbiAgICB9ICAgXHJcbiAgICBmdW5jdGlvbiBnZXRXaWRnZXQoZmllbGROYW1lKSB7XHJcbiAgICAgICAgaWYgKCF3aWRnZXRzKSByZXR1cm5cclxuICAgICAgICBmb3IobGV0IGk9MDtpPHdpZGdldHMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgd2lkZ2V0PXdpZGdldHNbaV1cclxuICAgICAgICAgICAgaWYgKHdpZGdldC5uYW1lPT09ZmllbGROYW1lKSByZXR1cm4gd2lkZ2V0XHJcbiAgICAgICAgfSAgICBcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZU1hcHBpbmcoaW5kZXgpIHtcclxuICAgICAgICBtYXBwaW5ncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIG1hcHBpbmdzPW1hcHBpbmdzXHJcbiAgICAgICAgJG1ldGFkYXRhLm1hcHBpbmdzW25vZGVJZF0gPSBtYXBwaW5nc1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2hlY2tJZkZpZWxkTmFtZUV4aXN0cyhuYW1lKSB7XHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEuZm9ybXMpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGxldCBmb3JtRmllbGRzPSRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzXHJcbiAgICAgICAgaWYgKCFmb3JtRmllbGRzKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGZvcm1GaWVsZHMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQ9Zm9ybUZpZWxkc1tpXVxyXG4gICAgICAgICAgICBpZiAoZmllbGQubmFtZT09PW5hbWUpIHJldHVybiB0cnVlICAgICAgICAgICAgXHJcbiAgICAgICAgfSAgICAgICBcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFkZEFsbEZvcm1GaWVsZHMoKSB7XHJcbiAgICAgICAgaWYgKCF3aWRnZXRzKSByZXR1cm5cclxuICAgICAgICBmb3IobGV0IGk9MDtpPHdpZGdldHMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgd2lkZ2V0PXdpZGdldHNbaV1cclxuICAgICAgICAgICAgYWRkRm9ybUZpZWxkKHdpZGdldC5uYW1lKVxyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgZGlzcGF0Y2goXCJ1cGRhdGVGb3JtXCIse30pXHJcbiAgICB9XHJcbjwvc2NyaXB0PlxyXG57I2lmIHJlbmRlcn1cclxuPGRpdiBpZD1cImd5cmVfbWFwcGluZ3NcIiBzdHlsZT1cImRpc3BsYXk6e3Nob3dHeXJlTWFwcGluZ3N9O2xlZnQ6e2d5cmVNYXBwaW5nc0RpYWxvZ0xlZnR9O3RvcDp7Z3lyZU1hcHBpbmdzRGlhbG9nVG9wfVwiID5cclxuICAgIDxoMT5GaWVsZCBNYXBwaW5nczwvaDE+XHJcbiAgICAgICAgPGRpdj57bm9kZVR5cGV9PC9kaXY+XHJcblxyXG4gICAgICAgIDxzZWxlY3QgIGJpbmQ6dmFsdWU9e2Zyb21GaWVsZH0+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiRm9ybSBmaWVsZHNcIj5cclxuICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5maWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkRlZmF1bHRzXCI+XHJcbiAgICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5kZWZhdWx0RmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICA8L29wdGdyb3VwPiAgICAgXHJcbiAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIk91dHB1dHNcIj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCBtYXBwaW5nRmllbGRzLm91dHB1dEZpZWxkcyBhcyBmaWVsZH1cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtmaWVsZC5uYW1lfT57ZmllbGQubmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgPC9vcHRncm91cD4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJhcnJvd1JpZ2h0XCI+PC9JY29uPlxyXG4gICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17dG9GaWVsZH0gPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0Li4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsjZWFjaCB3aWRnZXRzIGFzIHdpZGdldH1cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3dpZGdldC5uYW1lfT57d2lkZ2V0Lm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4ge2FkZE1hcHBpbmcoKX19PisgQWRkPC9idXR0b24+ICBcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4ge2FkZEZvcm1GaWVsZChhZGRGaWVsZCk7ZGlzcGF0Y2goXCJ1cGRhdGVGb3JtXCIse30pfX0+QWRkIGZvcm0gZmllbGQgZnJvbTwvYnV0dG9uPiAgICAgXHJcbiAgICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17YWRkRmllbGR9ID5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCB3aWRnZXRzIGFzIHdpZGdldH1cclxuICAgICAgICAgICAgICAgICAgICB7I2lmICFjaGVja0lmRmllbGROYW1lRXhpc3RzKHdpZGdldC5uYW1lKX1cclxuICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt3aWRnZXQubmFtZX0+e3dpZGdldC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7YWRkQWxsRm9ybUZpZWxkcygpfX0+QWRkICBhbGwgZmllbGRzIHRvIGZvcm08L2J1dHRvbj4gICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICB7I2VhY2ggbWFwcGluZ3MgYXMgbWFwcGluZywgaW5kZXh9XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYXBwaW5nXCI+XHJcbiAgICAgICAgICAgICAgICB7bWFwcGluZy5mcm9tRmllbGR9IDxJY29uIG5hbWU9XCJhcnJvd1JpZ2h0XCI+PC9JY29uPnttYXBwaW5nLnRvRmllbGR9XHJcbiAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlbFwiIG9uOmNsaWNrPXsoZSkgPT4ge2RlbGV0ZU1hcHBpbmcoKX19PjxJY29uIG5hbWU9XCJyZW1vdmVGcm9tTGlzdFwiPjwvSWNvbj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgey9lYWNofVxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xvc2VcIj48SWNvbiBuYW1lPVwiY2xvc2VcIiBvbjpjbGljaz17KGUpPT57Y2xvc2VEaWFsb2coKX19PjwvSWNvbj48L2Rpdj5cclxuPC9kaXY+XHJcbnsvaWZ9XHJcbjxzdHlsZT5cclxuXHJcblxyXG4jZ3lyZV9tYXBwaW5ncyAubWFwcGluZyB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcclxuICAgIG1hcmdpbi10b3A6MTBweDtcclxuICAgIHBhZGRpbmc6NXB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcbiNneXJlX21hcHBpbmdzIC5tYXBwaW5nIC5kZWwge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6MTBweDtcclxuICAgIHRvcDogMnB4O1xyXG59XHJcblxyXG5cclxuXHJcbiNneXJlX21hcHBpbmdzIGJ1dHRvbiB7XHJcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgbWluLXdpZHRoOiA3MHB4O1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9XHJcbiNneXJlX21hcHBpbmdzIHtcclxuICAgIHotaW5kZXg6IDIwMDtcclxuICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgIGxlZnQ6IDEwcHg7XHJcbiAgICB0b3A6IDEwcHg7XHJcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgIHBhZGRpbmc6IDIwcHg7XHJcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMjBweCkgYnJpZ2h0bmVzcyg4MCUpO1xyXG4gICAgYm94LXNoYWRvdzogMCAwIDFyZW0gMCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB3aWR0aDogNTQwcHg7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3Mge1xyXG4gICAgZGlzcGxheTpub25lO1xyXG4gICAgd2lkdGg6NDgwcHg7XHJcbiAgICBsZWZ0OjIwMHB4O1xyXG4gICAgdG9wOjIwMHB4O1xyXG59XHJcbiNneXJlX21hcHBpbmdzIHNlbGVjdCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiBub25lO1xyXG4gICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgcGFkZGluZzogM3B4O1xyXG59XHJcbiNneXJlX21hcHBpbmdzIHNlbGVjdCB7XHJcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG59XHJcbiNneXJlX21hcHBpbmdzIHNlbGVjdCBvcHRpb24sI2d5cmVfbWFwcGluZ3Mgc2VsZWN0IG9wdGdyb3VwIHtcclxuICAgIGJhY2tncm91bmQ6IGJsYWNrO1xyXG59XHJcbiNneXJlX21hcHBpbmdzIGgxIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi10b3A6IDVweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3MgLmNsb3NlIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAyMHB4O1xyXG4gICAgdG9wOjIwcHg7XHJcbn1cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNE5BLDRCQUFjLENBQUMsc0JB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 */");
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	child_ctx[36] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    // (161:0) {#if render}
    function create_if_block$1(ctx) {
    	let div4;
    	let h1;
    	let t1;
    	let div0;
    	let t2;
    	let t3;
    	let select0;
    	let option0;
    	let optgroup0;
    	let optgroup1;
    	let optgroup2;
    	let t5;
    	let icon0;
    	let t6;
    	let select1;
    	let option1;
    	let t8;
    	let button0;
    	let t10;
    	let div1;
    	let button1;
    	let t12;
    	let select2;
    	let option2;
    	let t14;
    	let div2;
    	let button2;
    	let t16;
    	let t17;
    	let div3;
    	let icon1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_5 = /*mappingFields*/ ctx[6].fields;
    	validate_each_argument(each_value_5);
    	let each_blocks_5 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_5[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*mappingFields*/ ctx[6].defaultFields;
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*mappingFields*/ ctx[6].outputFields;
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	icon0 = new Icon({
    			props: { name: "arrowRight" },
    			$$inline: true
    		});

    	let each_value_2 = /*widgets*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*widgets*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*mappings*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	icon1 = new Icon({ props: { name: "close" }, $$inline: true });
    	icon1.$on("click", /*click_handler_4*/ ctx[25]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Field Mappings";
    			t1 = space();
    			div0 = element("div");
    			t2 = text(/*nodeType*/ ctx[5]);
    			t3 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Select...";
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].c();
    			}

    			optgroup1 = element("optgroup");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			optgroup2 = element("optgroup");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t5 = space();
    			create_component(icon0.$$.fragment);
    			t6 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Select...";

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t8 = space();
    			button0 = element("button");
    			button0.textContent = "+ Add";
    			t10 = space();
    			div1 = element("div");
    			button1 = element("button");
    			button1.textContent = "Add form field from";
    			t12 = space();
    			select2 = element("select");
    			option2 = element("option");
    			option2.textContent = "Select...";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t14 = space();
    			div2 = element("div");
    			button2 = element("button");
    			button2.textContent = "Add  all fields to form";
    			t16 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t17 = space();
    			div3 = element("div");
    			create_component(icon1.$$.fragment);
    			attr_dev(h1, "class", "svelte-mlofvx");
    			add_location(h1, file$1, 162, 4, 5741);
    			add_location(div0, file$1, 163, 8, 5774);
    			option0.__value = "";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-mlofvx");
    			add_location(option0, file$1, 166, 12, 5853);
    			attr_dev(optgroup0, "label", "Form fields");
    			attr_dev(optgroup0, "class", "svelte-mlofvx");
    			add_location(optgroup0, file$1, 167, 12, 5902);
    			attr_dev(optgroup1, "label", "Defaults");
    			attr_dev(optgroup1, "class", "svelte-mlofvx");
    			add_location(optgroup1, file$1, 172, 9, 6116);
    			attr_dev(optgroup2, "label", "Outputs");
    			attr_dev(optgroup2, "class", "svelte-mlofvx");
    			add_location(optgroup2, file$1, 177, 12, 6344);
    			attr_dev(select0, "class", "svelte-mlofvx");
    			if (/*fromField*/ ctx[8] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[18].call(select0));
    			add_location(select0, file$1, 165, 8, 5807);
    			option1.__value = "";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-mlofvx");
    			add_location(option1, file$1, 185, 12, 6685);
    			attr_dev(select1, "class", "svelte-mlofvx");
    			if (/*toField*/ ctx[9] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[19].call(select1));
    			add_location(select1, file$1, 184, 8, 6641);
    			attr_dev(button0, "class", "svelte-mlofvx");
    			add_location(button0, file$1, 190, 8, 6877);
    			attr_dev(button1, "class", "svelte-mlofvx");
    			add_location(button1, file$1, 192, 12, 6963);
    			option2.__value = "";
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-mlofvx");
    			add_location(option2, file$1, 194, 16, 7136);
    			attr_dev(select2, "class", "svelte-mlofvx");
    			if (/*addField*/ ctx[10] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[22].call(select2));
    			add_location(select2, file$1, 193, 12, 7087);
    			add_location(div1, file$1, 191, 8, 6944);
    			attr_dev(button2, "class", "svelte-mlofvx");
    			add_location(button2, file$1, 203, 12, 7473);
    			add_location(div2, file$1, 202, 8, 7454);
    			attr_dev(div3, "class", "close svelte-mlofvx");
    			add_location(div3, file$1, 214, 8, 7975);
    			attr_dev(div4, "id", "gyre_mappings");
    			set_style(div4, "display", /*showGyreMappings*/ ctx[1]);
    			set_style(div4, "left", /*gyreMappingsDialogLeft*/ ctx[2]);
    			set_style(div4, "top", /*gyreMappingsDialogTop*/ ctx[3]);
    			attr_dev(div4, "class", "svelte-mlofvx");
    			add_location(div4, file$1, 161, 0, 5617);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h1);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div0, t2);
    			append_dev(div4, t3);
    			append_dev(div4, select0);
    			append_dev(select0, option0);
    			append_dev(select0, optgroup0);

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				if (each_blocks_5[i]) {
    					each_blocks_5[i].m(optgroup0, null);
    				}
    			}

    			append_dev(select0, optgroup1);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				if (each_blocks_4[i]) {
    					each_blocks_4[i].m(optgroup1, null);
    				}
    			}

    			append_dev(select0, optgroup2);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(optgroup2, null);
    				}
    			}

    			select_option(select0, /*fromField*/ ctx[8], true);
    			append_dev(div4, t5);
    			mount_component(icon0, div4, null);
    			append_dev(div4, t6);
    			append_dev(div4, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(select1, null);
    				}
    			}

    			select_option(select1, /*toField*/ ctx[9], true);
    			append_dev(div4, t8);
    			append_dev(div4, button0);
    			append_dev(div4, t10);
    			append_dev(div4, div1);
    			append_dev(div1, button1);
    			append_dev(div1, t12);
    			append_dev(div1, select2);
    			append_dev(select2, option2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(select2, null);
    				}
    			}

    			select_option(select2, /*addField*/ ctx[10], true);
    			append_dev(div4, t14);
    			append_dev(div4, div2);
    			append_dev(div2, button2);
    			append_dev(div4, t16);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div4, null);
    				}
    			}

    			append_dev(div4, t17);
    			append_dev(div4, div3);
    			mount_component(icon1, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[18]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[19]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[20], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[21], false, false, false, false),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[22]),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[23], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*nodeType*/ 32) set_data_dev(t2, /*nodeType*/ ctx[5]);

    			if (dirty[0] & /*mappingFields*/ 64) {
    				each_value_5 = /*mappingFields*/ ctx[6].fields;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_5[i]) {
    						each_blocks_5[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_5[i] = create_each_block_5(child_ctx);
    						each_blocks_5[i].c();
    						each_blocks_5[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_5.length; i += 1) {
    					each_blocks_5[i].d(1);
    				}

    				each_blocks_5.length = each_value_5.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 64) {
    				each_value_4 = /*mappingFields*/ ctx[6].defaultFields;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_4$1(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_4.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 64) {
    				each_value_3 = /*mappingFields*/ ctx[6].outputFields;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3$1(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(optgroup2, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty[0] & /*fromField, mappingFields*/ 320) {
    				select_option(select0, /*fromField*/ ctx[8]);
    			}

    			if (dirty[0] & /*widgets*/ 16) {
    				each_value_2 = /*widgets*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*toField, widgets*/ 528) {
    				select_option(select1, /*toField*/ ctx[9]);
    			}

    			if (dirty[0] & /*widgets, checkIfFieldNameExists*/ 65552) {
    				each_value_1 = /*widgets*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*addField, widgets*/ 1040) {
    				select_option(select2, /*addField*/ ctx[10]);
    			}

    			if (dirty[0] & /*deleteMapping, mappings*/ 32896) {
    				each_value = /*mappings*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div4, t17);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*showGyreMappings*/ 2) {
    				set_style(div4, "display", /*showGyreMappings*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*gyreMappingsDialogLeft*/ 4) {
    				set_style(div4, "left", /*gyreMappingsDialogLeft*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*gyreMappingsDialogTop*/ 8) {
    				set_style(div4, "top", /*gyreMappingsDialogTop*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_5, detaching);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_component(icon0);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(161:0) {#if render}",
    		ctx
    	});

    	return block;
    }

    // (169:14) {#each mappingFields.fields as field}
    function create_each_block_5(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[42].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[42].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 169, 20, 6007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 64 && t_value !== (t_value = /*field*/ ctx[42].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 64 && option_value_value !== (option_value_value = /*field*/ ctx[42].name)) {
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
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(169:14) {#each mappingFields.fields as field}",
    		ctx
    	});

    	return block;
    }

    // (174:16) {#each mappingFields.defaultFields as field}
    function create_each_block_4$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[42].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[42].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 174, 20, 6227);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 64 && t_value !== (t_value = /*field*/ ctx[42].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 64 && option_value_value !== (option_value_value = /*field*/ ctx[42].name)) {
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
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(174:16) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (179:16) {#each mappingFields.outputFields as field}
    function create_each_block_3$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[42].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[42].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 179, 20, 6453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 64 && t_value !== (t_value = /*field*/ ctx[42].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 64 && option_value_value !== (option_value_value = /*field*/ ctx[42].name)) {
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
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(179:16) {#each mappingFields.outputFields as field}",
    		ctx
    	});

    	return block;
    }

    // (187:12) {#each widgets as widget}
    function create_each_block_2$1(ctx) {
    	let option;
    	let t_value = /*widget*/ ctx[37].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget*/ ctx[37].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 187, 16, 6777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*widgets*/ 16 && t_value !== (t_value = /*widget*/ ctx[37].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*widgets*/ 16 && option_value_value !== (option_value_value = /*widget*/ ctx[37].name)) {
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
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(187:12) {#each widgets as widget}",
    		ctx
    	});

    	return block;
    }

    // (197:20) {#if !checkIfFieldNameExists(widget.name)}
    function create_if_block_1$1(ctx) {
    	let option;
    	let t_value = /*widget*/ ctx[37].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget*/ ctx[37].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$1, 197, 23, 7303);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*widgets*/ 16 && t_value !== (t_value = /*widget*/ ctx[37].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*widgets*/ 16 && option_value_value !== (option_value_value = /*widget*/ ctx[37].name)) {
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(197:20) {#if !checkIfFieldNameExists(widget.name)}",
    		ctx
    	});

    	return block;
    }

    // (196:16) {#each widgets as widget}
    function create_each_block_1$1(ctx) {
    	let show_if = !/*checkIfFieldNameExists*/ ctx[16](/*widget*/ ctx[37].name);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_1$1(ctx);

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
    			if (dirty[0] & /*widgets*/ 16) show_if = !/*checkIfFieldNameExists*/ ctx[16](/*widget*/ ctx[37].name);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
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
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(196:16) {#each widgets as widget}",
    		ctx
    	});

    	return block;
    }

    // (207:8) {#each mappings as mapping, index}
    function create_each_block$1(ctx) {
    	let div1;
    	let t0_value = /*mapping*/ ctx[34].fromField + "";
    	let t0;
    	let t1;
    	let icon0;
    	let t2_value = /*mapping*/ ctx[34].toField + "";
    	let t2;
    	let t3;
    	let div0;
    	let icon1;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { name: "arrowRight" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { name: "removeFromList" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(icon0.$$.fragment);
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			create_component(icon1.$$.fragment);
    			attr_dev(div0, "class", "del svelte-mlofvx");
    			add_location(div0, file$1, 210, 16, 7832);
    			attr_dev(div1, "class", "mapping svelte-mlofvx");
    			add_location(div1, file$1, 207, 12, 7633);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			mount_component(icon0, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			mount_component(icon1, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_3*/ ctx[24], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*mappings*/ 128) && t0_value !== (t0_value = /*mapping*/ ctx[34].fromField + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*mappings*/ 128) && t2_value !== (t2_value = /*mapping*/ ctx[34].toField + "")) set_data_dev(t2, t2_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(207:8) {#each mappings as mapping, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*render*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*render*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*render*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(27, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mappings', slots, []);
    	const dispatch = createEventDispatcher();
    	let { render = true } = $$props;
    	let showGyreMappings = "none";
    	let gyreMappingsDialogLeft = "100px";
    	let gyreMappingsDialogTop = "100px";
    	let widgets = [];
    	let nodeType = "";
    	let mH = new mappingsHelper();
    	let mappingFields = mH.getMappingFields($metadata);
    	let nodeId = 0;

    	function openGyreMappings(node, e) {
    		$$invalidate(6, mappingFields = mH.getMappingFields($metadata));
    		$$invalidate(1, showGyreMappings = "block");
    		nodeId = node.id;
    		$$invalidate(2, gyreMappingsDialogLeft = e.clientX - 100 + "px");
    		$$invalidate(3, gyreMappingsDialogTop = e.clientY - 200 + "px");
    		$$invalidate(4, widgets = node.widgets);
    		$$invalidate(5, nodeType = node.type);
    		if (!$metadata.mappings) set_store_value(metadata, $metadata.mappings = {}, $metadata);
    		$$invalidate(7, mappings = $metadata.mappings[nodeId]);
    		if (!mappings) $$invalidate(7, mappings = []);
    	}

    	window.openGyreMappings = openGyreMappings; // expose open function so it can be called from ComfyUI menu extension

    	// check of a widget (=a node property) is connected to a form field
    	function checkGyreMapping(node, widget) {
    		if (!$metadata.mappings) return;
    		if (!$metadata.mappings[node.id]) return;

    		for (let i = 0; i < $metadata.mappings[node.id].length; i++) {
    			let mapping = $metadata.mappings[node.id][i];

    			if (mapping.toField === widget.name) {
    				mapping.toIndex = i;
    				let label = widget.label || widget.name;
    				return label + "=" + mapping.fromField;
    			}
    		}
    	}

    	window.checkGyreMapping = checkGyreMapping;

    	function gyreSetComboValues(widget) {
    		// todo: find out in future where to directly get these information
    		if (widget.type !== "combo" || !widget.options || !widget.options.values || !widget.name) return;

    		if (widget.name === "image") return;
    		if (!$metadata.combo_values) set_store_value(metadata, $metadata.combo_values = {}, $metadata);
    		set_store_value(metadata, $metadata.combo_values[widget.name] = widget.options.values, $metadata); //widget.options
    	}

    	window.gyreSetComboValues = gyreSetComboValues;

    	function gyreClearAllComboValues() {
    		set_store_value(metadata, $metadata.combo_values = {}, $metadata);
    	}

    	window.gyreClearAllComboValues = gyreClearAllComboValues;

    	function closeDialog() {
    		$$invalidate(1, showGyreMappings = "none");
    	}

    	let mappings = [];
    	let fromField = "";
    	let toField = "";
    	let addField = "";

    	function addMapping() {
    		if (!toField || !fromField) return;
    		if (!nodeId) return;
    		mappings.push({ fromField, toField });
    		$$invalidate(7, mappings);
    		set_store_value(metadata, $metadata.mappings[nodeId] = mappings, $metadata);
    		$$invalidate(8, fromField = $$invalidate(9, toField = $$invalidate(10, addField = "")));
    	}

    	function addFormField(fieldName) {
    		if (!nodeId) return;
    		if (!fieldName) return;
    		if (checkIfFieldNameExists(fieldName)) return;
    		let widget = getWidget(fieldName);
    		if (!widget) return;
    		console.log(widget);
    		let type = widget.type;
    		let label = fieldName;
    		label = label.replace(/_/g, " ");
    		label = label.charAt(0).toUpperCase() + label.slice(1);

    		let field = {
    			name: fieldName,
    			label,
    			default: widget.value
    		};

    		if (type === "number") {
    			field.type = "number";

    			if (widget.options) {
    				field.min = widget.options.min;
    				field.max = widget.options.max;
    				field.step = widget.options.round;
    			} // field.default=field.min         
    		}

    		if (type === "customtext") {
    			field.type = "textarea";
    		}

    		if (type === "text") {
    			field.type = "text";
    		}

    		if (type === "combo") {
    			field.type = "pre_filled_dropdown";
    			field.widget_name = fieldName;
    		}

    		if (type === "toggle") {
    			field.type = "checkbox";
    		} //   field.default="false"

    		if (!field.type) return;
    		if (!$metadata.forms) set_store_value(metadata, $metadata.forms = {}, $metadata);
    		if (!$metadata.forms.default) set_store_value(metadata, $metadata.forms.default = {}, $metadata);
    		if (!$metadata.forms.default.elements) set_store_value(metadata, $metadata.forms.default.elements = [], $metadata);
    		let formFields = $metadata.forms.default.elements;
    		formFields.push(field);
    		mappings.push({ fromField: fieldName, toField: fieldName });
    		$$invalidate(7, mappings);
    		set_store_value(metadata, $metadata.mappings[nodeId] = mappings, $metadata);
    		$$invalidate(8, fromField = $$invalidate(9, toField = $$invalidate(10, addField = "")));
    	} // 

    	function getWidget(fieldName) {
    		if (!widgets) return;

    		for (let i = 0; i < widgets.length; i++) {
    			let widget = widgets[i];
    			if (widget.name === fieldName) return widget;
    		}
    	}

    	function deleteMapping(index) {
    		mappings.splice(index, 1);
    		$$invalidate(7, mappings);
    		set_store_value(metadata, $metadata.mappings[nodeId] = mappings, $metadata);
    	}

    	function checkIfFieldNameExists(name) {
    		if (!$metadata.forms) return false;
    		if (!$metadata.forms.default) return false;
    		let formFields = $metadata.forms.default.elements;
    		if (!formFields) return false;

    		for (let i = 0; i < formFields.length; i++) {
    			let field = formFields[i];
    			if (field.name === name) return true;
    		}

    		return false;
    	}

    	function addAllFormFields() {
    		if (!widgets) return;

    		for (let i = 0; i < widgets.length; i++) {
    			let widget = widgets[i];
    			addFormField(widget.name);
    		}

    		dispatch("updateForm", {});
    	}

    	const writable_props = ['render'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Mappings> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		fromField = select_value(this);
    		$$invalidate(8, fromField);
    		$$invalidate(6, mappingFields);
    	}

    	function select1_change_handler() {
    		toField = select_value(this);
    		$$invalidate(9, toField);
    		$$invalidate(4, widgets);
    	}

    	const click_handler = e => {
    		addMapping();
    	};

    	const click_handler_1 = e => {
    		addFormField(addField);
    		dispatch("updateForm", {});
    	};

    	function select2_change_handler() {
    		addField = select_value(this);
    		$$invalidate(10, addField);
    		$$invalidate(4, widgets);
    	}

    	const click_handler_2 = e => {
    		addAllFormFields();
    	};

    	const click_handler_3 = e => {
    		deleteMapping();
    	};

    	const click_handler_4 = e => {
    		closeDialog();
    	};

    	$$self.$$set = $$props => {
    		if ('render' in $$props) $$invalidate(0, render = $$props.render);
    	};

    	$$self.$capture_state = () => ({
    		metadata,
    		Icon,
    		createEventDispatcher,
    		dispatch,
    		render,
    		mappingsHelper,
    		showGyreMappings,
    		gyreMappingsDialogLeft,
    		gyreMappingsDialogTop,
    		widgets,
    		nodeType,
    		mH,
    		mappingFields,
    		nodeId,
    		openGyreMappings,
    		checkGyreMapping,
    		gyreSetComboValues,
    		gyreClearAllComboValues,
    		closeDialog,
    		mappings,
    		fromField,
    		toField,
    		addField,
    		addMapping,
    		addFormField,
    		getWidget,
    		deleteMapping,
    		checkIfFieldNameExists,
    		addAllFormFields,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('render' in $$props) $$invalidate(0, render = $$props.render);
    		if ('showGyreMappings' in $$props) $$invalidate(1, showGyreMappings = $$props.showGyreMappings);
    		if ('gyreMappingsDialogLeft' in $$props) $$invalidate(2, gyreMappingsDialogLeft = $$props.gyreMappingsDialogLeft);
    		if ('gyreMappingsDialogTop' in $$props) $$invalidate(3, gyreMappingsDialogTop = $$props.gyreMappingsDialogTop);
    		if ('widgets' in $$props) $$invalidate(4, widgets = $$props.widgets);
    		if ('nodeType' in $$props) $$invalidate(5, nodeType = $$props.nodeType);
    		if ('mH' in $$props) mH = $$props.mH;
    		if ('mappingFields' in $$props) $$invalidate(6, mappingFields = $$props.mappingFields);
    		if ('nodeId' in $$props) nodeId = $$props.nodeId;
    		if ('mappings' in $$props) $$invalidate(7, mappings = $$props.mappings);
    		if ('fromField' in $$props) $$invalidate(8, fromField = $$props.fromField);
    		if ('toField' in $$props) $$invalidate(9, toField = $$props.toField);
    		if ('addField' in $$props) $$invalidate(10, addField = $$props.addField);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		render,
    		showGyreMappings,
    		gyreMappingsDialogLeft,
    		gyreMappingsDialogTop,
    		widgets,
    		nodeType,
    		mappingFields,
    		mappings,
    		fromField,
    		toField,
    		addField,
    		dispatch,
    		closeDialog,
    		addMapping,
    		addFormField,
    		deleteMapping,
    		checkIfFieldNameExists,
    		addAllFormFields,
    		select0_change_handler,
    		select1_change_handler,
    		click_handler,
    		click_handler_1,
    		select2_change_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Mappings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { render: 0 }, add_css$2, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mappings",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get render() {
    		throw new Error("<Mappings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set render(value) {
    		throw new Error("<Mappings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class loopPreparser {

      constructor(workflow) {
        this.workflow = workflow;
        this.nodeMapping = {};
      }

      getGroup(node, groups) {
        return groups.find(group => {
          const [gx, gy, gWidth, gHeight] = group.bounding;
          const [nx, ny] = node.pos;
          return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
        });
      }
      getNodeById(nodeId) {
        return this.workflow.nodes.find(node => node.id === nodeId)
      }
      getGroupByName(groupName) {
        return this.workflow.groups.find(group => group.title === groupName)
      }
      isNodeInGroup(nodeId, groupName) {
        const node = this.workflow.nodes.find(n => n.id === nodeId);
        if (!node) return false; // Node not found

        const group = this.workflow.groups.find(group => group.title === groupName && group.bounding);
        if (!group) return false; // Group not found

        const [gx, gy, gWidth, gHeight] = group.bounding;
        const [nx, ny] = node.pos;
        return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
      }
      /**
       * link data structures are redudant in ComfyUI so re-generate link infos from global linkk structure
       */
      updateNodeLinks() {
        // Step 1: Clear existing link IDs from inputs and outputs
        this.workflow.nodes.forEach(node => {
          if (node.inputs) {
            node.inputs.forEach(input => {
              input.link = null;
            });
          }
          if (node.outputs) {
            node.outputs.forEach(output => {
              output.links = [];
            });
          }
        });

        // Step 2: Iterate over links to update inputs and outputs
        this.workflow.links.forEach(link => {
          const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;
          const fromNode = this.workflow.nodes.find(node => node.id === fromNodeID);
          const toNode = this.workflow.nodes.find(node => node.id === toNodeID);

          if (fromNode && fromNode.outputs && fromNode.outputs[fromSlot]) {
            if (!fromNode.outputs[fromSlot].links) {
              fromNode.outputs[fromSlot].links = [];
            }
            fromNode.outputs[fromSlot].links.push(linkID);
          }

          if (toNode && toNode.inputs && toNode.inputs[toSlot]) {
            toNode.inputs[toSlot].link = linkID;
          }
        });
      }

     removeGyreNodesAndLinkDirectly() {
        // Iterate backwards to avoid indexing issues after removal
        for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
          const node = this.workflow.nodes[i];
          if (node.type === "GyreLoopStart" || node.type === "GyreLoopEnd") {
            const outgoingLink = this.workflow.links.find(link => link[1] === node.id);
            const incomingLink = this.workflow.links.find(link => link[3] === node.id);
            
            if (outgoingLink && incomingLink) {
              // Create a new link replacing the GyreNode
              const newLink = [this.workflow.last_link_id + 1, incomingLink[1], incomingLink[2], outgoingLink[3], outgoingLink[4], outgoingLink[5]];
              this.workflow.last_link_id++; // Update last link ID
              this.workflow.links.push(newLink);
              // Remove the original links
              this.workflow.links = this.workflow.links.filter(link => link[0] !== outgoingLink[0] && link[0] !== incomingLink[0]);
      
              // Remove the GyreLoop node
              this.workflow.nodes.splice(i, 1);
            }
          }
        }
      }
      

      /*
      for the conections between the groups add a GyreLoopStart node in-between so it is easier to make another group 
       */
      splitLinkWithGyreStartNode(linkID) {
        const linkIndex = this.workflow.links.findIndex(link => link[0] === linkID);
        if (linkIndex === -1) return // Link not found
        const originalLink = this.workflow.links[linkIndex];
        const [_, fromNodeID, fromSlot, toNodeID, toSlot, type] = originalLink;
      
        // Assuming workflow.last_node_id and workflow.last_link_id are correctly set
        const newGyreStartNodeID = ++this.workflow.last_node_id;
        const newLink1ID = ++this.workflow.last_link_id;
        const newLink2ID = ++this.workflow.last_link_id;
      
        // Create GyreStartNode
        const gyreStartNode = {
          id: newGyreStartNodeID,
          type: 'GyreLoopStart',
          pos: [0, 0],    // willbe removed anyway
          inputs:[
            {
                "name": "ANY",
                "type": "*",
                "link": 16
            }
        ]};
        this.workflow.nodes.push(gyreStartNode);
        // Create the first new link from the original source to the GyreStartNode
        const newLink1 = [newLink1ID, fromNodeID, fromSlot, newGyreStartNodeID, 0 /* Assuming slot 0 for GyreStartNode */, type];
        // Create the second new link from the GyreStartNode to the original destination
        const newLink2 = [newLink2ID, newGyreStartNodeID, 0 /* Assuming slot 0 for output */, toNodeID, toSlot, type];  
        // Add the new links to the workflow
        this.workflow.links.push(newLink1, newLink2);
        // Remove the original link
        this.workflow.links.splice(linkIndex, 1);
      }
      /* Gyre loops: reroute end loop link and make new link between groups
      */
      adjustLinksForSpecialNodes(groupName) {
        // 1. reroute to end loop
        // Assuming `this.nodeMapping` maps original node IDs to their new duplicated IDs
        const gyreLoopEndNodes = this.workflow.nodes.filter(node => node.type === "GyreLoopEnd").map(node => node.id);

        const linksToRemove = []; // Ids only
        let removedLinks = [];  // store link objects for new links between groups
        const newLinks = [];
      
        this.workflow.links.forEach(link => {
          const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;

          if (gyreLoopEndNodes.includes(toNodeID) && this.isNodeInGroup(fromNodeID, groupName)) {
            // Mark this link for removal
            linksToRemove.push(linkID);
            removedLinks.push([...link]); 
            // Create a new link from the cloned node to the "GyreLoopEnd" node
            const newLink = [this.workflow.last_link_id + 1, this.nodeMapping[fromNodeID], fromSlot, toNodeID, toSlot, type];
            newLinks.push(newLink);
            this.workflow.last_link_id++;
          }
        });

        // Remove identified links
        this.workflow.links = this.workflow.links.filter(link => !linksToRemove.includes(link[0]));

        // Add new links
        this.workflow.links.push(...newLinks);


        // For each link removed earlier...
        // Assuming removedLinks and nodeMapping are already defined
        // generate connections between groups
        removedLinks.forEach(removedLink => {
          const [removedLinkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = removedLink;
          // Find a link where the toNode is the destination of a link from a "GyreLoopStart"
          let linkFromGyreLoopStart; 
          this.workflow.links.forEach(link => {
            const [_, linkFromNodeID, __, linkToNodeID, slot, linkType] = link;
            if (this.getNodeById(linkFromNodeID).type==="GyreLoopStart" && this.isNodeInGroup(linkToNodeID,groupName)) {
              if (fromSlot===slot) linkFromGyreLoopStart=link;
            }
          });
          if (linkFromGyreLoopStart) {
            // Assuming you can find the cloned node ID for the node that was linked to by the GyreLoopStart
            const clonedToNodeID = this.nodeMapping[linkFromGyreLoopStart[3]]; // Use the toNodeID of the linkFromGyreLoopStart for mapping
            if (clonedToNodeID) {
              const newLinkID = ++this.workflow.last_link_id;
              const newLink = [newLinkID, fromNodeID, fromSlot, clonedToNodeID, fromSlot, type]; // same slot here, this is current limitation
        //      console.log("new between groups link",newLink)
              this.workflow.links.push(newLink);
              this.splitLinkWithGyreStartNode(newLinkID);
            }
          }
        });
      }

      duplicateGroupWithNodesAndLinks(groupName,groupNameClone) {
        // Assuming getGroupByName and isNodeInGroup functions are defined elsewhere
        const originalGroup = this.getGroupByName(groupName);
        if (!originalGroup) return; // Exit if group not found

        let maxNodeId = this.workflow.last_node_id;
        let maxLinkId = this.workflow.last_link_id;

        // Duplicate group
        const newGroup = JSON.parse(JSON.stringify(originalGroup));
        newGroup.title = groupNameClone; 
        newGroup.bounding[0] += originalGroup.bounding[2]+70; // Shift the new group to prevent overlap
        this.workflow.groups.push(newGroup);

        this.nodeMapping = {}; // Map old node IDs to new node IDs

        // Duplicate nodes
        this.workflow.nodes.forEach(node => {
          if (this.isNodeInGroup(node.id, groupName)) {
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.id = ++maxNodeId;
            newNode.pos[0] += originalGroup.bounding[2]+70; // Shift the new group to prevent overlap
            this.nodeMapping[node.id] = newNode.id; // Map old ID to new ID
            this.workflow.nodes.push(newNode);
            console.log("add node", newNode);
          }
        });

        this.workflow.links.forEach(link => {
          const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link; // Destructure the original link array
          // Check if both source and target nodes are within the group being duplicated
          if (this.nodeMapping[fromNodeID] && this.nodeMapping[toNodeID]) {
            // Create a new link for the duplicated nodes
            const newLink = [
              ++maxLinkId, // Assign a new unique ID for the link
              this.nodeMapping[fromNodeID], // Map old source node ID to new
              fromSlot, // Preserve the original fromSlot
              this.nodeMapping[toNodeID], // Map old target node ID to new
              toSlot, // Preserve the original toSlot
              type // Preserve the link type
            ];
            this.workflow.links.push(newLink); // Add this new link to the workflow
          }
        });

        // outside links going inside group nodes duplication
        this.workflow.links.forEach(link => {
          const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;
          const fromNode = this.workflow.nodes.find(node => node.id === fromNodeID);
          this.workflow.nodes.find(node => node.id === toNodeID);

          // Check if the toNode is inside the group and fromNode is outside and not of specific types
          if (this.isNodeInGroup(toNodeID, groupName) && !this.isNodeInGroup(fromNodeID, groupName) &&
            fromNode.type !== 'GyreLoopStart' && fromNode.type !== 'GyreLoopEnd') {
            // Logic to duplicate the link here
            const newLinkID = ++maxLinkId; // Increment and assign new max link ID
            const newLink = [newLinkID, fromNodeID, fromSlot, this.nodeMapping[toNodeID], toSlot, type];
            this.workflow.links.push(newLink);
          }
        });
        this.workflow.last_link_id = maxLinkId;
        this.workflow.last_node_id = maxNodeId;
      
        this.adjustLinksForSpecialNodes(groupName);
        this.cloneMappings(groupName);

      }

      /**
       * clone mappings
       * @param string groupName 
       * @returns 
       */
      cloneMappings(groupName) {
        let mappings=this.workflow.extra.gyre.mappings;
        if (!mappings) return
        for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
          const node = this.workflow.nodes[i];
          if (this.isNodeInGroup(node.id,groupName)) {
            let nodeMappings=mappings[node.id];
            if (nodeMappings) {
              let newNodeID=this.nodeMapping[node.id];
              if (newNodeID) {
                mappings[newNodeID]=JSON.parse(JSON.stringify(nodeMappings));
              }
              
            }
          }
        }

        this.workflow.extra.gyre.mappings=mappings;
      }
      deactivateGroup(groupName) {
        for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
          const node = this.workflow.nodes[i];
          if (this.isNodeInGroup(node.id,groupName)) {
            node.mode=4; // deactivate it
          }
        }
        
      }
      generateLoop(arrayName,arraySize) {
        let group=this.getGroupByName(arrayName+"[]");
        if (!group) return
        group.title=arrayName+"[0]";

        if (arraySize===0) {  // deactivate group nodes
          this.deactivateGroup(arrayName+"[0]");
          this.removeGyreNodesAndLinkDirectly();    
          this.updateNodeLinks();
          return
        }
        if (arraySize>1) {  // only rename group and remove loop nodes
          for(let i=0;i<arraySize-1;i++) {  
            this.duplicateGroupWithNodesAndLinks(arrayName+"["+i+"]",arrayName+"["+(i+1)+"]");    
          }
        }
        this.removeGyreNodesAndLinkDirectly();    
        this.updateNodeLinks();
      }

    }

    class valuePreparser {

        constructor(workflow) {
          this.workflow = workflow;
          this.loopParser=new loopPreparser(workflow);
          this.rules=new rulesExecution();
          if (!workflow.extra.gyre) return
          this.metadata=workflow.extra.gyre;
          this.fieldList=[];
          if (this.metadata.forms && this.metadata.forms.default)  this.fieldList=this.metadata.forms.default.elements;
        }


        getNodeById(nodeId) {
            return this.workflow.nodes.find(node => node.id === nodeId)
          }
        /* mergedImage, mask, controlnet[].image
        */
        async getImage(propertyName,arrayName="",index=0) {   
            console.log("get image ",propertyName,arrayName,index);
            return "" // filename on comfyUI
        }
        /**
         * get layer image
         * @param {string} layerName , special names: currentLayer, currentLayerAbove, currentLayerBelow
         */
        async getLayerImage(layerName) {
            console.log("get layer image ",layerName);
            return "" // filename on comfyUI
        }
        /**
         * convert value (e.g. boolean) also get images from frontend
         * @param {*} value 
         * @param {object} field 
         * @param {string} arrayName 
         * @param {number} index 
         * @returns 
         */
        async convertValue(value,field,arrayName="",index=0) {
            if (field.type==="image") {

                    if (!arrayName) {
                        console.log("get image for field",field.name);
                        return await this.getImage(field.name)
                    } else {
                        let propertyName= field.name.split(".")[1];  // e.g. image from controlnet[].image
                        return await this.getImage(propertyName,arrayName,index) // e.g. image,controlnet,0 for controlnet[0].image            
                    }
            }
            if (field.type==="layer_image") {
                return await this.getImage(field.name)
            }
            return  this.rules.convertValue(value,field)
        }
        /**
         * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) and set value
         * @param {object} field the field object {name,type,min,max,...}
         * @param {string} fromFieldName full name with array name and index (e.g. "steps" or "controlnet[0].model")
         * @param {*} value 
         */
        async setNodesValue(field,fromFieldName,value) {
            for (let nodeId in this.metadata.mappings) {
                let mappingList=this.metadata.mappings[nodeId];
                let nodeIdInt=parseInt(nodeId);
                let node=this.loopParser.getNodeById(nodeIdInt);
                if (!node) {
                    console.log("could not find node with id ",JSON.stringify(nodeIdInt));
                }
                if (node) {
                    for(let i=0;i<mappingList.length;i++) {
                        let mapping=mappingList[i];
                        
                        if (mapping && mapping.fromField===fromFieldName) {
                            value=await this.convertValue(value,field);
    //                        console.log("setNodesValue",node,value,mapping.toIndex)
                            node.widgets_values[parseInt(mapping.toIndex)]=value;
                        }                
                    }
                }

            }
        }
        /**
         * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) inside a group and set value
         * @param {object} field the field object {name,type,min,max,...}
         * @param {string} fromFieldName full name with array name without index "controlnet[].model")
         * @param {string} groupName the group name - e.g. controlnet[0], controlnet[1],...
         * @param {string} arrayName  the array name - e.g. controlnet
         * @param {number} arrayName  the index in array (0,1,...)
        * @param {*} value 
         */
        async setNodesValueGroup(field,fromFieldName,groupName,value,arrayName,index) {
            for (let i=0;i<this.workflow.nodes.length;i++) {
                let node=this.workflow.nodes[i];
                if (this.loopParser.isNodeInGroup(node.id,groupName)) { // only nodes in group
                    let mappingList=this.metadata.mappings[node.id];
                    for(let i=0;i<mappingList.length;i++) {
                        let mapping=mappingList[i];
                        if (mapping && mapping.fromField===fromFieldName) {
                            value=await this.convertValue(value,field,arrayName,index);
                            node.widgets_values[parseInt(mapping.toIndex)]=value;
                        }
                    }          
                }

            }
        }

        /**
         * Modify workflow values by using mapping and data from image editor
         * data object has to be filled with
         *  prompt
         *  negativePrompt
         *  hasMask
         *  optional: controlnet array
         * @param {object} data 
         */
        async setValues(data) {
            if (!this.metadata) return
            if (!this.metadata.mappings) return
            for (let name in data) {
                let value=data[name];
                if (!Array.isArray(value)) {
                    let field=this.rules.getField(name,this.fieldList);
                    await this.setNodesValue(field,field.name,value);
                } else {
                    // replace array of object values
                    let arrayName=name;
                    for(let i=0;i<data[arrayName].length;i++) {
                        let element=data[arrayName][i];
                        for(let propName in element) {
                            let fieldName=arrayName+"[]."+propName;      // e.g. controlnet[].type
                            let fieldNameIndex=arrayName+"["+i+"]."+propName;      // e.g. controlnet[0].type
                            let value=element[propName];
                            let field=this.rules.getField(fieldName,this.fieldList);
                            await this.setNodesValue(field,fieldNameIndex,value);
                            let groupName=arrayName+"["+i+"]";                // e.g. controlnet[0]
                            await this.setNodesValueGroup(field,fieldName,groupName,value,arrayName,i);
                        }
                    }
                }
            }

        }
    }

    class ComfyUIPreparser {

        constructor(workflow) {
            this.workflow=workflow;
            if (!workflow.extra.gyre) return
            this.metadata=workflow.extra.gyre;
            this.fieldList=[];
            if (this.metadata.forms && this.metadata.forms.default)  this.fieldList=this.metadata.forms.default.elements;    
        }
        /**
         * extend workflow to set all loop nodes
         * @param {object} data 
         */
        generateLoops(data) {
            let loop=new loopPreparser(this.workflow);
            for (let name in data) {
                let value=data[name];
                if (Array.isArray(value)) {     // e.g. controlnet
                    loop.generateLoop(name,data[name].length);
                }
            }
        }
        /**
         * execute rules on 
         * @param {object} data 
         */
        executeAllRules(data) {
            let rules=new rulesExecution();
            rules.execute(data,this.fieldList,this.metadata.rules,{},"__ignore_arrays"); // first execute rules on non array props

            for (let name in data) {
                let value=data[name];
                if (Array.isArray(value)) {     // e.g. controlnet
                    for(let i=0;i<data[name].length;i++) {
                        rules=new rulesExecution();
                        let arrayIdx={};
                        arrayIdx[name]=i;
                        rules.execute(data,this.fieldList,this.metadata.rules,arrayIdx,name);    // execute rules on array
                    }
                }
            }

        }
        /**
         * replace all mappings with real values
         * @param {object} data 
         */
        async setValues(data) {
            let vp=new valuePreparser(this.workflow);
            await vp.setValues(data);
        }
        async execute(data) {
            this.generateLoops(data);
            this.executeAllRules(data);
            console.log(data);
            await this.setValues(data);
        }

        getTestData() {
            return {
                prompt: "fashion dog",
                negativePrompt: "ugly",
                hasMask: false,
                controlnet:[
                    { type:"pose",image:"empty"},
                    { type:"depth",image:"empty"},
                    { type:"scribble",image:"empty"}
                ],
                // some custom fields
                seed: 123,
                steps: 20
            }
        }

    }

    /* src\WorkflowManager.svelte generated by Svelte v3.59.2 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src\\WorkflowManager.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-1ac5lll", "@import 'dist/build/gyrestyles.css';\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gICAgaW1wb3J0IEZvcm1CdWlsZGVyIGZyb20gXCIuL0Zvcm1CdWlsZGVyLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQgUnVsZUVkaXRvciBmcm9tIFwiLi9SdWxlRWRpdG9yLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQgTWFwcGluZ3MgZnJvbSBcIi4vTWFwcGluZ3Muc3ZlbHRlXCJcclxuXHJcbiAgICBpbXBvcnQge3dyaXRhYmxlfSBmcm9tICdzdmVsdGUvc3RvcmUnXHJcbiAgICBpbXBvcnQge29uTW91bnR9IGZyb20gJ3N2ZWx0ZSdcclxuICAgIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gJy4vc3RvcmVzL21ldGFkYXRhJ1xyXG4gICAgaW1wb3J0IEljb24gZnJvbSAnLi9JY29uLnN2ZWx0ZSdcclxuICAgIGltcG9ydCB7IENvbWZ5VUlQcmVwYXJzZXIgfSBmcm9tICcuL0NvbWZ5VUlQcmVwYXJzZXIuanMnXHJcbiAgaW1wb3J0IHsgc2VsZWN0X29wdGlvbiB9IGZyb20gXCJzdmVsdGUvaW50ZXJuYWxcIjtcclxuXHJcbiAgICBsZXQgYWxsd29ya2Zsb3dzO1xyXG4gICAgbGV0IG1vdmluZyA9IGZhbHNlO1xyXG4gICAgbGV0IGxlZnQgPSAxMFxyXG4gICAgbGV0IHRvcCA9IDEwXHJcbiAgICBsZXQgc3R5bGVlbDtcclxuICAgIGxldCBsb2FkZWR3b3JrZmxvdztcclxuXHJcbiAgICBsZXQgZm9sZE91dCA9IGZhbHNlXHJcbiAgICBsZXQgbmFtZSA9IFwiXCIgICAvLyBjdXJyZW50IGxvYWRlZCB3b3JrZmxvdyBuYW1lXHJcbiAgICBsZXQgc3RhdGUgPSBcImxpc3RcIlxyXG4gICAgbGV0IHRhZ3MgPSBbXCJUeHQySW1hZ2VcIiwgXCJJbnBhaW50aW5nXCIsIFwiQ29udHJvbE5ldFwiLCBcIkxheWVyTWVudVwiLCBcIkRlYWN0aXZhdGVkXCJdXHJcbiAgICBsZXQgd29ya2Zsb3dMaXN0ID0gd3JpdGFibGUoW10pICAgIC8vIHRvZG86bG9hZCBhbGwgd29ya2Zsb3cgYmFzaWMgZGF0YSAobmFtZSwgbGFzdCBjaGFuZ2VkIGFuZCBneXJlIG9iamVjdCkgZnJvbSBzZXJ2ZXIgdmlhIHNlcnZlciByZXF1ZXN0XHJcbiAgICBsZXQgYWN0aXZhdGVkVGFncyA9IHt9XHJcbiAgICBsZXQgc2VsZWN0ZWRUYWcgPSBcIlwiXHJcblxyXG4gIFxyXG5cclxuICAgIGZ1bmN0aW9uIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIG1vdmluZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xyXG4gICAgICAgIGlmIChtb3ZpbmcpIHtcclxuICAgICAgICAgICAgbGVmdCArPSBlLm1vdmVtZW50WDtcclxuICAgICAgICAgICAgdG9wICs9IGUubW92ZW1lbnRZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdW50KGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCBsb2FkTGlzdCgpO1xyXG4gICAgICAgIGFkZEV4dGVybmFsTG9hZExpc3RlbmVyKCk7XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRFeHRlcm5hbExvYWRMaXN0ZW5lcigpIHtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbWZ5LWZpbGUtaW5wdXRcIik7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0TGlzdGVuZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlSW5wdXQgJiYgZmlsZUlucHV0LmZpbGVzICYmIGZpbGVJbnB1dC5maWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlSW5wdXQsIGZpbGVJbnB1dC5maWxlcyk7XHJcbiAgICAgICAgICAgICAgICBuZXcgRGF0ZShmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkKS50b0RhdGVTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgbGV0IGZpeGVkZmlsZW5hbWUgPSBnZXRBdmFsYWJsZUZpbGVOYW1lKGZpbGVJbnB1dC5maWxlc1swXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGxldCBncmFwaCA9IHdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5uYW1lID0gZml4ZWRmaWxlbmFtZTtcclxuICAgICAgICAgICAgICAgIGdyYXBoLmxhc3RNb2RpZmllZCA9IGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWRcclxuICAgICAgICAgICAgICAgIGlmICghZ3JhcGguZXh0cmE/LndvcmtzcGFjZV9pbmZvKSBncmFwaC5leHRyYS53b3Jrc3BhY2VfaW5mbyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEud29ya3NwYWNlX2luZm8ubmFtZSA9IGZpeGVkZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5leHRyYS53b3Jrc3BhY2VfaW5mby5sYXN0TW9kaWZpZWQgPSBmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEud29ya3NwYWNlX2luZm8ubGFzdE1vZGlmaWVkUmVhZGFibGUgPSBuZXcgRGF0ZShmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkKS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWdyYXBoLmV4dHJhLmd5cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaC5leHRyYS5neXJlID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBncmFwaC5leHRyYS5neXJlLmxhc3RNb2RpZmllZCA9IGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5leHRyYS5neXJlLmxhc3RNb2RpZmllZFJlYWRhYmxlID0gbmV3IERhdGUoZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxvYWRlZHdvcmtmbG93ID0gZ3JhcGg7XHJcbiAgICAgICAgICAgICAgICBsb2FkV29ya2Zsb3coZ3JhcGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBmaWxlSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZmlsZUlucHV0TGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZ2V0QXZhbGFibGVGaWxlTmFtZShuYW1lKSB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gJ25ldyc7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgbGV0IGluZCA9IDE7XHJcbiAgICAgICAgbGV0IGdvb2RuYW1lID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGV4dCA9IG5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcclxuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9cXC5bXi8uXSskLywgXCJcIik7XHJcbiAgICAgICAgbGV0IG5ld25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHdoaWxlICghZ29vZG5hbWUpIHtcclxuICAgICAgICAgICAgbGV0IGFsbGN1cnJuYW1lcyA9IGFsbHdvcmtmbG93cy5tYXAoKGVsKSA9PiBlbC5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKGFsbGN1cnJuYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgbmV3bmFtZSA9IGAke25hbWV9KCR7aW5kfSlgO1xyXG4gICAgICAgICAgICAgICAgaW5kID0gaW5kICsgMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGdvb2RuYW1lID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYCR7bmV3bmFtZX1gO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoKSB7XHJcbiAgICAgICAgbW92aW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGlzVmlzaWJsZSh3b3JrZmxvdykge1xyXG4gICAgICAgIGxldCBteXRhZ3MgPSB3b3JrZmxvdz8uZ3lyZT8udGFncyB8fCBbXTtcclxuICAgICAgICBmb3IgKGxldCBhY3RpdmVUYWcgaW4gYWN0aXZhdGVkVGFncykge1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZhdGVkVGFnc1thY3RpdmVUYWddICYmICFteXRhZ3MuaW5jbHVkZXMoYWN0aXZlVGFnKSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRMaXN0KCkge1xyXG4gICAgICAgIC8vIHRvZG86IG1ha2Ugc2VydmVyIHJlcXVlc3QgYW5kIHJlYWQgJG1ldGFkYXRhIG9mIGFsbCBleGlzdGluZyB3b3JrZmxvd3Mgb24gZmlsZXN5c3RlbVxyXG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBzY2FuTG9jYWxOZXdGaWxlcygpXHJcbiAgICAgICAgbGV0IGRhdGFfd29ya2Zsb3dfbGlzdCA9IHJlc3VsdC5tYXAoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSB7bmFtZTogZWwubmFtZX1cclxuICAgICAgICAgICAgbGV0IGd5cmUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoZWwuanNvbikgZ3lyZSA9IEpTT04ucGFyc2UoZWwuanNvbikuZXh0cmEuZ3lyZTtcclxuICAgICAgICAgICAgcmVzLmxhc3RNb2RpZmllZFJlYWRhYmxlID0gSlNPTi5wYXJzZShlbC5qc29uKS5leHRyYS5neXJlPy5sYXN0TW9kaWZpZWRSZWFkYWJsZSB8fCBcIlwiO1xyXG4gICAgICAgICAgICBpZiAoZ3lyZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLmd5cmUgPSBneXJlO1xyXG4gICAgICAgICAgICAgICAgcmVzLmd5cmUubGFzdE1vZGlmaWVkUmVhZGFibGUgPSBKU09OLnBhcnNlKGVsLmpzb24pLmV4dHJhLmd5cmU/Lmxhc3RNb2RpZmllZFJlYWRhYmxlIHx8IFwiXCI7XHJcbiAgICAgICAgICAgICAgICByZXMuZ3lyZS5sYXN0TW9kaWZpZWQgPSBKU09OLnBhcnNlKGVsLmpzb24pLmV4dHJhLmd5cmU/Lmxhc3RNb2RpZmllZCB8fCBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGFfd29ya2Zsb3dfbGlzdCk7XHJcbiAgICAgICAgd29ya2Zsb3dMaXN0LnNldChkYXRhX3dvcmtmbG93X2xpc3QpXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gc2NhbkxvY2FsTmV3RmlsZXMoKSB7XHJcbiAgICAgICAgbGV0IGV4aXN0Rmxvd0lkcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvd29ya3NwYWNlL3JlYWR3b3JrZmxvd2RpclwiLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0Rmxvd0lkcyxcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gZml4RGF0ZXNGcm9tU2VydmVyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIGFsbHdvcmtmbG93cyA9IHJlc3VsdDtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc2NhbiBsb2NhbCBuZXcgZmlsZXM6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZml4RGF0ZXNGcm9tU2VydmVyKHJlc3VsdCkge1xyXG4gICAgICAgIGxldCBuZXdlbCA9IHJlc3VsdC5tYXAoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBvYmpqcyA9IEpTT04ucGFyc2UoZWwuanNvbik7XHJcbiAgICAgICAgICAgIG9iampzLmV4dHJhLmd5cmUubGFzdE1vZGlmaWVkID0gbmV3IERhdGUoZWwubGFzdG1vZGlmaWVkICogMTAwMCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBsZXQgZGF0ZXN0ciA9IG5ldyBEYXRlKGVsLmxhc3Rtb2RpZmllZCAqIDEwMDApLnRvSVNPU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIG9iampzLmV4dHJhLmd5cmUubGFzdE1vZGlmaWVkUmVhZGFibGUgPSBkYXRlc3RyLnNwbGl0KCdUJylbMF0gKyBcIiBcIiArIGRhdGVzdHIuc3BsaXQoJ1QnKVsxXS5yZXBsYWNlKC9cXC5bXi8uXSskLywgXCJcIik7XHJcbiAgICAgICAgICAgIGxldCBqc29uID0gSlNPTi5zdHJpbmdpZnkob2JqanMpO1xyXG4gICAgICAgICAgICByZXR1cm4gey4uLmVsLCBqc29ufVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIG5ld2VsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkV29ya2Zsb3cod29ya2Zsb3cpIHtcclxuICAgICAgICBhd2FpdCBsb2FkTGlzdCgpO1xyXG4gICAgICAgIC8vIHRvZG86Y2hlY2sgaWYgY3VycmVudCB3b3JrZmxvdyBpcyB1bnNhdmVkIGFuZCBtYWtlIGNvbmZpcm0gb3RoZXJ3aXNlXHJcbiAgICAgICAgLy8gMS4gbWFrZSBzZXJ2ZXIgcmVxdWVzdCBieSB3b3JrZmxvdy5uYW1lLCBnZXR0aW5nIGZ1bGwgd29ya2Zsb3cgZGF0YSBoZXJlXHJcbiAgICAgICAgLy8gMi4gdXBkYXRlIENvbWZ5VUkgd2l0aCBuZXcgd29ya2Zsb3dcclxuICAgICAgICAvLyAzLiBzZXQgbmFtZSBhbmQgJG1ldGFkYXRhIGhlcmVcclxuICAgICAgICBpZiAoIXdvcmtmbG93Lmd5cmUpIHtcclxuICAgICAgICAgICAgd29ya2Zsb3cuZ3lyZSA9IHt9O1xyXG4gICAgICAgICAgICB3b3JrZmxvdy5neXJlLnRhZ3MgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2FkIHdvcmtmbG93ISFcIik7XHJcbiAgICAgICAgbmFtZSA9IHdvcmtmbG93Lm5hbWVcclxuICAgICAgICAkbWV0YWRhdGEgPSB3b3JrZmxvdy5neXJlICAgICAgICBcclxuICAgICAgICBpZiAoISRtZXRhZGF0YS50YWdzKSAkbWV0YWRhdGEudGFncz1bXVxyXG4gICAgICAgIGlmICh3aW5kb3cuYXBwLmdyYXBoID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImFwcC5ncmFwaCBpcyBudWxsIGNhbm5vdCBsb2FkIHdvcmtmbG93XCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuZ3lyZUNsZWFyQWxsQ29tYm9WYWx1ZXMpIHdpbmRvdy5neXJlQ2xlYXJBbGxDb21ib1ZhbHVlcygpXHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBhbGx3b3JrZmxvd3MuZmluZCgoZWwpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsLm5hbWUgPT0gd29ya2Zsb3cubmFtZTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAoIWxvYWRlZHdvcmtmbG93KSB7XHJcbiAgICAgICAgICAgIGlmICghY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFwcC5sb2FkR3JhcGhEYXRhKHdvcmtmbG93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCB3ZiA9IEpTT04ucGFyc2UoY3VycmVudC5qc29uKTtcclxuICAgICAgICAgICAgICAgIGlmICghd2YubmFtZSAmJiBuYW1lKSB3Zi5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hcHAubG9hZEdyYXBoRGF0YSh3Zik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBzdGF0ZT1cInByb3BlcnRpZXNcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gIHRlc3RGaXJzdFBhc3MoKSB7XHJcbiAgICAgICAgbGV0IHdvcmtmbG93PXdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKClcclxuICAgICAgICB3b3JrZmxvdz1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHdvcmtmbG93KSlcclxuICAgICAgICBjb25zb2xlLmxvZyh3b3JrZmxvdylcclxuLy8gICAgICAgIGxldCBsb29wPW5ldyBsb29wUHJlcGFyc2VyKHdvcmtmbG93KVxyXG4vLyAgICAgICAgbG9vcC5nZW5lcmF0ZUxvb3AoXCJjb250cm9sbmV0XCIsMylcclxuLy8gICAgICAgIGNvbnNvbGUubG9nKHdvcmtmbG93KVxyXG4gICAgICAgIGxldCBwYXJzZXI9bmV3IENvbWZ5VUlQcmVwYXJzZXIod29ya2Zsb3cpXHJcbiAgICAgICAgYXdhaXQgcGFyc2VyLmV4ZWN1dGUocGFyc2VyLmdldFRlc3REYXRhKCkpXHJcbiAgICAgICAgd2luZG93LmFwcC5sb2FkR3JhcGhEYXRhKHdvcmtmbG93KTtcclxuICAgICAgICAkbWV0YWRhdGE9d29ya2Zsb3cuZXh0cmEuZ3lyZVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2hvd1N0cnVjdHVyZSgpIHtcclxuICAgICAgICBsZXQgd29ya2Zsb3c9d2luZG93LmFwcC5ncmFwaC5zZXJpYWxpemUoKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHdvcmtmbG93KVxyXG4gICAgfVxyXG4gICAgYXN5bmMgZnVuY3Rpb24gc2F2ZVdvcmtmbG93KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZVdvcmtmbG93XCIpO1xyXG4gICAgICAgIHdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplX3dpZGdldHM9dHJ1ZVxyXG4gICAgICAgIGxldCBncmFwaCA9IHdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKClcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGdyYXBoLm5vZGVzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgbGV0IG5vZGU9Z3JhcGgubm9kZXNbaV1cclxuICAgICAgICAgICAgbGV0IF9ub2RlPXdpbmRvdy5hcHAuZ3JhcGguX25vZGVzW2ldXHJcbiAgICAgICAgICAgIGlmICghJG1ldGFkYXRhLm5vZGVXaWRnZXRzKSAkbWV0YWRhdGEubm9kZVdpZGdldHM9e31cclxuICAgICAgICAgICAgJG1ldGFkYXRhLm5vZGVXaWRnZXRzW25vZGUuaWRdPV9ub2RlLndpZGdldHNcclxuICAgICAgICAgLy8gICBub2RlLndpZGdldHM9X25vZGUud2lkZ2V0c1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIndpbmRvdy5hcHAuZ3JhcGhcIixncmFwaClcclxuICAgICAgICAvLyB0aGlzIGlzIHNjZW5hcmlvIGp1c3QgYWZ0ZXIgbG9hZGluZyB3b3JrZmxvdyBhbmQgbm90IHNhdmUgaXRcclxuICAgICAgICBpZiAobG9hZGVkd29ya2Zsb3cgJiYgbG9hZGVkd29ya2Zsb3cuZXh0cmEud29ya3NwYWNlX2luZm8pIHtcclxuICAgICAgICAgICAgZ3JhcGguZXh0cmEgPSBsb2FkZWR3b3JrZmxvdy5leHRyYTtcclxuICAgICAgICAgICAgJG1ldGFkYXRhID0gbG9hZGVkd29ya2Zsb3cuZXh0cmEuZ3lyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbG9hZGVkd29ya2Zsb3cgPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgZmlsZV9wYXRoID0gZ3JhcGguZXh0cmE/LndvcmtzcGFjZV9pbmZvPy5uYW1lIHx8IFwibmV3Lmpzb25cIjtcclxuICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICBmaWxlX3BhdGggPSBuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZmlsZV9wYXRoLmVuZHNXaXRoKCcuanNvbicpKSB7XHJcbiAgICAgICAgICAgIC8vIEFkZCAuanNvbiBleHRlbnNpb24gaWYgaXQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgICBmaWxlX3BhdGggKz0gJy5qc29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRtZXRhZGF0YSAmJiBncmFwaC5leHRyYSkgZ3JhcGguZXh0cmEuZ3lyZSA9ICRtZXRhZGF0YTtcclxuXHJcbiAgICAgICAgY29uc3QgZ3JhcGhKc29uID0gSlNPTi5zdHJpbmdpZnkoZ3JhcGgpO1xyXG4gICAgICAgIGF3YWl0IHVwZGF0ZUZpbGUoZmlsZV9wYXRoLCBncmFwaEpzb24pO1xyXG5cclxuICAgICAgICAvLyB0b2RvOmdldCB3b3JrZmxvdyBmb20gY29tZnlVSVxyXG4gICAgICAgIC8vICRtZXRhZGF0YSBzaG91bGQgYWxyZWFkeSBwb2ludCB0byBleHRyYXMuZ3lyZSAtIHNvIG5vdGhpbmcgdG8gZG8gaGVyZVxyXG4gICAgICAgIC8vIDEuIG1ha2Ugc2VydmVyIHJlcXVlc3QsIHdpdGggIG5hbWUgYW5kIGZ1bGwgd29ya2Zsb3csIHN0b3JlIGl0IG9uIGZpbGVzeXN0ZW0gdGhlcmVcclxuICAgICAgICAvLyAyLiBzZXQgdW5zYXZlZCBzdGF0ZSB0byBmYWxzZVxyXG4gICAgICAgIC8vIDMuIGxvYWQgbGlzdCBvZiBhbGwgd29ya2Zsb3dzIGFnYWluXHJcbiAgICAgIC8vICBhbGVydChcInNhdmUgd29ya2Zsb3cgXCIgKyBuYW1lKSAvLyByZW1vdmVcclxuXHJcbiAgICAgICAgYXdhaXQgbG9hZExpc3QoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlRmlsZShmaWxlX3BhdGgsIGpzb25EYXRhKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi93b3Jrc3BhY2UvdXBkYXRlX2pzb25fZmlsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlX3BhdGg6IGZpbGVfcGF0aCxcclxuICAgICAgICAgICAgICAgICAgICBqc29uX3N0cjoganNvbkRhdGEsXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHNhdmluZyB3b3JrZmxvdyAuanNvbiBmaWxlOiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNhdmluZyB3b3Jrc3BhY2U6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZFRhZygpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGVkVGFnKSByZXR1cm5cclxuICAgICAgICBpZiAoISRtZXRhZGF0YS50YWdzKSAkbWV0YWRhdGEudGFncyA9IFtdXHJcbiAgICAgICAgJG1ldGFkYXRhLnRhZ3MucHVzaChzZWxlY3RlZFRhZylcclxuICAgICAgICAkbWV0YWRhdGEgPSAkbWV0YWRhdGFcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVUYWcodGFnKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSAkbWV0YWRhdGEudGFncy5pbmRleE9mKHRhZyk7XHJcbiAgICAgICAgJG1ldGFkYXRhLnRhZ3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAkbWV0YWRhdGEgPSAkbWV0YWRhdGFcclxuICAgIH1cclxuICAgIGxldCByZWZyZXNoPTBcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUZvcm0oKSB7XHJcbiAgICAgICAgaWYgKHN0YXRlIT09XCJlZGl0Rm9ybVwiKSByZXR1cm5cclxuICAgICAgICByZWZyZXNoKytcclxuXHJcbiAgICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdiBpZD1cIndvcmtmbG93TWFuYWdlclwiIGNsYXNzPVwid29ya2Zsb3dNYW5hZ2VyXCIgc3R5bGU9XCJsZWZ0OiB7bGVmdH1weDsgdG9wOiB7dG9wfXB4O1wiPlxyXG4gIDxkaXYgY2xhc3M9XCJtaW5pTWVudVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW92ZUljb25cIj5cclxuICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJtb3ZlXCIgb246bW91c2Vkb3duPXtvbk1vdXNlRG93bn0+PC9JY29uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgeyNpZiAhbmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiR3lyZVwiIGNsYXNzPVwiZ3lyZUxvZ29cIj48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2tcIj5HeXJlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2tcIj57bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrXCIgY2xhc3M9XCJzYXZlSWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwic2F2ZVwiIG9uOmNsaWNrPXsoZSkgPT4ge3NhdmVXb3JrZmxvdygpfX0gPjwvSWNvbj4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICB7I2lmICFmb2xkT3V0fVxyXG4gICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9sZG91dFwiIG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19PlxyXG4gICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImRvd25cIj48L0ljb24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZm9sZE91dH1cclxuIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7IHRlc3RGaXJzdFBhc3MoKX0gfT5UZXN0PC9idXR0b24+XHJcbiA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4geyBzaG93U3RydWN0dXJlKCl9IH0+V0YgSlNPTjwvYnV0dG9uPlxyXG5cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb2xkb3V0XCIgb246Y2xpY2s9eyhlKSA9PiB7Zm9sZE91dD1mYWxzZX19PlxyXG4gICAgICAgICAgICA8SWNvbiBuYW1lPVwidXBcIj48L0ljb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1haW5cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdE1lbnVcIj5cclxuICAgICAgICAgICAgeyNrZXkgc3RhdGV9XHJcbiAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwibGlzdFwiIHtzdGF0ZX0gb246Y2xpY2s9eyAoZSkgPT4gIHtzdGF0ZT1cImxpc3RcIiB9fSA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEgJiYgJG1ldGFkYXRhLmxhc3RNb2RpZmllZH1cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwicHJvcGVydGllc1wiIHtzdGF0ZX0gb246Y2xpY2s9e2FzeW5jIChlKSA9PiAge3N0YXRlPVwicHJvcGVydGllc1wiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJlZGl0Rm9ybVwiIHtzdGF0ZX0gb246Y2xpY2s9e2FzeW5jIChlKSA9PiAge3N0YXRlPVwiZWRpdEZvcm1cIiB9fSAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZWRpdFJ1bGVzXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7c3RhdGU9XCJlZGl0UnVsZXNcIiB9fSAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgIHs6ZWxzZX1cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwicHJvcGVydGllc1wiIGRlYWN0aXZhdGU9XCJkZWFjdGl2YXRlXCIgID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImVkaXRGb3JtXCIgICBkZWFjdGl2YXRlPVwiZGVhY3RpdmF0ZVwiID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImVkaXRSdWxlc1wiICAgZGVhY3RpdmF0ZT1cImRlYWN0aXZhdGVcIj48L0ljb24+ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgey9rZXl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHJcbiAgICAgICAgICAgIHsjaWYgc3RhdGUgPT09IFwicHJvcGVydGllc1wifVxyXG4gICAgICAgICAgICAgICAgPGgxPldvcmtmbG93IFByb3BlcnRpZXM8L2gxPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5hbWVcIj5OYW1lOjwvbGFiZWw+PGlucHV0IG5hbWU9XCJuYW1lXCIgdHlwZT1cInRleHRcIiBiaW5kOnZhbHVlPXtuYW1lfSBjbGFzcz1cInRleHRfaW5wdXRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdlZGl0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ1RpdGxlXCI+Q2xpY2sgb24gYSBUYWcgdG8gcmVtb3ZlIGl0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEudGFnc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2VhY2ggJG1ldGFkYXRhLnRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdcIiBvbjpjbGljaz17KGUpID0+IHtyZW1vdmVUYWcodGFnKX19Pnt0YWd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInRhZ3NlbGVjdFwiIGJpbmQ6dmFsdWU9e3NlbGVjdGVkVGFnfSBvbjpjaGFuZ2U9eyhlKSA9PiB7YWRkVGFnKCl9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZCB2YWx1ZT1cIlwiPkFkZCBUYWcuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEudGFncyAmJiAhJG1ldGFkYXRhLnRhZ3MuaW5jbHVkZXModGFnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwie3RhZ31cIj57dGFnfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibGljZW5zZVwiPkxpY2Vuc2U6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJpbnB1dCBsaWNlbnNlXCIgbmFtZT1cImxpY2Vuc2VcIiBiaW5kOnZhbHVlPXskbWV0YWRhdGEubGljZW5zZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZCB2YWx1ZT1cIlwiPlNlbGVjdC4uLjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQgdmFsdWU9XCJ5ZXNfY29tbWVyY2lhbFwiPkNvbW1lcmNpYWwgYWxsb3dlZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQgdmFsdWU9XCJub25fY29tbWVyY2lhbFwiPk5vbiBDb21tZXJjaWFsPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZCB2YWx1ZT1cIm5lZWRzX2xpY2Vuc2VcIj5OZWVkcyBsaWNlbnNlIGZvciBDb21tZXJjaWFsIHVzZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXRMaW5lXCIgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkZXNjcmlwdGlvblwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246dG9wXCI+RGVzY3JpcHRpb246PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJ0ZXh0X2lucHV0XCIgYmluZDp2YWx1ZT17JG1ldGFkYXRhLmRlc2NyaXB0aW9ufT48L3RleHRhcmVhPiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dExpbmVcIiA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNhdGVnb3J5XCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3BcIj5DYXRlZ29yeSAob25seSBsYXllciBtZW51KTo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGV4dF9pbnB1dFwiIGJpbmQ6dmFsdWU9eyRtZXRhZGF0YS5jYXRlZ29yeX0+ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcImVkaXRGb3JtXCJ9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8Rm9ybUJ1aWxkZXIge3JlZnJlc2h9PjwvRm9ybUJ1aWxkZXI+XHJcbiAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsjaWYgc3RhdGUgPT09IFwiZWRpdFJ1bGVzXCJ9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YS5mb3JtcyAmJiAkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdCAmJiAkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50c31cclxuICAgICAgICAgICAgICAgICAgICA8UnVsZUVkaXRvcj48L1J1bGVFZGl0b3I+XHJcbiAgICAgICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgUGxlYXNlIGRlZmluZSBhIGZvcm0gZmlyc3RcclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsjaWYgc3RhdGUgPT09IFwibGlzdFwifVxyXG4gICAgICAgICAgICAgICAgPGgxPldvcmtmbG93IExpc3Q8L2gxPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICB7I2VhY2ggdGFncyBhcyB0YWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246Y2xpY2s9eyAoZSkgPT4geyBhY3RpdmF0ZWRUYWdzW3RhZ109IWFjdGl2YXRlZFRhZ3NbdGFnXTskd29ya2Zsb3dMaXN0PSR3b3JrZmxvd0xpc3R9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6b249e2FjdGl2YXRlZFRhZ3NbdGFnXX0+e3RhZ308L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsjaWYgd29ya2Zsb3dMaXN0fVxyXG4gICAgICAgICAgICAgICAgICAgIHsjZWFjaCAkd29ya2Zsb3dMaXN0IGFzIHdvcmtmbG93fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7I2lmIGlzVmlzaWJsZSh3b3JrZmxvdyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndvcmtmbG93RW50cnlcIiBvbjpjbGljaz17bG9hZFdvcmtmbG93KHdvcmtmbG93KX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3dvcmtmbG93Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxhc3RfY2hhbmdlZFwiPnt3b3JrZmxvdy5sYXN0TW9kaWZpZWRSZWFkYWJsZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmIHdvcmtmbG93Lmd5cmUgJiYgd29ya2Zsb3cuZ3lyZS50YWdzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHdvcmtmbG93Lmd5cmUudGFncyBhcyB0YWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ1wiPnt0YWd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG5cclxuICAgICAgICAgICAgey9pZn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgey9pZn0gPCEtLSBmb2xkT3V0IC0tPlxyXG48L2Rpdj5cclxuPE1hcHBpbmdzIG9uOnVwZGF0ZUZvcm09eyhlKSA9PiB7dXBkYXRlRm9ybSgpfX0gPjwvTWFwcGluZ3M+XHJcbjxzdmVsdGU6d2luZG93IG9uOm1vdXNldXA9e29uTW91c2VVcH0gb246bW91c2Vtb3ZlPXtvbk1vdXNlTW92ZX0vPlxyXG4gXHJcbjxzdHlsZT5cclxuICAgIEBpbXBvcnQgJ2Rpc3QvYnVpbGQvZ3lyZXN0eWxlcy5jc3MnO1xyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxYkksUUFBUSwyQkFBMkIifQ== */");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[53] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[53] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[53] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[53] = list[i];
    	return child_ctx;
    }

    // (309:16) {:else}
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
    	icon.$on("click", /*click_handler_2*/ ctx[24]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(/*name*/ ctx[3]);
    			t1 = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			set_style(div0, "display", "inline-block");
    			add_location(div0, file, 310, 20, 11312);
    			set_style(div1, "display", "inline-block");
    			attr_dev(div1, "class", "saveIcon");
    			add_location(div1, file, 311, 20, 11413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(icon, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_1*/ ctx[23], false, false, false, false);
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
    		source: "(309:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (305:16) {#if !name}
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
    			add_location(div, file, 307, 20, 11110);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[22], false, false, false, false);
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
    		source: "(305:16) {#if !name}",
    		ctx
    	});

    	return block;
    }

    // (319:4) {#if !foldOut}
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
    			add_location(div, file, 320, 12, 11767);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_3*/ ctx[25], false, false, false, false);
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
    		source: "(319:4) {#if !foldOut}",
    		ctx
    	});

    	return block;
    }

    // (325:4) {#if foldOut}
    function create_if_block(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let div0;
    	let icon;
    	let t4;
    	let div3;
    	let div1;
    	let previous_key = /*state*/ ctx[4];
    	let t5;
    	let div2;
    	let t6;
    	let t7;
    	let t8;
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
    			button0 = element("button");
    			button0.textContent = "Test";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "WF JSON";
    			t3 = space();
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			div1 = element("div");
    			key_block.c();
    			t5 = space();
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			if (if_block2) if_block2.c();
    			t8 = space();
    			if (if_block3) if_block3.c();
    			add_location(button0, file, 325, 1, 11917);
    			add_location(button1, file, 326, 1, 11979);
    			attr_dev(div0, "class", "foldout");
    			add_location(div0, file, 329, 8, 12119);
    			attr_dev(div1, "class", "leftMenu");
    			add_location(div1, file, 333, 8, 12265);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file, 347, 8, 13129);
    			attr_dev(div3, "class", "main");
    			add_location(div3, file, 332, 8, 12237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div0, anchor);
    			mount_component(icon, div0, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			key_block.m(div1, null);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t6);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t7);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t8);
    			if (if_block3) if_block3.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_4*/ ctx[26], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_5*/ ctx[27], false, false, false, false),
    					listen_dev(div0, "click", /*click_handler_6*/ ctx[28], false, false, false, false)
    				];

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
    					if_block0.m(div2, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*state*/ ctx[4] === "editForm") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t7);
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
    					if_block2.m(div2, t8);
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
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div0);
    			destroy_component(icon);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div3);
    			key_block.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(325:4) {#if foldOut}",
    		ctx
    	});

    	return block;
    }

    // (341:16) {:else}
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
    		source: "(341:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (337:16) {#if $metadata && $metadata.lastModified}
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

    	icon0.$on("click", /*click_handler_8*/ ctx[30]);

    	icon1 = new Icon({
    			props: {
    				name: "editForm",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon1.$on("click", /*click_handler_9*/ ctx[31]);

    	icon2 = new Icon({
    			props: {
    				name: "editRules",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon2.$on("click", /*click_handler_10*/ ctx[32]);

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
    		source: "(337:16) {#if $metadata && $metadata.lastModified}",
    		ctx
    	});

    	return block;
    }

    // (335:12) {#key state}
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

    	icon.$on("click", /*click_handler_7*/ ctx[29]);
    	const if_block_creators = [create_if_block_11, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$metadata*/ ctx[8] && /*$metadata*/ ctx[8].lastModified) return 0;
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
    		source: "(335:12) {#key state}",
    		ctx
    	});

    	return block;
    }

    // (350:12) {#if state === "properties"}
    function create_if_block_8(ctx) {
    	let h1;
    	let t1;
    	let label0;
    	let input0;
    	let t3;
    	let div2;
    	let div0;
    	let t5;
    	let div1;
    	let t6;
    	let select0;
    	let option0;
    	let t8;
    	let label1;
    	let t10;
    	let select1;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t15;
    	let div3;
    	let label2;
    	let t17;
    	let textarea;
    	let t18;
    	let div4;
    	let label3;
    	let t20;
    	let input1;
    	let mounted;
    	let dispose;
    	let if_block = /*$metadata*/ ctx[8].tags && create_if_block_10(ctx);
    	let each_value_3 = /*tags*/ ctx[10];
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
    			label0 = element("label");
    			label0.textContent = "Name:";
    			input0 = element("input");
    			t3 = space();
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Click on a Tag to remove it";
    			t5 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t6 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Add Tag...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			label1 = element("label");
    			label1.textContent = "License:";
    			t10 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Select...";
    			option2 = element("option");
    			option2.textContent = "Commercial allowed";
    			option3 = element("option");
    			option3.textContent = "Non Commercial";
    			option4 = element("option");
    			option4.textContent = "Needs license for Commercial use";
    			t15 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "Description:";
    			t17 = space();
    			textarea = element("textarea");
    			t18 = space();
    			div4 = element("div");
    			label3 = element("label");
    			label3.textContent = "Category (only layer menu):";
    			t20 = space();
    			input1 = element("input");
    			add_location(h1, file, 350, 16, 13212);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file, 351, 16, 13258);
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "text_input");
    			add_location(input0, file, 351, 47, 13289);
    			attr_dev(div0, "class", "tagTitle");
    			add_location(div0, file, 353, 20, 13418);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 354, 20, 13495);
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file, 363, 24, 14026);
    			attr_dev(select0, "class", "tagselect");
    			if (/*selectedTag*/ ctx[6] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[35].call(select0));
    			add_location(select0, file, 362, 20, 13919);
    			attr_dev(div2, "class", "tagedit");
    			add_location(div2, file, 352, 16, 13375);
    			attr_dev(label1, "for", "license");
    			add_location(label1, file, 371, 16, 14410);
    			option1.selected = true;
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file, 373, 20, 14563);
    			option2.selected = true;
    			option2.__value = "yes_commercial";
    			option2.value = option2.__value;
    			add_location(option2, file, 374, 20, 14629);
    			option3.selected = true;
    			option3.__value = "non_commercial";
    			option3.value = option3.__value;
    			add_location(option3, file, 375, 20, 14718);
    			option4.selected = true;
    			option4.__value = "needs_license";
    			option4.value = option4.__value;
    			add_location(option4, file, 376, 20, 14803);
    			attr_dev(select1, "class", "input license");
    			attr_dev(select1, "name", "license");
    			if (/*$metadata*/ ctx[8].license === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[37].call(select1));
    			add_location(select1, file, 372, 16, 14465);
    			attr_dev(label2, "for", "description");
    			set_style(label2, "vertical-align", "top");
    			add_location(label2, file, 379, 20, 14974);
    			attr_dev(textarea, "class", "text_input");
    			add_location(textarea, file, 380, 20, 15068);
    			attr_dev(div3, "class", "inputLine");
    			add_location(div3, file, 378, 16, 14928);
    			attr_dev(label3, "for", "category");
    			set_style(label3, "vertical-align", "top");
    			add_location(label3, file, 383, 20, 15251);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "text_input");
    			add_location(input1, file, 384, 20, 15357);
    			attr_dev(div4, "class", "inputLine");
    			add_location(div4, file, 382, 16, 15205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label0, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*name*/ ctx[3]);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div2, t6);
    			append_dev(div2, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select0, null);
    				}
    			}

    			select_option(select0, /*selectedTag*/ ctx[6], true);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, label1, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, select1, anchor);
    			append_dev(select1, option1);
    			append_dev(select1, option2);
    			append_dev(select1, option3);
    			append_dev(select1, option4);
    			select_option(select1, /*$metadata*/ ctx[8].license, true);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, label2);
    			append_dev(div3, t17);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*$metadata*/ ctx[8].description);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, label3);
    			append_dev(div4, t20);
    			append_dev(div4, input1);
    			set_input_value(input1, /*$metadata*/ ctx[8].category);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[33]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[35]),
    					listen_dev(select0, "change", /*change_handler*/ ctx[36], false, false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[37]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[38]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[39])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*name*/ 8 && input0.value !== /*name*/ ctx[3]) {
    				set_input_value(input0, /*name*/ ctx[3]);
    			}

    			if (/*$metadata*/ ctx[8].tags) {
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

    			if (dirty[0] & /*tags, $metadata*/ 1280) {
    				each_value_3 = /*tags*/ ctx[10];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*selectedTag, tags*/ 1088) {
    				select_option(select0, /*selectedTag*/ ctx[6]);
    			}

    			if (dirty[0] & /*$metadata*/ 256) {
    				select_option(select1, /*$metadata*/ ctx[8].license);
    			}

    			if (dirty[0] & /*$metadata*/ 256) {
    				set_input_value(textarea, /*$metadata*/ ctx[8].description);
    			}

    			if (dirty[0] & /*$metadata*/ 256 && input1.value !== /*$metadata*/ ctx[8].category) {
    				set_input_value(input1, /*$metadata*/ ctx[8].category);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(label0);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(label1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(select1);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(350:12) {#if state === \\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (356:24) {#if $metadata.tags}
    function create_if_block_10(ctx) {
    	let each_1_anchor;
    	let each_value_4 = /*$metadata*/ ctx[8].tags;
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
    			if (dirty[0] & /*removeTag, $metadata*/ 1048832) {
    				each_value_4 = /*$metadata*/ ctx[8].tags;
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
    		source: "(356:24) {#if $metadata.tags}",
    		ctx
    	});

    	return block;
    }

    // (358:28) {#each $metadata.tags as tag}
    function create_each_block_4(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[53] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_11(...args) {
    		return /*click_handler_11*/ ctx[34](/*tag*/ ctx[53], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 358, 32, 13738);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_11, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$metadata*/ 256 && t_value !== (t_value = /*tag*/ ctx[53] + "")) set_data_dev(t, t_value);
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
    		source: "(358:28) {#each $metadata.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (366:28) {#if $metadata.tags && !$metadata.tags.includes(tag)}
    function create_if_block_9(ctx) {
    	let option;
    	let t_value = /*tag*/ ctx[53] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*tag*/ ctx[53];
    			option.value = option.__value;
    			add_location(option, file, 366, 32, 14233);
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
    		source: "(366:28) {#if $metadata.tags && !$metadata.tags.includes(tag)}",
    		ctx
    	});

    	return block;
    }

    // (365:24) {#each tags as tag}
    function create_each_block_3(ctx) {
    	let show_if = /*$metadata*/ ctx[8].tags && !/*$metadata*/ ctx[8].tags.includes(/*tag*/ ctx[53]);
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
    			if (dirty[0] & /*$metadata*/ 256) show_if = /*$metadata*/ ctx[8].tags && !/*$metadata*/ ctx[8].tags.includes(/*tag*/ ctx[53]);

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
    		source: "(365:24) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (388:12) {#if state === "editForm"}
    function create_if_block_7(ctx) {
    	let div;
    	let t;
    	let formbuilder;
    	let current;

    	formbuilder = new FormBuilder({
    			props: { refresh: /*refresh*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			create_component(formbuilder.$$.fragment);
    			set_style(div, "margin-top", "10px");
    			add_location(div, file, 388, 16, 15545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(formbuilder, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formbuilder_changes = {};
    			if (dirty[0] & /*refresh*/ 128) formbuilder_changes.refresh = /*refresh*/ ctx[7];
    			formbuilder.$set(formbuilder_changes);
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
    		source: "(388:12) {#if state === \\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (392:12) {#if state === "editRules"}
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
    		if (/*$metadata*/ ctx[8].forms && /*$metadata*/ ctx[8].forms.default && /*$metadata*/ ctx[8].forms.default.elements) return 0;
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
    			add_location(div, file, 392, 16, 15713);
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
    		source: "(392:12) {#if state === \\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    // (396:16) {:else}
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
    		source: "(396:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (394:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}
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
    		source: "(394:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}",
    		ctx
    	});

    	return block;
    }

    // (400:12) {#if state === "list"}
    function create_if_block_1(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let if_block_anchor;
    	let each_value_2 = /*tags*/ ctx[10];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let if_block = /*workflowList*/ ctx[11] && create_if_block_2(ctx);

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
    			add_location(h1, file, 400, 16, 16066);
    			attr_dev(div, "class", "tags");
    			add_location(div, file, 401, 16, 16106);
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
    			if (dirty[0] & /*activatedTags, tags, $workflowList*/ 1568) {
    				each_value_2 = /*tags*/ ctx[10];
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

    			if (/*workflowList*/ ctx[11]) if_block.p(ctx, dirty);
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
    		source: "(400:12) {#if state === \\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (403:20) {#each tags as tag}
    function create_each_block_2(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[53] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_12(...args) {
    		return /*click_handler_12*/ ctx[40](/*tag*/ ctx[53], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[53]]);
    			add_location(div, file, 404, 24, 16273);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_12, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*activatedTags, tags*/ 1056) {
    				toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[53]]);
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
    		source: "(403:20) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (410:16) {#if workflowList}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value = /*$workflowList*/ ctx[9];
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
    			if (dirty[0] & /*loadWorkflow, $workflowList, isVisible*/ 98816) {
    				each_value = /*$workflowList*/ ctx[9];
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
    		source: "(410:16) {#if workflowList}",
    		ctx
    	});

    	return block;
    }

    // (412:24) {#if isVisible(workflow)}
    function create_if_block_3(ctx) {
    	let div2;
    	let t0_value = /*workflow*/ ctx[50].name + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2_value = /*workflow*/ ctx[50].lastModifiedReadable + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let mounted;
    	let dispose;
    	let if_block = /*workflow*/ ctx[50].gyre && /*workflow*/ ctx[50].gyre.tags && create_if_block_4(ctx);

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
    			add_location(div0, file, 415, 32, 16933);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 416, 32, 17030);
    			attr_dev(div2, "class", "workflowEntry");
    			add_location(div2, file, 413, 28, 16789);
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
    						if (is_function(/*loadWorkflow*/ ctx[16](/*workflow*/ ctx[50]))) /*loadWorkflow*/ ctx[16](/*workflow*/ ctx[50]).apply(this, arguments);
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
    			if (dirty[0] & /*$workflowList*/ 512 && t0_value !== (t0_value = /*workflow*/ ctx[50].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*$workflowList*/ 512 && t2_value !== (t2_value = /*workflow*/ ctx[50].lastModifiedReadable + "")) set_data_dev(t2, t2_value);

    			if (/*workflow*/ ctx[50].gyre && /*workflow*/ ctx[50].gyre.tags) {
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
    		source: "(412:24) {#if isVisible(workflow)}",
    		ctx
    	});

    	return block;
    }

    // (418:36) {#if workflow.gyre && workflow.gyre.tags}
    function create_if_block_4(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*workflow*/ ctx[50].gyre.tags;
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
    			if (dirty[0] & /*$workflowList*/ 512) {
    				each_value_1 = /*workflow*/ ctx[50].gyre.tags;
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
    		source: "(418:36) {#if workflow.gyre && workflow.gyre.tags}",
    		ctx
    	});

    	return block;
    }

    // (419:40) {#each workflow.gyre.tags as tag}
    function create_each_block_1(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[53] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 419, 44, 17248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 512 && t_value !== (t_value = /*tag*/ ctx[53] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(419:40) {#each workflow.gyre.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (411:20) {#each $workflowList as workflow}
    function create_each_block(ctx) {
    	let show_if = /*isVisible*/ ctx[15](/*workflow*/ ctx[50]);
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
    			if (dirty[0] & /*$workflowList*/ 512) show_if = /*isVisible*/ ctx[15](/*workflow*/ ctx[50]);

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
    		source: "(411:20) {#each $workflowList as workflow}",
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
    	let t3;
    	let mappings;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { name: "move" }, $$inline: true });
    	icon.$on("mousedown", /*onMouseDown*/ ctx[12]);
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
    	mappings = new Mappings({ $$inline: true });
    	mappings.$on("updateForm", /*updateForm_handler*/ ctx[41]);

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
    			t3 = space();
    			create_component(mappings.$$.fragment);
    			attr_dev(div0, "class", "moveIcon");
    			add_location(div0, file, 299, 12, 10770);
    			attr_dev(div1, "class", "title");
    			add_location(div1, file, 302, 12, 10896);
    			attr_dev(div2, "class", "miniMenu");
    			add_location(div2, file, 298, 2, 10734);
    			attr_dev(div3, "id", "workflowManager");
    			attr_dev(div3, "class", "workflowManager");
    			set_style(div3, "left", /*left*/ ctx[0] + "px");
    			set_style(div3, "top", /*top*/ ctx[1] + "px");
    			add_location(div3, file, 297, 0, 10642);
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
    			insert_dev(target, t3, anchor);
    			mount_component(mappings, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mouseup", /*onMouseUp*/ ctx[14], false, false, false, false),
    					listen_dev(window_1, "mousemove", /*onMouseMove*/ ctx[13], false, false, false, false)
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
    			transition_in(mappings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(mappings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(icon);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t3);
    			destroy_component(mappings, detaching);
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

    function showStructure() {
    	let workflow = window.app.graph.serialize();
    	console.log(workflow);
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
    	component_subscribe($$self, metadata, $$value => $$invalidate(8, $metadata = $$value));
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
    	component_subscribe($$self, workflowList, value => $$invalidate(9, $workflowList = value));
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
    		if (!$metadata.tags) set_store_value(metadata, $metadata.tags = [], $metadata);

    		if (window.app.graph == null) {
    			console.error("app.graph is null cannot load workflow");
    			return;
    		}

    		if (window.gyreClearAllComboValues) window.gyreClearAllComboValues();

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

    	async function testFirstPass() {
    		let workflow = window.app.graph.serialize();
    		workflow = JSON.parse(JSON.stringify(workflow));
    		console.log(workflow);

    		//        let loop=new loopPreparser(workflow)
    		//        loop.generateLoop("controlnet",3)
    		//        console.log(workflow)
    		let parser = new ComfyUIPreparser(workflow);

    		await parser.execute(parser.getTestData());
    		window.app.loadGraphData(workflow);
    		set_store_value(metadata, $metadata = workflow.extra.gyre, $metadata);
    	}

    	async function saveWorkflow() {
    		console.log("saveWorkflow");
    		window.app.graph.serialize_widgets = true;
    		let graph = window.app.graph.serialize();

    		for (let i = 0; i < graph.nodes.length; i++) {
    			let node = graph.nodes[i];
    			let _node = window.app.graph._nodes[i];
    			if (!$metadata.nodeWidgets) set_store_value(metadata, $metadata.nodeWidgets = {}, $metadata);
    			set_store_value(metadata, $metadata.nodeWidgets[node.id] = _node.widgets, $metadata);
    		} //   node.widgets=_node.widgets

    		console.log("window.app.graph", graph);

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
    		//  alert("save workflow " + name) // remove
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

    	let refresh = 0;

    	function updateForm() {
    		if (state !== "editForm") return;
    		$$invalidate(7, refresh++, refresh);
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
    		testFirstPass();
    	};

    	const click_handler_5 = e => {
    		showStructure();
    	};

    	const click_handler_6 = e => {
    		$$invalidate(2, foldOut = false);
    	};

    	const click_handler_7 = e => {
    		$$invalidate(4, state = "list");
    	};

    	const click_handler_8 = async e => {
    		$$invalidate(4, state = "properties");
    	};

    	const click_handler_9 = async e => {
    		$$invalidate(4, state = "editForm");
    	};

    	const click_handler_10 = async e => {
    		$$invalidate(4, state = "editRules");
    	};

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(3, name);
    	}

    	const click_handler_11 = (tag, e) => {
    		removeTag(tag);
    	};

    	function select0_change_handler() {
    		selectedTag = select_value(this);
    		$$invalidate(6, selectedTag);
    		$$invalidate(10, tags);
    	}

    	const change_handler = e => {
    		addTag();
    	};

    	function select1_change_handler() {
    		$metadata.license = select_value(this);
    		metadata.set($metadata);
    	}

    	function textarea_input_handler() {
    		$metadata.description = this.value;
    		metadata.set($metadata);
    	}

    	function input1_input_handler() {
    		$metadata.category = this.value;
    		metadata.set($metadata);
    	}

    	const click_handler_12 = (tag, e) => {
    		$$invalidate(5, activatedTags[tag] = !activatedTags[tag], activatedTags);
    		workflowList.set($workflowList);
    	};

    	const updateForm_handler = e => {
    		updateForm();
    	};

    	$$self.$capture_state = () => ({
    		FormBuilder,
    		RuleEditor,
    		Mappings,
    		writable,
    		onMount,
    		metadata,
    		Icon,
    		ComfyUIPreparser,
    		select_option,
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
    		testFirstPass,
    		showStructure,
    		saveWorkflow,
    		updateFile,
    		addTag,
    		removeTag,
    		refresh,
    		updateForm,
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
    		if ('tags' in $$props) $$invalidate(10, tags = $$props.tags);
    		if ('workflowList' in $$props) $$invalidate(11, workflowList = $$props.workflowList);
    		if ('activatedTags' in $$props) $$invalidate(5, activatedTags = $$props.activatedTags);
    		if ('selectedTag' in $$props) $$invalidate(6, selectedTag = $$props.selectedTag);
    		if ('refresh' in $$props) $$invalidate(7, refresh = $$props.refresh);
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
    		refresh,
    		$metadata,
    		$workflowList,
    		tags,
    		workflowList,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		isVisible,
    		loadWorkflow,
    		testFirstPass,
    		saveWorkflow,
    		addTag,
    		removeTag,
    		updateForm,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		input0_input_handler,
    		click_handler_11,
    		select0_change_handler,
    		change_handler,
    		select1_change_handler,
    		textarea_input_handler,
    		input1_input_handler,
    		click_handler_12,
    		updateForm_handler
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
