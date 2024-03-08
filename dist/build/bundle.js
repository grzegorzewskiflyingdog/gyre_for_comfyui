
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
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
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

    let layer_image_preview="data:image/jpeg;base64,/9j/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////7gAhQWRvYmUAZAAAAAABAwAQAwIDBgAAAAAAAAAAAAAAAP/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAEHBwcNDA0YEBAYFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8IAEQgAkgCrAwERAAIRAQMRAf/EANsAAAICAwEBAAAAAAAAAAAAAAIDAAEFBgcECAEBAAIDAQAAAAAAAAAAAAAAAAECAwQFBhAAAQQCAQIGAgMBAQAAAAAAAQACAwQRBQYQEiAwIUETBzEUQCIVYDIRAAIBAgQDBQMIBwMMAwAAAAECAxIEABEiBSEyEzFCUiMGQVEzIDDwYYFyghQQccFikkMVQNEHYJGhsaKywtJTY3MkkzQlEgABAwICBAsGBAcAAAAAAAAAARECIRIxIhAw8KIgQEFRYTJCUmJyA3GhgpKywmCBsdLB0fETI5Oz/9oADAMBAQIRAxEAAAD5imLLLIUUUWQhExEKTCEIiFkIWEQoEohCy7Q+9fPivREUQsiYRMCRYRAQSpSqSze5rdL9Dx/fta+s8/f5353rePFlpETZEWQoYEWCCCUNh1HJj6T3eXhexzFJCY8uDNzjg9fUuXuxMIWWUOLICLKNm0dnqXI2d2rIes4y+pz8N3OZQiR1tp+jtcy4HZ8WDJC5XCDyAgB1t03l7PVvL9DHbdMdao7+Hn/q+H7c9N0wZtj3dZe/p4/c18NZzXg9fTOV0LmpRMHggGx6ebtXnNnV96KyU9OG+MvTdOJ0dV9RyMR1dPPYsvQdbZPoaW/Zsendnm6X1NHVufvcs872PDiywehZsuKev+U6HgzU2TXnD5Go9Gg1ZGL+GtMsyYzs6G46e1k8j0d7kbdkodq1s4ubdDU+evJ+i84xAS9ye+8zNr+lda2X1MmPmdl1N0tecXuauCtCcmH02tks0Tcw5HPrdL6OLZrxxK1vnHDkkLkEisdeOv4Le/i7GA18jcOXKY757XysjJ79VpvR1n4I9VNmpysY8l2udzX0ejztIUDAYSxtz7vReNvl0Dh5dW5ezmtfYPJbI8va2Xm5m5cbFtF6GDM6+b2+n53CPT8vC1JpKsYKk1HY+5+Q/JDcj2zHWeTlxfD2rwbOV0801tj12x5nXtr/AH9HAen5/M97CupWOU45VjLqRWWWOtDrn5Ibcdx3jompbavN7qefteC05OmXM9Xn8h9NparkqFZXjKoTSVY5GpMGSZMNsbeG3MyDuO0Zqjp3D236mXHdTByjra3liQqXQnGXSV0BWRgMQYcjkdjLjvDLjvBXXM2qKarK6lYyqFVBSw1VAYGgi5EFIrDsK4rRdx2WUBUqkroXQFQxIwqEHIstMLlZdoqyXFYdoIqAQXSQoCqoVCiJh6EQibIQGYXKpXYVhEgMBhVFFQhCJh6EQtMLBFxCrBLsOVllQqFVSUqkoRMP/9oACAECAAEFAPK/HQLBP8MN7l8MrU7KLSP4GVlV6T5FXpRRotBVrXseJq74yVnzfd72tEM0eKuzb3Nc0oeiCkha9Wta5iP9fLysK5sYoE646ZRXi0x9rlXsuaWyAh72rPcHMyrOuZIJ67oishAE+N72sVq656sUZS+kW5t/1dqrRikH9iJntTtg5ir7LuX+i0KKw14khbILetLU4FEEDwEq3fjiUt90jjY7W4a4NpDvuVmOZ2ujVLZB7Y7AU7Q5td+FG/uUbnMNfY9ya4FWte2RTQPjPgsksYRlxrteP7QGeQyBtktbYtQtUEkVgS02wmtbLzHOHMc9oVWySa72gNfhGVzFW2faLIjkj8BAKsUQ0saVgFSwenygtJaAL5rtqXXTMlDY3fNK0MkLg6YObDckjP8ApuChtse1zmkGR3bjwYXoVPTa8TV3tLSAJIiEIsgRhfsiMwPa98OwjkHzRuQacftmJtmz8ioU5XFsWE4LCx1CAQCkhbIrNB0aexzE4uKczLXN9JGelWt3m0WgQumlDqT3LV6HD2sDQR4AgggggnNVrXdycDGJI8tMBa6WAl/d2Nr0yXxwSyqtQZGsFFFFHwAoFAoFNOEFZqtmbPSfCrFkhpjL2iFrTW1RkEULY+mUPREolZWeuVlArKBQKaU5oereqJd/mzd1TWtYRgLKJRKJRKJ8WUCgUCgVlZWV6IlE5RciV3IlZ6Z8eUCgUCsrKyiVlZRKysrKz5GVlZQKDl3LuXcu5FyJWfMysoFZWVlZWUSs/wAU+R//2gAIAQMAAQUA8r1QXcj/AA3OAQlaU0Aofnz8FFTWmMU1l7kHOCr3HNUUzXrKGT5v4XqVIHKxTKcCF+UfRMkLFXutcvU+YVFXc9fD2J0QLXlwU0AILCCGlf8AlByr3XMUczXr8rKPj7e5RwhqjlappMqI9ytV+6P1T4QU2o16mo9qNJykiLFFI5ir3g5NwUPFHCXL4wERlEuCMpChmwWOBE1chOjUDi10ze5Pb2pzWuE1IgDOa91zTDM1/haPVsnaO7tXd3JpTmd6ZWke2Vj4iJi4y1mtDmEPaPWaEBTtKILkY2FTUvWv3tf4RJkAgrCagzCa84kjEhngDFh5GASThepUkIcnVsqSEtTAQhE3PgKymuTXoOQKD0HlCMuD2EAwEL4imRgI1u5MgDFYc0rHk5QemOTQEHFMByG+sknamMTmtCZM0C3fLkfXy8pr8JsmVEV8qjlQb3l8oAlexilm70RlHzWv7VFKCg1BydI4iSzhF2VjoPNIQJCislCcFS2S7+FjrjoP+h//2gAIAQEAAQUAQAQHUlHoPFnwZWQvRenTCAWEUeo6NaXF+vvsYfTyffCA6lHqFx/ie03T9NxbV6mJ0K5DwejsVs9Vf1tjPXPg9wgsIlFEoFVqtizPxH6avyxxcR27Ne6PBLPQsWz1evvxcj4BdoDwDp7gdCiUSvyuJ8B3PIDxfjup40hag/XH2rxupqrnIPrvcV5qb2KDW2rMzWyQSR2TE7knA9dtBttNsdVZ6BBe+EUSiVUp2rtniH1tq6cFbeautr9lVNXV8ZnsxRc9p19kxvwgUtxdqN1Gw3V3Q3Whkep4y7dDdaHZae3sdVS2Fbkv1zfoA5CCwvdEpxXEOA7fk02q+v8AT6PX2dVHc3NCDZ1W/wC/KzW8e3+1/bbar7B2y4/Hr5rFBkS0FrbVpOObuXSs196LTbu5co7PVbz68DK7oVyjgGt263Gi2ensr3KcV9dcdrb/AJJWdRaavJbuuuPl1PIaun18mhO6qS8m2PF9NyyePda3f8TbreW7m8+3VbQhgmjZsNJsoxf2Gri/V1W3Gvmv1J5Yq7dbbg5D9da68L3Godm7Y1W1Nh7kolaHe7PRbjjW54R9ojk1exr9nJJaoDWcohm2e50uvZfhkMULeN1OQbrln15W1Emiqcg294soMuRtZ81HYbuioue0LVLXfYWzpVtPsaWz1ushuRn7h+/9IJznPuSspoUWWu4t9s63cVN/ot3xYzyzWJ6e8dspRLCxlD9CvWijmvXeWbK/V0m4+vt3Uml4tyWkI2xua3Uzb69pNXa0+xfo9LV4/wA/+29tyKm5qIWPUlNTAmNTAuD/AGJvOKOi4zo+VRNm1ttkFGKlKNzPFa124kdb1W8iZJuJNlSr6sVmWt9T4lpzoN5d2N7lHNeJ8Apcn5NveS7V4CcE4L3BTUxMwmppWs2d/WXtXy/hv2E7lfDtpo9vp5pnPdbo/rVdnTmrULP7UnLN9HFouI/XOv3FXffZuu1FBxTinYTinFe4TUwphTXJrkCgQuC/btzT1NjxaGTTxtc+9qZ6cT9w3Z3aj7XHeCabnP2PyPmNwu9HOTnpzk5yJWfUBNTU0prk1ya5ByDlxbmG/wCLbKre+sOa1qvDQwbD7F43w6G/sLt+45yc4BOenPTnIuRK9wEAggUCmuTXIOQcu5BwXcEXJzk56c9OenORciemfUBYQQQKBQcg9B6EiD13ovTnpz056LkSiemVlDqOgK7kXr5EJEJF8qL056c9Fyyis9fbHXHQlFyL13oSISL5V3lFyLiiVnw+3gKcnI9Agh0PQ+L2/9oACAECAgY/ANVXRUpxPpKxVvKpVCnEnahg/mYwKY7dBXApr6jy/haJBmTd+oppzIPHDboGauroVMyvLuwKrb3RISSgko5k8JVco6HNpy5ZbdA0k+LsaKlOG6qyDen8/wC2Q0VlLn/uvItVr4l3ZUtuu9Ne9L/n2et1xnGRTNdLb2lGjt7R1rt7S5FGkjoPCsd/9CqFOE3Wl3TPhuiWoioO9q7xcu4InKJJcq90ZVz7dIyjvpeKjTT5f6j0MuVdugaSLwXQuxU6SuZBFjllzCX7o6rmj3esUjWPejEvVf8AUbXlUMR1pcMow6S95/k2810i5WWP5bvBbEeKHMZkGQtkgtMy9rtCximZe0NJFWRjapai/MVWJlVI7o6srDq0U28Q9NFr5eHSijSwGUfkHVKjyQeKOX+r1eztMk6WQ7N3a+0XGPmYtaSovaESSraJGOPYFVckZfbu6qpRHTboHx8I46lqIWqrJvF0skI/Dd8wyK6p3SuSMfNGZW+Xhrd+gnqeq7x6vd34lqYavvDw6wyxr7B3950DqJHrWi+p6nV26wienGCea77R1S6Xi17cphcgi2+4RcPqKpc/xCLJ0jt4TKjcQoNJB473V+kejfF/IeWaW3Qc343/AP/aAAgBAwIGPwDW04niY8WxUrgZV4hQaOG8Pj9RXS8RpYnRrebQvOVTNwKjoZqxKKU1NDMVoU0XJiV0UKjIMqDoo2o6DKVK10MNpbTgPFRkoMuBTgsNpqUEoyfmIi4Dcg8ceBQqYe4f09vlPFwmXgUG5B1HQoPoroopgpQdq61pFsdNViUtHVBERddQccZcR1KKcn2jIPxFxkKr+45uJ5aIUxK8SroaOH44/9oACAEBAQY/AP7LlkPf2D9fzeSio+4ccVvbSqnjZGA/1fNfT3fNBoV6VoDk904NP6l8bfq/iwBBHXcEAPcScZG9/wB1f1Yyy4+7DT2oFrd5E1AaHJ8Q9n31/FVgwXkRjcdh7VYe9W7D8x9n7PmEgt4nmmkOSRICzE/UB24S93Xp9UFHttud4zHNmc6WkEi9lL1jT95tWLuee1g25NujErWivWRCxWmkxhoo2yarovIktCdWihscB/m4ezPHH29mAe0Z/bhre4iE1uTwDjiv29xv1Ye62+q6shxZcvNQfWBzD61x+rt+V9n7Pli4Cm12pWHXv2UNklQVmijLK01GeqjSvfZMfn9th/NdEL+aadc/zELDJwAU7O3NV5UpwNw2aaQ2kqPHPt+QCW6y5x5QsA8lAD8UaKap+Zeny7jtFyl5tm8lre0O4bex6zW9sMlL1JEpcJ5ThxG8nL5NFCLDb7nFb7nAqqt20ElvDMqIABKWEaB3YaWWCKjvs/PgVDg3FSCCCDxBUjNSD7GB1YENtC80pBKxoKmIHEnIZ+zAOWTociGAOR9xVv7sSihTHMpEkWWQ4+0HtX8P+7hp7YC0vuJ6gGhyfGvsq8a/jqwbe+hMT9qN2qw96sOB+T9n7Pkpa2kL3FxKaY4YlLuze4AceGF3f1LIJjEQ521VYqpU55TEDW3viX8dVWHvbqFdusmi/wDzZ7VTVDb5eYKnpGUr/wAjuaaEaitTezSuBelZbNaYyzKDUvmRiMcRkr0r+Be9dxh2LLqiRUAUcQWJ40kK3tz1N/Dia7lhZNwtwjQSKhV5oGbW8y5DipLMoCLTqq6ndJDHPsOWZIy45/WMMkMsgEnElWKEgDLsByzw6QiRpGLTiZwzK6hFzRXYn4agy8Q33PEX3S2luXjEVsksUipIJnU0o6lXajJWpfLw6IuTCnb7mJtIEoJYqsvHNVala1qVlWSnu6qcC13CExSsKkParj3ow4N9eWGtruFZoW7Yz7D7wRkQfrGGuttqurQcWjy81PsHOPu/w97HHh9X6fs/Z8iqMi129PjXsmWWQHEIhKmRuHd0+Nlxbzen1E0vCO7lmUSG6BYFlJY0x0ZEhI/AlSYudr3XdGspmfqtQgmSRmckOy5q0ZyX4flU81NPOdru7L89ttwco7iKVaJChYq9ZeMAFYqHDS6F/eoxLZW0cVtcIjQw7fdLUddLmTqL0nElI0kinxt3sSypG+XHoSZl42p5hmAocd7RTTiWG3zLdOsmTNUZmHZkGaORTyuvTkXm/ewLgRH8lKSqSXDaRK2ZPFAI1C6qFZvM6WmpHwWUMqqKgrCRjpIR2zoC01e8/ufvYltbHzob/wApGVRU0kdRjaIyUvmrP4fvri76m2G/s7uLoSm+zXNXDySo4jiehVkyr+Iiu2nVpxc3U8ivtDWwMLVrLPEqSFStAK1p1a9SxtJ8Pp9NH6eILa+Md7ts+UkbKAcgeAZGADIRx9uLm/2i8iuLOECQ2ztTKi9h4nS1J9unB/08P78PcW//AKm4HiZlGhz7eooPt8fN4qsG3v4TG3Eo44o496t2Ef7Xi/R9n6RaT0skMEtyImzycwrUFNILZd58l5Vwm2mR7a3EZMUUao4jcZhKXyENxH3lZdVNNOtVx1o5vzCgdMuQ3TnoypMmbLqpGj/i5sTTrctt9301jJLkPrzrTPIdZKWYUV6f+18R3M+VxthQTSXNogMKhXIYSmQs/UDsEpXqSaav38Ty2TBXWvoWskuYIrJY1yvXU2nxu3K2M4rTqWEj03MMtJhcK3Ty6bEM51U6Vq8FOLR5HiuLK6QtA8LF4TkBUp4ANTpbL4dTLhbG1jSVWzolugGRTlqIU5qeB9mnVS6tHpwJCjRkr/7MTMr28rUAEkrkitqXOmh+/H0/LxG1heRygsTCjGhGfIaVUkkZN3z4atOLYFZOtD1JrhYHkCtJJxQ5rlE4BL1eY+lvCmKJikpguM1zQMVR2GZFTBMytOddMenkZcSWUimK3hkLPcNVEiO7dj9UqEJ7eGjw6sLOuYUABiDmpzHDs94GDbbtaiYIM4CopKM3BjUDnqHNiF/SygOsTvc208jlnYAFFizDaufmdMHaNwtWJkkETwOhWRH5eCkVI6Z/hxc2quJFglkiEg7GCMVq+3H2fptd322XpXto9cTkAj2hlIPddSVYeHEFrEyem/VmVJ2kyMtpcnx2TkkREHV+UP3U6lNeLrarmSRTYyCNkFMeTgLm3TzOVXh6i91v3MJPZ3KvHbMORygzXidBKyFubzE7neXAW7iUiYgyRysDGAeJLKyUl2GksxrarmbC7htM0VrMzM89lnocLlpINBiccckR5NS8sWFiuGILdIjb1ZWtXiY1NXC4Z2Y6V1nqRtDWr+bJiO53K4LWFvAQu3hqG5glMdCRaMtXT6qeZ4eVjuO1zW22223qEHXnokknGbds8oGQXJBQFZn0dN/i4NltcZvH6lKOPLUuhGXxulxXw6X/AA4e6nMsF1C7pLLBSjEqaStIrgdSwNen/wCTEhsBJLGo6rQqscaotJOSysy+1tKLHFU33tcdu4kuXI6txZxRySoqEAnMRDPmJB5Ven7uHiWFHCuGED1uKjkHKJKcyrJHH36oaE6UWILS3ay3GxUFzDGHd42cnj1Cy0FiVd6mkanuQ4G4wwy2sSqxliuloZUQ/Ez+G0ZXXUkj6cGe2l6SKpkllYhI0ReJZm4ChRx1YmsfSKxbhvHSNvdeqGUhI14gpZqe1uLL+Zyppq6ayK9WM/aeJx9Pd8gMpKsCCCO3MdhxDsX+I0TXcMa9Kw9TxqXvrfwifI1XUKsP/OurW1eLO+guUv8AZ5j1dp3eBme1lU8KldGIRxqHTLK64a5iQy3RzbpZKEZCSXOlhT28R/y4jiWQQTwJIDFkWLnMnLUdKgHLhppxbwWN1LD0z1LkUZhBwGZYrp6lJOoN97nXDW5Ec1zcwyS2xfqQAGM0ABs4xJUp1SZUfy61VnqW2iurmKxlDRNtxlcpKkxp0qoXoqprZFWKNEo1R82Lb07sEItrjVHJKHLSiEZrHkkEaMkj6WzTw61evG2Mt8d33u7WW4vIOJaKMKcpC82sLo79LN3FxaqUE6MAY4oq2mGa11NbNRMvNzgUr49WpLm7dLSWPONJiskgYxqCEQZoqurK2peo9Nf4Z7ixWEXyp1IHd2jYaGpKNIW5MjI2rU+rFwtxGpCoyblIrGRJGkyUNnGHVMw+bUa6/wCBbPevU+6vaelYldNvqUtf3qPxaK3OUU0iN2ebGkMatU/ex/QtqiOzek4WJi2yORnkn459S7lYlp3LaqD5aadOivH09n6Pp7vlSwRCO/2S8I/qOy3YrtZge1sj8OXIaJk1I1PNhd5/w+llLwjPcvT8kiruFsGYBmjJ/wDsW656ZFOnR1e9gR3FNvOjhyxjCssmRXJ+HK2kMmn/AKmp8LbXVg63kuU1pOHEcOvRGwiyTynEbMlBSqnp6cTX25O97fDyzGGWN2gZQi1PIrsA2XlrF/L55O5i3kaSNwjO4UgTJG5ACtqQszx5MyKj01qveqx1YbdnmAKzXi0KZnjXpoahS9XeoHi5tNWLOIv1Zb8MJXRVYpTk7KroFV16dNVTO3m/dxJbW9nAalIjFzFnFIGbMux/mKuefPqSnpNzYFpZWq329XUpM18xWSBWLFiscSOUR0KiN6l5P3tWIdr2WG3m3OQNCIre3twkZKspypK6Ke2Ly/w4udpEFp6h9UOV6loI0NjaumWRuaAoklVhn0U5eWSXvvLuu93b3l7LwrflRAcwkaDJY417qIKfkfT3fLhv9uuJLS9tmDwXETFHRveCMJaesBHsvqphRF6gjCxWl03AKLoU+RL7pkHS5uXRj8vfQdNq/LEis6zQPwzhcVrUc3bNdNGqvqacSrFt3RsWboxmWGOSSgnPoCUKGYsw1sVRE5vLXEtvtsMklwIVqd6GIdoD1I41ORqd34tR9xe9iX+lRmNo2pu4brW0alyzFnPDShyXhp+7g5Si3luGZYZLZY36aFUFZQhgx4dwq8nNz4/pe0rF+eRo0uJlKrHDEyjOVISFV2ZaYz0a6Gr1/ExuG+bz6hkttns3c3V3KGiiDPxy6sqt1JGB+F8XkTmZWxN6e/w8ilsNvkBjvt9ny/qN4O1qSMvy0DHjRFS7d7vI3yDj6e75lNi9QwNvXpfKmO3YgXNpn/MtJTnTlwbpOen3fL5sXG9+nt2l3T01dkB7q3kMcttK3KLuIny5amokqpSRHaRZEZkxPapElvZ2RC1W0skoaRMwQ7EgNWyDlala/wCXjcotwuUjZpDdRyW5V0kkgBqjYZtM3TkK8zdBGTmqerETWl+5voenJSoMfWkzCmBpFk0SnVNQ1Hl01SSs8eIrj1ZCE3F41Nr6bj6Zv5MsxXPLnIbSB8qs6+pzUJowr7hKsNhASbLa7cUW8AY91RzOcyXlcs/4fl/T3fNf1DZrowSsKJ4iA0U0efGOaM6ZEPub8OqnEJt5bb0NvuRhvLXKixmL9skUoGUXHmjkp06K2prwzbnvWzQ2hiMJuTukLI0SoCtEaZvmaBwyZmarmwbf0Ww3P1C8Ihn9QuhS2twAFpsrZhk0mWQa4kXu6E1aZb2+nkurudi81xMxeR2PazM2ZJPzH2fs/s32fs/yZ//Z";

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
    	append_styles(target, "svelte-7ajgrg", ".svelte-7ajgrg.svelte-7ajgrg{box-sizing:border-box}.element-preview.svelte-7ajgrg.svelte-7ajgrg{position:relative;margin-bottom:20px}.element-preview.svelte-7ajgrg .editElementButton.svelte-7ajgrg{display:none;position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;background-color:rgb(51, 51, 51);width:50px;text-align:center}.element-preview.svelte-7ajgrg:hover .editElementButton.svelte-7ajgrg{display:block}.element-preview.svelte-7ajgrg select.svelte-7ajgrg{margin-right:10px;background-color:black;color:white;padding:5px;display:inline-block}.element-preview.svelte-7ajgrg input.svelte-7ajgrg,textarea.svelte-7ajgrg.svelte-7ajgrg{background:none;position:relative;display:inline-block;color:white;margin:0}.textInput.svelte-7ajgrg.svelte-7ajgrg,.textarea.svelte-7ajgrg.svelte-7ajgrg{width:280px}.element-preview.svelte-7ajgrg label.svelte-7ajgrg{min-width:110px;display:inline-block}.element-preview.svelte-7ajgrg .textarea_label.svelte-7ajgrg{vertical-align:top}.element-preview.svelte-7ajgrg .layer_image_label.svelte-7ajgrg{vertical-align:60px}.element-preview.svelte-7ajgrg .slider_label.svelte-7ajgrg{vertical-align:10px}.element-properties.svelte-7ajgrg.svelte-7ajgrg{background-color:rgb(51, 51, 51);padding:10px;display:block;position:relative}.element-properties.svelte-7ajgrg label.svelte-7ajgrg{min-width:110px;display:inline-block}.element-properties.svelte-7ajgrg input.svelte-7ajgrg,textarea.svelte-7ajgrg.svelte-7ajgrg{background:none;position:relative;display:inline-block;color:white;margin:0}.formLine.svelte-7ajgrg.svelte-7ajgrg{display:block;margin-bottom:10px}.element-properties.svelte-7ajgrg .formClose.svelte-7ajgrg{position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;width:20px}.slidervalue.svelte-7ajgrg.svelte-7ajgrg{vertical-align:10px;margin-right:10px}.element-properties.svelte-7ajgrg button.svelte-7ajgrg{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:15px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.element-properties.svelte-7ajgrg .delete.svelte-7ajgrg{background-color:red;color:white}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUVsZW1lbnQuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtRWxlbWVudC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XHJcblxyXG5cclxuICAgIGV4cG9ydCBsZXQgZWxlbWVudDtcclxuICAgIGV4cG9ydCBsZXQgc2hvd1Byb3BlcnRpZXM9ZmFsc2VcclxuICAgIGltcG9ydCB7bGF5ZXJfaW1hZ2VfcHJldmlld30gZnJvbSBcIi4vaW1hZ2VzXCJcclxuICBpbXBvcnQgeyBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrIH0gZnJvbSAnc3ZlbHRlL2ludGVybmFsJztcclxuICAgIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gXCIuL3N0b3Jlcy9tZXRhZGF0YVwiO1xyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcclxuICAgIGxldCB2YWx1ZT0xXHJcbiAgICBcclxuICAgIC8vIEZ1bmN0aW9uIHRvIGltbWVkaWF0ZWx5IHVwZGF0ZSB0aGUgcGFyZW50IGNvbXBvbmVudFxyXG4gICAgZnVuY3Rpb24gdXBkYXRlRWxlbWVudCh1cGRhdGVkUHJvcHMpIHtcclxuICAgICAgICBlbGVtZW50PXsgLi4uZWxlbWVudCwgLi4udXBkYXRlZFByb3BzIH1cclxuICAgICAgICBkaXNwYXRjaCgndXBkYXRlJywgZWxlbWVudClcclxuICAgICAgICBpZiAoZWxlbWVudC50eXBlPT09XCJzbGlkZXJcIiB8fCBlbGVtZW50LnR5cGU9PT1cIm51bWJlclwiKSB2YWx1ZT1lbGVtZW50LmRlZmF1bHRcclxuICAgIH1cclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgb3B0aW9uIHVwZGF0ZXMgZm9yIGRyb3Bkb3duc1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlT3B0aW9uQ2hhbmdlKGV2ZW50LCBpbmRleCwga2V5KSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZE9wdGlvbnMgPSBbLi4uZWxlbWVudC5vcHRpb25zXTtcclxuICAgICAgICB1cGRhdGVkT3B0aW9uc1tpbmRleF1ba2V5XSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB1cGRhdGVFbGVtZW50KHsgb3B0aW9uczogdXBkYXRlZE9wdGlvbnMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGEgbmV3IG9wdGlvbiB0byB0aGUgZHJvcGRvd25cclxuICAgIGZ1bmN0aW9uIGFkZE9wdGlvbigpIHtcclxuICAgICAgICB1cGRhdGVFbGVtZW50KHsgb3B0aW9uczogWy4uLmVsZW1lbnQub3B0aW9ucywgeyB0ZXh0OiAnJywga2V5OiAnJyB9XSB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgYW4gb3B0aW9uIGZyb20gdGhlIGRyb3Bkb3duXHJcbiAgICBmdW5jdGlvbiByZW1vdmVPcHRpb24oaW5kZXgpIHtcclxuICAgICAgICBjb25zdCB1cGRhdGVkT3B0aW9ucyA9IGVsZW1lbnQub3B0aW9ucy5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KTtcclxuICAgICAgICB1cGRhdGVFbGVtZW50KHsgb3B0aW9uczogdXBkYXRlZE9wdGlvbnMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb3BlblByb3BlcnRpZXMoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goJ29wZW5Qcm9wZXJ0aWVzJyx7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNsb3NlUHJvcGVydGllcygpIHtcclxuICAgICAgICBkaXNwYXRjaCgnY2xvc2VQcm9wZXJ0aWVzJyx7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXCJkZWxldGVcIix7fSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGFkdmFuY2VkT3B0aW9ucz10cnVlXHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdiBjbGFzcz1cImVsZW1lbnQtcHJldmlld1wiPlxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJlZGl0RWxlbWVudEJ1dHRvblwiIG9uOmNsaWNrPXtvcGVuUHJvcGVydGllc30+RWRpdDwvZGl2PlxyXG4gICAgPCEtLSBFbGVtZW50IHByZXZpZXcgYmFzZWQgb24gdHlwZSAtLT5cclxuICAgIHsjaWYgZWxlbWVudC50eXBlPT09XCJhZHZhbmNlZF9vcHRpb25zXCJ9IFxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW1pc3NpbmctYXR0cmlidXRlIC0tPlxyXG4gICAgICAgIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7IGFkdmFuY2VkT3B0aW9ucz0hYWR2YW5jZWRPcHRpb25zOyBkaXNwYXRjaChcInJlZHJhd0FsbFwiLHt9KSB9fT5TaG93IEFkdmFuY2VkIE9wdGlvbnM8L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcblxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGU9PT1cImxheWVyX2ltYWdlXCJ9IFxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJsYXllcl9pbWFnZV9sYWJlbFwiPntlbGVtZW50Lm5hbWV9OjwvbGFiZWw+XHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktbWlzc2luZy1hdHRyaWJ1dGUgLS0+XHJcbiAgICAgICAgPGltZyBuYW1lPVwie2VsZW1lbnQubmFtZX1cIiBzcmM9XCJ7bGF5ZXJfaW1hZ2VfcHJldmlld31cIj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3RleHQnfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0ZXh0SW5wdXRcIiBwbGFjZWhvbGRlcj1cIntlbGVtZW50LnBsYWNlaG9sZGVyfVwiICB2YWx1ZT1cIntlbGVtZW50LmRlZmF1bHR9XCIvPlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ3RleHRhcmVhJ31cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9IGNsYXNzPVwidGV4dGFyZWFfbGFiZWxcIj57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJ0ZXh0YXJlYVwiIHBsYWNlaG9sZGVyPVwie2VsZW1lbnQucGxhY2Vob2xkZXJ9XCIgbmFtZT1cIntlbGVtZW50Lm5hbWV9XCI+e2VsZW1lbnQuZGVmYXVsdH08L3RleHRhcmVhPlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ2NoZWNrYm94J31cclxuICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtlbGVtZW50LmRlZmF1bHQ9PT1cInRydWVcIn0gIC8+IHtlbGVtZW50LmxhYmVsfVxyXG4gICAgICAgIDwvbGFiZWw+XHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAnZHJvcGRvd24nfVxyXG4gICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIGNsYXNzPVwiZHJvcGRvd25cIj5cclxuICAgICAgICAgICAgeyNlYWNoIGVsZW1lbnQub3B0aW9ucyBhcyBvcHRpb259XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb24udmFsdWV9PntvcHRpb24udGV4dH0gPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgIHs6ZWxzZSBpZiBlbGVtZW50LnR5cGUgPT09ICdwcmVfZmlsbGVkX2Ryb3Bkb3duJ31cclxuICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgeyNpZiBlbGVtZW50LndpZGdldF9uYW1lICYmICRtZXRhZGF0YS5jb21ib192YWx1ZXNbZWxlbWVudC53aWRnZXRfbmFtZV0gfVxyXG4gICAgICAgIDxzZWxlY3QgbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgY2xhc3M9XCJkcm9wZG93blwiPlxyXG4gICAgICAgICAgeyNlYWNoICRtZXRhZGF0YS5jb21ib192YWx1ZXNbZWxlbWVudC53aWRnZXRfbmFtZV0gYXMgdn1cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3Z9Pnt2fSA8L29wdGlvbj5cclxuICAgICAgICAgICAgey9lYWNofSBcclxuICAgICAgICA8L3NlbGVjdD4gICAgICBcclxuICAgICAgICB7OmVsc2UgaWYgIWVsZW1lbnQud2lkZ2V0X25hbWV9ICBcclxuICAgICAgICAgICAgU2VsZWN0IFdpZGdldFxyXG4gICAgICAgIHs6ZWxzZX1cclxuICAgICAgICAgICAgV2lkZ2V0IHtlbGVtZW50LndpZGdldF9uYW1lfSBub3QgZm91bmQuXHJcbiAgICAgICAgey9pZn1cclxuICAgIHs6ZWxzZSBpZiBlbGVtZW50LnR5cGUgPT09ICdzbGlkZXInfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJzbGlkZXJfbGFiZWxcIj57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNsaWRlcnZhbHVlXCI+e3ZhbHVlfTwvc3Bhbj48aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtlbGVtZW50Lm1pbn0gbWF4PXtlbGVtZW50Lm1heH0gc3RlcD17ZWxlbWVudC5zdGVwfSB2YWx1ZT1cIntlbGVtZW50LmRlZmF1bHR9XCIgbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgb246Y2hhbmdlPXsoZSkgPT4ge3ZhbHVlPWUudGFyZ2V0LnZhbHVlfX0vPlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcid9XHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG1pbj17ZWxlbWVudC5taW59IG1heD17ZWxlbWVudC5tYXh9IHN0ZXA9e2VsZW1lbnQuc3RlcH0gdmFsdWU9XCJ7ZWxlbWVudC5kZWZhdWx0fVwiIG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIC8+XHJcbiAgICB7L2lmfSAgICBcclxuPC9kaXY+XHJcbnsjaWYgc2hvd1Byb3BlcnRpZXN9XHJcbjxkaXYgY2xhc3M9XCJlbGVtZW50LXByb3BlcnRpZXNcIiA+XHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgPGRpdiBjbGFzcz1cImZvcm1DbG9zZVwiIG9uOmNsaWNrPXtjbG9zZVByb3BlcnRpZXN9Plg8L2Rpdj5cclxuICAgIHsjaWYgZWxlbWVudC50eXBlICE9PSAnbGF5ZXJfaW1hZ2UnICYmICBlbGVtZW50LnR5cGUhPT1cImFkdmFuY2VkX29wdGlvbnNcIn0gXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJsYWJlbFwiPkxhYmVsOjwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJsYWJlbFwiIHZhbHVlPXtlbGVtZW50LmxhYmVsfSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBsYWJlbDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwibmFtZVwiPiBOYW1lOiA8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiICB2YWx1ZT17ZWxlbWVudC5uYW1lfSBvbjpjaGFuZ2U9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgbmFtZTogZS50YXJnZXQudmFsdWUgfSkgfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cImRlZmF1bHRcIj4gRGVmYXVsdCB2YWx1ZTogPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZGVmYXVsdFwiIHZhbHVlPXtlbGVtZW50LmRlZmF1bHR9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IGRlZmF1bHQ6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PiAgICBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJoaWRkZW5cIj5IaWRkZW46IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiaGlkZGVuXCIgYmluZDpjaGVja2VkPXtlbGVtZW50LmhpZGRlbn0gIC8+IEhpZGUgSW5wdXQgaW4gZm9ybVxyXG4gICAgICAgIDwvZGl2PiAgICAgICBcclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3RleHQnIHx8IGVsZW1lbnQudHlwZSA9PT0gJ3RleHRhcmVhJ31cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJwbGFjZWhvbGRlclwiPiBQbGFjZWhvbGRlcjogPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwicGxhY2Vob2xkZXJcIiB2YWx1ZT17ZWxlbWVudC5wbGFjZWhvbGRlcn0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgcGxhY2Vob2xkZXI6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PiAgXHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGUgPT09ICdsYXllcl9pbWFnZScgfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm5hbWVcIj4gTmFtZTogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT17ZWxlbWVudC5uYW1lfSBvbjpjaGFuZ2U9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgbmFtZTogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwiZnJvbV9zZWxlY3Rpb25cIj5QaXhlbCBEYXRhOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImZyb21fc2VsZWN0aW9uXCIgYmluZDpjaGVja2VkPXtlbGVtZW50LmZyb21fc2VsZWN0aW9ufSAgLz4gRnJvbSBTZWxlY3Rpb25cclxuICAgICAgICA8L2Rpdj4gICAgICBcclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ2Ryb3Bkb3duJ31cclxuICAgICAgICB7I2VhY2ggZWxlbWVudC5vcHRpb25zIGFzIG9wdGlvbiwgaW5kZXh9XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInRleHRcIj5PcHRpb24gVGV4dDo8L2xhYmVsPiA8aW5wdXQgbmFtZT1cInRleHRcIiB0eXBlPVwidGV4dFwiIHZhbHVlPXtvcHRpb24udGV4dH0gb246aW5wdXQ9eyhlKSA9PiBoYW5kbGVPcHRpb25DaGFuZ2UoZSwgaW5kZXgsICd0ZXh0Jyl9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJrZXlcIj5PcHRpb24gVmFsdWU6PC9sYWJlbD4gPGlucHV0IG5hbWU9XCJ2YWx1ZVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e29wdGlvbi52YWx1ZX0gb246aW5wdXQ9eyhlKSA9PiBoYW5kbGVPcHRpb25DaGFuZ2UoZSwgaW5kZXgsICd2YWx1ZScpfSAvPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbjpjbGljaz17KCkgPT4gcmVtb3ZlT3B0aW9uKGluZGV4KX0+UmVtb3ZlIE9wdGlvbjwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgPGJ1dHRvbiBvbjpjbGljaz17YWRkT3B0aW9ufT5BZGQgT3B0aW9uPC9idXR0b24+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGUgPT09ICdwcmVfZmlsbGVkX2Ryb3Bkb3duJ31cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJ3aWRnZXRfbmFtZVwiPiBDb21ibyBXaWRnZXQ6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxzZWxlY3QgIG5hbWU9XCJ3aWRnZXRfbmFtZVwiICBvbjpjaGFuZ2U9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgd2lkZ2V0X25hbWU6IGUudGFyZ2V0LnZhbHVlIH0pfSBiaW5kOnZhbHVlPXtlbGVtZW50LndpZGdldF9uYW1lfSAgPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsjaWYgJG1ldGFkYXRhLmNvbWJvX3ZhbHVlc31cclxuICAgICAgICAgICAgICAgICAgICB7I2VhY2ggT2JqZWN0LmVudHJpZXMoJG1ldGFkYXRhLmNvbWJvX3ZhbHVlcykgYXMgW3dpZGdldF9uYW1lLHZhbHVlc119XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3dpZGdldF9uYW1lfT57d2lkZ2V0X25hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICA8L2Rpdj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3NsaWRlcicgfHwgZWxlbWVudC50eXBlID09PSAnbnVtYmVyJ31cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm1pblwiPiBNaW46IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwibWluXCIgdHlwZT1cIm51bWJlclwiIHZhbHVlPXtlbGVtZW50Lm1pbn0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgbWluOiBlLnRhcmdldC52YWx1ZSB9KX0gLz4gIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm1heFwiPiBNYXg6PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJtYXhcIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e2VsZW1lbnQubWF4fSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBtYXg6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PiBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInN0ZXBcIj4gU3RlcDogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJzdGVwXCIgdHlwZT1cIm51bWJlclwiIHZhbHVlPXtlbGVtZW50LnN0ZXB9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IHN0ZXA6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgPC9kaXY+XHJcbiAgICB7L2lmfVxyXG4gICAgPGRpdj48YnV0dG9uIG9uOmNsaWNrPXsoKSA9PiBkZWxldGVFbGVtZW50KCl9IGNsYXNzPVwiZGVsZXRlXCI+RGVsZXRlPC9idXR0b24+PC9kaXY+XHJcblxyXG48L2Rpdj5cclxuey9pZn1cclxuXHJcbjxzdHlsZT5cclxuICAgICoge1xyXG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcblxyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyB7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IC5lZGl0RWxlbWVudEJ1dHRvbiB7XHJcbiAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgcmlnaHQ6MHB4O1xyXG4gICAgICAgIHRvcDogMHB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBwYWRkaW5nOiA1cHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDUxLCA1MSwgNTEpO1xyXG4gICAgICAgIHdpZHRoOjUwcHg7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC5lbGVtZW50LXByZXZpZXc6aG92ZXIgLmVkaXRFbGVtZW50QnV0dG9uIHtcclxuICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgc2VsZWN0IHtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDsgICBcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyBpbnB1dCx0ZXh0YXJlYSB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIGNvbG9yOndoaXRlO1xyXG4gICAgICAgIG1hcmdpbjogMDtcclxuICAgIH1cclxuICAgIC50ZXh0SW5wdXQsLnRleHRhcmVhIHtcclxuICAgICAgICB3aWR0aDogMjgwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IGxhYmVsIHtcclxuICAgICAgICBtaW4td2lkdGg6IDExMHB4O1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLnRleHRhcmVhX2xhYmVsIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyAubGF5ZXJfaW1hZ2VfbGFiZWwge1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiA2MHB4O1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyAuc2xpZGVyX2xhYmVsIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogMTBweDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYig1MSwgNTEsIDUxKTtcclxuICAgICAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgICAgIGRpc3BsYXk6YmxvY2s7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMgbGFiZWwge1xyXG4gICAgICAgIG1pbi13aWR0aDogMTEwcHg7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyBpbnB1dCx0ZXh0YXJlYSB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIGNvbG9yOndoaXRlO1xyXG4gICAgICAgIG1hcmdpbjogMDtcclxuICAgIH0gICAgXHJcbiAgICAuZm9ybUxpbmUge1xyXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIC5mb3JtQ2xvc2Uge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICByaWdodDowcHg7XHJcbiAgICAgICAgdG9wOiAwcHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgICAgICB3aWR0aDogMjBweDtcclxuICAgIH0gICAgXHJcbiBcclxuICAgIC5zbGlkZXJ2YWx1ZSB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IDEwcHg7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfSBcclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMgYnV0dG9uIHtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgbWluLXdpZHRoOiA3MHB4O1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIC5kZWxldGUge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB9ICAgICAgIFxyXG48L3N0eWxlPlxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBeUxJLDRCQUFFLENBQ0UsVUFBVSxDQUFFLFVBRWhCLENBQ0EsNENBQWlCLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsYUFBYSxDQUFFLElBQ25CLENBQ0EsOEJBQWdCLENBQUMsZ0NBQW1CLENBQ2hDLE9BQU8sQ0FBRSxJQUFJLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsTUFBTSxHQUFHLENBQ1QsR0FBRyxDQUFFLEdBQUcsQ0FDUixNQUFNLENBQUUsT0FBTyxDQUNmLE9BQU8sQ0FBRSxHQUFHLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDakMsTUFBTSxJQUFJLENBQ1YsVUFBVSxDQUFFLE1BQ2hCLENBRUEsOEJBQWdCLE1BQU0sQ0FBQyxnQ0FBbUIsQ0FDdEMsT0FBTyxDQUFFLEtBQ2IsQ0FDQSw4QkFBZ0IsQ0FBQyxvQkFBTyxDQUNwQixZQUFZLENBQUUsSUFBSSxDQUNsQixnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLEtBQUssQ0FBRSxLQUFLLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FDWixPQUFPLENBQUUsWUFDZixDQUNFLDhCQUFnQixDQUFDLG1CQUFLLENBQUMsb0NBQVMsQ0FDNUIsVUFBVSxDQUFFLElBQUksQ0FDaEIsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLFlBQVksQ0FDckIsTUFBTSxLQUFLLENBQ1gsTUFBTSxDQUFFLENBQ1osQ0FDQSxzQ0FBVSxDQUFDLHFDQUFVLENBQ2pCLEtBQUssQ0FBRSxLQUNYLENBQ0EsOEJBQWdCLENBQUMsbUJBQU0sQ0FDbkIsU0FBUyxDQUFFLEtBQUssQ0FDaEIsT0FBTyxDQUFFLFlBQ2IsQ0FDQSw4QkFBZ0IsQ0FBQyw2QkFBZ0IsQ0FDN0IsY0FBYyxDQUFFLEdBQ3BCLENBQ0EsOEJBQWdCLENBQUMsZ0NBQW1CLENBQ2hDLGNBQWMsQ0FBRSxJQUNwQixDQUNBLDhCQUFnQixDQUFDLDJCQUFjLENBQzNCLGNBQWMsQ0FBRSxJQUNwQixDQUNBLCtDQUFvQixDQUNoQixnQkFBZ0IsQ0FBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNqQyxPQUFPLENBQUUsSUFBSSxDQUNiLFFBQVEsS0FBSyxDQUNiLFFBQVEsQ0FBRSxRQUVkLENBQ0EsaUNBQW1CLENBQUMsbUJBQU0sQ0FDdEIsU0FBUyxDQUFFLEtBQUssQ0FDaEIsT0FBTyxDQUFFLFlBQ2IsQ0FDQSxpQ0FBbUIsQ0FBQyxtQkFBSyxDQUFDLG9DQUFTLENBQy9CLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLE1BQU0sS0FBSyxDQUNYLE1BQU0sQ0FBRSxDQUNaLENBQ0EscUNBQVUsQ0FDTixPQUFPLENBQUUsS0FBSyxDQUNkLGFBQWEsQ0FBRSxJQUNuQixDQUNBLGlDQUFtQixDQUFDLHdCQUFXLENBQzNCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE1BQU0sR0FBRyxDQUNULEdBQUcsQ0FBRSxHQUFHLENBQ1IsTUFBTSxDQUFFLE9BQU8sQ0FDZixPQUFPLENBQUUsR0FBRyxDQUNaLEtBQUssQ0FBRSxJQUNYLENBRUEsd0NBQWEsQ0FDVCxjQUFjLENBQUUsSUFBSSxDQUNwQixZQUFZLENBQUUsSUFDbEIsQ0FDQSxpQ0FBbUIsQ0FBQyxvQkFBTyxDQUN2QixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUNuSSxTQUFTLENBQUUsSUFBSSxDQUNmLFNBQVMsQ0FBRSxJQUFJLENBQ2YsS0FBSyxDQUFFLEtBQUssQ0FDWixnQkFBZ0IsQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxZQUFZLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDaEMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsTUFBTSxDQUFFLE9BQU8sQ0FDZixZQUFZLENBQUUsSUFDbEIsQ0FDQSxpQ0FBbUIsQ0FBQyxxQkFBUSxDQUN4QixnQkFBZ0IsQ0FBRSxHQUFHLENBQ3JCLEtBQUssQ0FBRSxLQUNYIn0= */");
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i][0];
    	child_ctx[32] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[37] = i;
    	return child_ctx;
    }

    function get_each_context_3$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    // (55:4) {#if element.type==="advanced_options"}
    function create_if_block_18(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Show Advanced Options";
    			attr_dev(button, "class", "svelte-7ajgrg");
    			add_location(button, file$6, 56, 8, 1919);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[13], false, false, false, false);
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
    		source: "(55:4) {#if element.type===\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (60:4) {#if element.type==="layer_image"}
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
    			attr_dev(label, "class", "layer_image_label svelte-7ajgrg");
    			add_location(label, file$6, 60, 8, 2102);
    			attr_dev(img, "name", img_name_value = /*element*/ ctx[0].name);
    			if (!src_url_equal(img.src, img_src_value = layer_image_preview)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-7ajgrg");
    			add_location(img, file$6, 62, 8, 2242);
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
    		source: "(60:4) {#if element.type===\\\"layer_image\\\"}",
    		ctx
    	});

    	return block;
    }

    // (98:40) 
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
    			add_location(label, file$6, 98, 8, 4210);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = input_value_value = /*element*/ ctx[0].default;
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-7ajgrg");
    			add_location(input, file$6, 99, 8, 4270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);
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

    			if (dirty[0] & /*element, $metadata*/ 17 && input_value_value !== (input_value_value = /*element*/ ctx[0].default) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
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
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(98:40) ",
    		ctx
    	});

    	return block;
    }

    // (95:40) 
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
    			t3 = text(/*value*/ ctx[3]);
    			input = element("input");
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "slider_label svelte-7ajgrg");
    			add_location(label, file$6, 95, 8, 3870);
    			attr_dev(span, "class", "slidervalue svelte-7ajgrg");
    			add_location(span, file$6, 96, 8, 3951);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = input_value_value = /*element*/ ctx[0].default;
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-7ajgrg");
    			add_location(input, file$6, 96, 48, 3991);
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
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[14], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*value*/ 8) set_data_dev(t3, /*value*/ ctx[3]);

    			if (dirty[0] & /*element, $metadata*/ 17 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_value_value !== (input_value_value = /*element*/ ctx[0].default)) {
    				prop_dev(input, "value", input_value_value);
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
    		source: "(95:40) ",
    		ctx
    	});

    	return block;
    }

    // (82:53) 
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
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$6, 82, 4, 3309);
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
    		source: "(82:53) ",
    		ctx
    	});

    	return block;
    }

    // (75:42) 
    function create_if_block_11$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let select;
    	let select_name_value;
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
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$6, 75, 4, 2984);
    			attr_dev(select, "name", select_name_value = /*element*/ ctx[0].name);
    			attr_dev(select, "class", "dropdown svelte-7ajgrg");
    			add_location(select, file$6, 76, 8, 3044);
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
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element*/ 1) {
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$2.name,
    		type: "if",
    		source: "(75:42) ",
    		ctx
    	});

    	return block;
    }

    // (71:42) 
    function create_if_block_10$2(ctx) {
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
    			add_location(input, file$6, 72, 12, 2839);
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$6, 71, 8, 2818);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 17 && input_checked_value !== (input_checked_value = /*element*/ ctx[0].default === "true")) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty[0] & /*element*/ 1 && t1_value !== (t1_value = /*element*/ ctx[0].label + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$2.name,
    		type: "if",
    		source: "(71:42) ",
    		ctx
    	});

    	return block;
    }

    // (68:42) 
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
    			add_location(label, file$6, 68, 8, 2568);
    			attr_dev(textarea, "class", "textarea svelte-7ajgrg");
    			attr_dev(textarea, "placeholder", textarea_placeholder_value = /*element*/ ctx[0].placeholder);
    			attr_dev(textarea, "name", textarea_name_value = /*element*/ ctx[0].name);
    			textarea.value = textarea_value_value = /*element*/ ctx[0].default;
    			add_location(textarea, file$6, 69, 8, 2651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, textarea, anchor);
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

    			if (dirty[0] & /*element, $metadata*/ 17 && textarea_value_value !== (textarea_value_value = /*element*/ ctx[0].default)) {
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
    		id: create_if_block_9$2.name,
    		type: "if",
    		source: "(68:42) ",
    		ctx
    	});

    	return block;
    }

    // (65:4) {#if element.type === 'text'}
    function create_if_block_8$2(ctx) {
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
    			add_location(label, file$6, 65, 8, 2353);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "textInput svelte-7ajgrg");
    			attr_dev(input, "placeholder", input_placeholder_value = /*element*/ ctx[0].placeholder);
    			input.value = input_value_value = /*element*/ ctx[0].default;
    			add_location(input, file$6, 66, 8, 2413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_placeholder_value !== (input_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input_value_value !== (input_value_value = /*element*/ ctx[0].default) && input.value !== input_value_value) {
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
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(65:4) {#if element.type === 'text'}",
    		ctx
    	});

    	return block;
    }

    // (92:8) {:else}
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
    		source: "(92:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (90:39) 
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
    		source: "(90:39) ",
    		ctx
    	});

    	return block;
    }

    // (84:8) {#if element.widget_name && $metadata.combo_values[element.widget_name] }
    function create_if_block_13$1(ctx) {
    	let select;
    	let select_name_value;
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
    			attr_dev(select, "class", "dropdown svelte-7ajgrg");
    			add_location(select, file$6, 84, 8, 3452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata, element*/ 17) {
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$1.name,
    		type: "if",
    		source: "(84:8) {#if element.widget_name && $metadata.combo_values[element.widget_name] }",
    		ctx
    	});

    	return block;
    }

    // (86:10) {#each $metadata.combo_values[element.widget_name] as v}
    function create_each_block_3$3(ctx) {
    	let option;
    	let t0_value = /*v*/ ctx[40] + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*v*/ ctx[40];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-7ajgrg");
    			add_location(option, file$6, 86, 16, 3585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata, element*/ 17 && t0_value !== (t0_value = /*v*/ ctx[40] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$metadata, element*/ 17 && option_value_value !== (option_value_value = /*v*/ ctx[40])) {
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
    		id: create_each_block_3$3.name,
    		type: "each",
    		source: "(86:10) {#each $metadata.combo_values[element.widget_name] as v}",
    		ctx
    	});

    	return block;
    }

    // (78:12) {#each element.options as option}
    function create_each_block_2$3(ctx) {
    	let option;
    	let t0_value = /*option*/ ctx[35].text + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*option*/ ctx[35].value;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-7ajgrg");
    			add_location(option, file$6, 78, 16, 3156);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*option*/ ctx[35].text + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 17 && option_value_value !== (option_value_value = /*option*/ ctx[35].value)) {
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
    		id: create_each_block_2$3.name,
    		type: "each",
    		source: "(78:12) {#each element.options as option}",
    		ctx
    	});

    	return block;
    }

    // (103:0) {#if showProperties}
    function create_if_block$4(ctx) {
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
    	let if_block5 = (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') && create_if_block_1$3(ctx);

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
    			attr_dev(div0, "class", "formClose svelte-7ajgrg");
    			add_location(div0, file$6, 105, 4, 4545);
    			attr_dev(button, "class", "delete svelte-7ajgrg");
    			add_location(button, file$6, 179, 9, 8519);
    			attr_dev(div1, "class", "svelte-7ajgrg");
    			add_location(div1, file$6, 179, 4, 8514);
    			attr_dev(div2, "class", "element-properties svelte-7ajgrg");
    			add_location(div2, file$6, 103, 0, 4444);
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
    					listen_dev(button, "click", /*click_handler_2*/ ctx[30], false, false, false, false)
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
    					if_block5 = create_if_block_1$3(ctx);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(103:0) {#if showProperties}",
    		ctx
    	});

    	return block;
    }

    // (107:4) {#if element.type !== 'layer_image' &&  element.type!=="advanced_options"}
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
    			attr_dev(label0, "class", "svelte-7ajgrg");
    			add_location(label0, file$6, 108, 12, 4729);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "label");
    			input0.value = input0_value_value = /*element*/ ctx[0].label;
    			attr_dev(input0, "class", "svelte-7ajgrg");
    			add_location(input0, file$6, 109, 12, 4776);
    			attr_dev(div0, "class", "formLine svelte-7ajgrg");
    			add_location(div0, file$6, 107, 8, 4693);
    			attr_dev(label1, "for", "name");
    			attr_dev(label1, "class", "svelte-7ajgrg");
    			add_location(label1, file$6, 112, 12, 4953);
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*element*/ ctx[0].name;
    			attr_dev(input1, "class", "svelte-7ajgrg");
    			add_location(input1, file$6, 113, 8, 4997);
    			attr_dev(div1, "class", "formLine svelte-7ajgrg");
    			add_location(div1, file$6, 111, 8, 4917);
    			attr_dev(label2, "for", "default");
    			attr_dev(label2, "class", "svelte-7ajgrg");
    			add_location(label2, file$6, 116, 12, 5162);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "default");
    			input2.value = input2_value_value = /*element*/ ctx[0].default;
    			attr_dev(input2, "class", "svelte-7ajgrg");
    			add_location(input2, file$6, 117, 8, 5218);
    			attr_dev(div2, "class", "formLine svelte-7ajgrg");
    			add_location(div2, file$6, 115, 8, 5126);
    			attr_dev(label3, "for", "hidden");
    			attr_dev(label3, "class", "svelte-7ajgrg");
    			add_location(label3, file$6, 120, 12, 5405);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "name", "hidden");
    			attr_dev(input3, "class", "svelte-7ajgrg");
    			add_location(input3, file$6, 121, 12, 5456);
    			attr_dev(div3, "class", "formLine svelte-7ajgrg");
    			add_location(div3, file$6, 119, 8, 5369);
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
    					listen_dev(input0, "input", /*input_handler*/ ctx[15], false, false, false, false),
    					listen_dev(input1, "change", /*change_handler_1*/ ctx[16], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_1*/ ctx[17], false, false, false, false),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[18])
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
    		source: "(107:4) {#if element.type !== 'layer_image' &&  element.type!==\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (125:4) {#if element.type === 'text' || element.type === 'textarea'}
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
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$6, 126, 12, 5691);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "placeholder");
    			input.value = input_value_value = /*element*/ ctx[0].placeholder;
    			attr_dev(input, "class", "svelte-7ajgrg");
    			add_location(input, file$6, 127, 8, 5749);
    			attr_dev(div, "class", "formLine svelte-7ajgrg");
    			add_location(div, file$6, 125, 8, 5655);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler_2*/ ctx[19], false, false, false, false);
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
    		source: "(125:4) {#if element.type === 'text' || element.type === 'textarea'}",
    		ctx
    	});

    	return block;
    }

    // (131:4) {#if element.type === 'layer_image' }
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
    			attr_dev(label0, "class", "svelte-7ajgrg");
    			add_location(label0, file$6, 132, 12, 6000);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			input0.value = input0_value_value = /*element*/ ctx[0].name;
    			attr_dev(input0, "class", "svelte-7ajgrg");
    			add_location(input0, file$6, 133, 12, 6048);
    			attr_dev(div0, "class", "formLine svelte-7ajgrg");
    			add_location(div0, file$6, 131, 8, 5964);
    			attr_dev(label1, "for", "from_selection");
    			attr_dev(label1, "class", "svelte-7ajgrg");
    			add_location(label1, file$6, 136, 12, 6223);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "from_selection");
    			attr_dev(input1, "class", "svelte-7ajgrg");
    			add_location(input1, file$6, 137, 12, 6286);
    			attr_dev(div1, "class", "formLine svelte-7ajgrg");
    			add_location(div1, file$6, 135, 8, 6187);
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
    					listen_dev(input0, "change", /*change_handler_2*/ ctx[20], false, false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[21])
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
    		source: "(131:4) {#if element.type === 'layer_image' }",
    		ctx
    	});

    	return block;
    }

    // (141:4) {#if element.type === 'dropdown'}
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
    			attr_dev(button, "class", "svelte-7ajgrg");
    			add_location(button, file$6, 150, 8, 7066);
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
    		source: "(141:4) {#if element.type === 'dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (142:8) {#each element.options as option, index}
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
    		return /*input_handler_3*/ ctx[22](/*index*/ ctx[37], ...args);
    	}

    	function input_handler_4(...args) {
    		return /*input_handler_4*/ ctx[23](/*index*/ ctx[37], ...args);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[24](/*index*/ ctx[37]);
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
    			add_location(label0, file$6, 143, 16, 6563);
    			attr_dev(input0, "name", "text");
    			attr_dev(input0, "type", "text");
    			input0.value = input0_value_value = /*option*/ ctx[35].text;
    			attr_dev(input0, "class", "svelte-7ajgrg");
    			add_location(input0, file$6, 143, 55, 6602);
    			attr_dev(div0, "class", "formLine svelte-7ajgrg");
    			add_location(div0, file$6, 142, 12, 6523);
    			attr_dev(label1, "for", "key");
    			attr_dev(label1, "class", "svelte-7ajgrg");
    			add_location(label1, file$6, 146, 16, 6784);
    			attr_dev(input1, "name", "value");
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*option*/ ctx[35].value;
    			attr_dev(input1, "class", "svelte-7ajgrg");
    			add_location(input1, file$6, 146, 55, 6823);
    			attr_dev(button, "class", "svelte-7ajgrg");
    			add_location(button, file$6, 147, 16, 6952);
    			attr_dev(div1, "class", "formLine svelte-7ajgrg");
    			add_location(div1, file$6, 145, 12, 6744);
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

    			if (dirty[0] & /*element, $metadata*/ 17 && input0_value_value !== (input0_value_value = /*option*/ ctx[35].text) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 17 && input1_value_value !== (input1_value_value = /*option*/ ctx[35].value) && input1.value !== input1_value_value) {
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
    		source: "(142:8) {#each element.options as option, index}",
    		ctx
    	});

    	return block;
    }

    // (153:4) {#if element.type === 'pre_filled_dropdown'}
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
    			attr_dev(label, "class", "svelte-7ajgrg");
    			add_location(label, file$6, 154, 12, 7221);
    			option.__value = "Select...";
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-7ajgrg");
    			add_location(option, file$6, 156, 16, 7432);
    			attr_dev(select, "name", "widget_name");
    			attr_dev(select, "class", "svelte-7ajgrg");
    			if (/*element*/ ctx[0].widget_name === void 0) add_render_callback(() => /*select_change_handler*/ ctx[26].call(select));
    			add_location(select, file$6, 155, 12, 7284);
    			attr_dev(div, "class", "formLine svelte-7ajgrg");
    			add_location(div, file$6, 153, 8, 7185);
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
    					listen_dev(select, "change", /*change_handler_3*/ ctx[25], false, false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[26])
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
    		source: "(153:4) {#if element.type === 'pre_filled_dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (158:16) {#if $metadata.combo_values}
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
    		source: "(158:16) {#if $metadata.combo_values}",
    		ctx
    	});

    	return block;
    }

    // (159:20) {#each Object.entries($metadata.combo_values) as [widget_name,values]}
    function create_each_block$5(ctx) {
    	let option;
    	let t_value = /*widget_name*/ ctx[31] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget_name*/ ctx[31];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-7ajgrg");
    			add_location(option, file$6, 159, 24, 7622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 16 && t_value !== (t_value = /*widget_name*/ ctx[31] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*$metadata*/ 16 && option_value_value !== (option_value_value = /*widget_name*/ ctx[31])) {
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
    		source: "(159:20) {#each Object.entries($metadata.combo_values) as [widget_name,values]}",
    		ctx
    	});

    	return block;
    }

    // (166:4) {#if element.type === 'slider' || element.type === 'number'}
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
    			add_location(label0, file$6, 167, 12, 7882);
    			attr_dev(input0, "name", "min");
    			attr_dev(input0, "type", "number");
    			input0.value = input0_value_value = /*element*/ ctx[0].min;
    			attr_dev(input0, "class", "svelte-7ajgrg");
    			add_location(input0, file$6, 168, 12, 7927);
    			attr_dev(div0, "class", "formLine svelte-7ajgrg");
    			add_location(div0, file$6, 166, 8, 7846);
    			attr_dev(label1, "for", "max");
    			attr_dev(label1, "class", "svelte-7ajgrg");
    			add_location(label1, file$6, 171, 12, 8102);
    			attr_dev(input1, "name", "max");
    			attr_dev(input1, "type", "number");
    			input1.value = input1_value_value = /*element*/ ctx[0].max;
    			attr_dev(input1, "class", "svelte-7ajgrg");
    			add_location(input1, file$6, 172, 12, 8147);
    			attr_dev(div1, "class", "formLine svelte-7ajgrg");
    			add_location(div1, file$6, 170, 8, 8066);
    			attr_dev(label2, "for", "step");
    			attr_dev(label2, "class", "svelte-7ajgrg");
    			add_location(label2, file$6, 175, 12, 8321);
    			attr_dev(input2, "name", "step");
    			attr_dev(input2, "type", "number");
    			input2.value = input2_value_value = /*element*/ ctx[0].step;
    			attr_dev(input2, "class", "svelte-7ajgrg");
    			add_location(input2, file$6, 176, 12, 8368);
    			attr_dev(div2, "class", "formLine svelte-7ajgrg");
    			add_location(div2, file$6, 174, 8, 8285);
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
    					listen_dev(input0, "input", /*input_handler_5*/ ctx[27], false, false, false, false),
    					listen_dev(input1, "input", /*input_handler_6*/ ctx[28], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_7*/ ctx[29], false, false, false, false)
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(166:4) {#if element.type === 'slider' || element.type === 'number'}",
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
    	let if_block3 = /*showProperties*/ ctx[2] && create_if_block$4(ctx);

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
    			attr_dev(div0, "class", "editElementButton svelte-7ajgrg");
    			add_location(div0, file$6, 52, 4, 1697);
    			attr_dev(div1, "class", "element-preview svelte-7ajgrg");
    			add_location(div1, file$6, 50, 0, 1600);
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

    			if (/*showProperties*/ ctx[2]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$4(ctx);
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
    	let value = 1;

    	// Function to immediately update the parent component
    	function updateElement(updatedProps) {
    		$$invalidate(0, element = { ...element, ...updatedProps });
    		dispatch('update', element);
    		if (element.type === "slider" || element.type === "number") $$invalidate(3, value = element.default);
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

    	let { advancedOptions = true } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (element === undefined && !('element' in $$props || $$self.$$.bound[$$self.$$.props['element']])) {
    			console.warn("<FormElement> was created without expected prop 'element'");
    		}
    	});

    	const writable_props = ['element', 'showProperties', 'advancedOptions'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormElement> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(1, advancedOptions = !advancedOptions);
    		dispatch("redrawAll", {});
    	};

    	const change_handler = e => {
    		$$invalidate(3, value = e.target.value);
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
    	const click_handler_1 = index => removeOption(index);
    	const change_handler_3 = e => updateElement({ widget_name: e.target.value });

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
    		if ('showProperties' in $$props) $$invalidate(2, showProperties = $$props.showProperties);
    		if ('advancedOptions' in $$props) $$invalidate(1, advancedOptions = $$props.advancedOptions);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		element,
    		showProperties,
    		layer_image_preview,
    		fix_and_outro_and_destroy_block,
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
    		advancedOptions,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('showProperties' in $$props) $$invalidate(2, showProperties = $$props.showProperties);
    		if ('value' in $$props) $$invalidate(3, value = $$props.value);
    		if ('advancedOptions' in $$props) $$invalidate(1, advancedOptions = $$props.advancedOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		advancedOptions,
    		showProperties,
    		value,
    		$metadata,
    		dispatch,
    		updateElement,
    		handleOptionChange,
    		addOption,
    		removeOption,
    		openProperties,
    		closeProperties,
    		deleteElement,
    		click_handler,
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
    		click_handler_1,
    		change_handler_3,
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
    				showProperties: 2,
    				advancedOptions: 1
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

    	get advancedOptions() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set advancedOptions(value) {
    		throw new Error("<FormElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FormBuilder.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\FormBuilder.svelte";

    function add_css$6(target) {
    	append_styles(target, "svelte-1yl6ahv", ".formBuilder.svelte-1yl6ahv.svelte-1yl6ahv{padding:10px;color:white;width:470px;display:block}.formBuilder.svelte-1yl6ahv h1.svelte-1yl6ahv{font-size:16px;margin-bottom:30px}.draggable.svelte-1yl6ahv.svelte-1yl6ahv{cursor:grab}.form.svelte-1yl6ahv.svelte-1yl6ahv{border-radius:5px;background-color:black;width:450px;padding:10px;color:white;font:\"Segoe UI\", Roboto, system-ui;font-size:14px;margin-bottom:10px}.formBuilder.svelte-1yl6ahv .add_field_select_label.svelte-1yl6ahv{display:inline-block}.formBuilder.svelte-1yl6ahv .add_field_select.svelte-1yl6ahv{margin-right:10px;background-color:black;color:white;padding:5px;display:inline-block}.formBuilder.svelte-1yl6ahv button.svelte-1yl6ahv{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUJ1aWxkZXIuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtQnVpbGRlci5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICBpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XHJcbiAgaW1wb3J0IEZvcm1FbGVtZW50IGZyb20gJy4vRm9ybUVsZW1lbnQuc3ZlbHRlJztcclxuICBpbXBvcnQgeyBtZXRhZGF0YX0gZnJvbSAnLi9zdG9yZXMvbWV0YWRhdGEnXHJcbiAgaWYgKCEkbWV0YWRhdGEuZm9ybXMpICRtZXRhZGF0YS5mb3Jtcz17fVxyXG5cclxuICBleHBvcnQgbGV0IGZvcm1fa2V5PSdkZWZhdWx0JyAgLy8gc3VwcG9ydCBmb3IgbXVsdGlwbGUgZm9ybXMgKGUuZy4gd2l6YXJkcykgaW4gdGhlIGZ1dHVyZVxyXG4gIGlmICghJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XSkgJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XT17ZWxlbWVudHM6W119XHJcbiAgaWYgKCEkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldLmVsZW1lbnRzKSAkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldLmVsZW1lbnRzPVtdXHJcbiAgbGV0IGZvcm1FbGVtZW50cyA9ICRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0uZWxlbWVudHNcclxuICBlbnN1cmVVbmlxdWVOYW1lcygpXHJcbiAgbGV0IGRyYWdTdGFydEluZGV4PS0xXHJcbiAgbGV0IHNob3dQcm9wZXJ0aWVzSWR4PS0xXHJcbiAgbGV0IHNlbGVjdGVkVHlwZVxyXG5cclxuICBmdW5jdGlvbiBlbnN1cmVVbmlxdWVOYW1lcygpIHtcclxuICBjb25zdCBuYW1lTWFwID0ge307IC8vIE9iamVjdCB0byBrZWVwIHRyYWNrIG9mIG5hbWVzIGFuZCB0aGVpciBvY2N1cnJlbmNlc1xyXG5cclxuICBmb3JtRWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgIGxldCBuYW1lID0gZWxlbWVudC5uYW1lO1xyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIG5hbWUgYWxyZWFkeSBleGlzdHMgaW4gdGhlIG5hbWVNYXBcclxuICAgIGlmIChuYW1lTWFwW25hbWVdKSB7XHJcbiAgICAgIC8vIElmIHRoZSBuYW1lIGV4aXN0cywgaW5jcmVtZW50IHRoZSBjb3VudCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBuYW1lXHJcbiAgICAgIGxldCBjb3VudCA9IG5hbWVNYXBbbmFtZV07XHJcbiAgICAgIGxldCBuZXdOYW1lID0gYCR7bmFtZX1fJHtjb3VudH1gO1xyXG4gICAgICB3aGlsZSAobmFtZU1hcFtuZXdOYW1lXSkgeyAvLyBFbnN1cmUgdGhlIG5ldyBuYW1lIGlzIGFsc28gdW5pcXVlXHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgICBuZXdOYW1lID0gYCR7bmFtZX1fJHtjb3VudH1gO1xyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnQubmFtZSA9IG5ld05hbWU7XHJcbiAgICAgIG5hbWVNYXBbbmFtZV0rKztcclxuICAgICAgbmFtZU1hcFtuZXdOYW1lXSA9IDE7IC8vIEluaXRpYWxpemUgdGhpcyBuZXcgbmFtZSBpbiB0aGUgbmFtZU1hcFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gSWYgdGhlIG5hbWUgZG9lc24ndCBleGlzdCwgYWRkIGl0IHRvIHRoZSBuYW1lTWFwXHJcbiAgICAgIG5hbWVNYXBbbmFtZV0gPSAxXHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuICBmdW5jdGlvbiBhZGRFbGVtZW50KHR5cGUpIHtcclxuICAgIGlmICghdHlwZSkgcmV0dXJuXHJcbiAgICBsZXQgbmFtZT1cInZhbHVlX1wiK01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA1KVxyXG4gICAgXHJcbiAgICBsZXQgbmV3RWxlbWVudCA9IHtcclxuICAgICAgbmFtZTogbmFtZSwgLy8gVW5pcXVlIElEIGZvciBrZXkgdHJhY2tpbmcgYW5kIHJlYWN0aXZpdHlcclxuICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgbGFiZWw6IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpLFxyXG4gICAgICBuYW1lOiBuYW1lLCAvLyBFeGFtcGxlIG5hbWluZyBjb252ZW50aW9uXHJcbiAgICAgIG9wdGlvbnM6IHR5cGUgPT09ICdkcm9wZG93bicgPyBbeyB0ZXh0OiAnT3B0aW9uIDEnLCBrZXk6ICcxJyB9XSA6IFtdLFxyXG4gICAgICBkZWZhdWx0OiBcIlwiXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZT09PVwic2xpZGVyXCIgfHwgdHlwZT09PVwibnVtYmVyXCIpIHtcclxuICAgICAgbmV3RWxlbWVudC5taW49MVxyXG4gICAgICBuZXdFbGVtZW50Lm1heD0yMFxyXG4gICAgICBuZXdFbGVtZW50LnN0ZXA9MVxyXG4gICAgICBuZXdFbGVtZW50LmRlZmF1bHQ9MVxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGU9PT1cImNoZWNrYm94XCIpIHtcclxuICAgICAgbmV3RWxlbWVudC5kZWZhdWx0PWZhbHNlXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZT09PVwidGV4dFwiIHx8IHR5cGU9PT1cInRleHRhcmVhXCIpIHtcclxuICAgICAgbmV3RWxlbWVudC5wbGFjZWhvbGRlcj1cIlwiXHJcbiAgICB9XHJcbiAgICBmb3JtRWxlbWVudHMucHVzaChuZXdFbGVtZW50KVxyXG4gICAgZW5zdXJlVW5pcXVlTmFtZXMoKVxyXG4gICAgZm9ybUVsZW1lbnRzPWZvcm1FbGVtZW50c1xyXG4gICAgc2hvd1Byb3BlcnRpZXNJZHg9Zm9ybUVsZW1lbnRzLmxlbmd0aC0xXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVEcmFnU3RhcnQoZXZlbnQsIGluZGV4KSB7XHJcbiAgICBpZiAoIWFkdmFuY2VkT3B0aW9ucykgcmV0dXJuXHJcbiAgICBkcmFnU3RhcnRJbmRleCA9IGluZGV4XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVEcmFnT3ZlcihldmVudCkge1xyXG4gICAgaWYgKCFhZHZhbmNlZE9wdGlvbnMpIHJldHVyblxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKSAvLyBOZWNlc3NhcnkgdG8gYWxsb3cgZHJvcHBpbmdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZURyb3AoZXZlbnQsIGRyb3BJbmRleCkge1xyXG4gICAgaWYgKCFhZHZhbmNlZE9wdGlvbnMpIHJldHVyblxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgaWYgKGRyYWdTdGFydEluZGV4ID09PSBkcm9wSW5kZXgpIHJldHVyblxyXG4gICAgXHJcbiAgICBjb25zdCBkcmFnZ2VkSXRlbSA9IGZvcm1FbGVtZW50c1tkcmFnU3RhcnRJbmRleF07XHJcbiAgICBjb25zdCByZW1haW5pbmdJdGVtcyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoKF8sIGluZGV4KSA9PiBpbmRleCAhPT0gZHJhZ1N0YXJ0SW5kZXgpXHJcbiAgICBjb25zdCByZW9yZGVyZWRJdGVtcyA9IFtcclxuICAgICAgICAuLi5yZW1haW5pbmdJdGVtcy5zbGljZSgwLCBkcm9wSW5kZXgpLFxyXG4gICAgICAgIGRyYWdnZWRJdGVtLFxyXG4gICAgICAgIC4uLnJlbWFpbmluZ0l0ZW1zLnNsaWNlKGRyb3BJbmRleClcclxuICAgIF1cclxuICAgIC8vIFJlYXNzaWduIHRoZSByZW9yZGVyZWQgaXRlbXMgYmFjayB0byBmb3JtRWxlbWVudHNcclxuICAgIGZvcm1FbGVtZW50cyA9IHJlb3JkZXJlZEl0ZW1zXHJcbiAgICBmb3JtRWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbiAgICAvLyBSZXNldCBkcmFnZ2VkIGluZGV4XHJcbiAgICBkcmFnU3RhcnRJbmRleCA9IC0xXHJcbn1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChpbmRleCkge1xyXG4gICAgZm9ybUVsZW1lbnRzLnVwZGF0ZShlbGVtZW50cyA9PiBlbGVtZW50cy5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KSk7XHJcbiAgfVxyXG5cclxuICBsZXQgYWR2YW5jZWRPcHRpb25zPXRydWVcclxuICBmdW5jdGlvbiBjaGVja0FkdmFuY2VkT3B0aW9ucyhlbGVtZW50LGluZGV4KSB7XHJcbiAgICBpZiAoYWR2YW5jZWRPcHRpb25zKSByZXR1cm4gXCJibG9ja1wiXHJcbiAgICBpZiAoZWxlbWVudC50eXBlPT09XCJhZHZhbmNlZF9vcHRpb25zXCIpIHJldHVybiBcImJsb2NrXCJcclxuICAgIGxldCBhZHZhbmNlZE9wdGlvbnNJbmRleD0tMVxyXG4gICAgZm9yKGxldCBpPTA7aTxmb3JtRWxlbWVudHMubGVuZ3RoO2krKykge1xyXG4gICAgICBsZXQgZT1mb3JtRWxlbWVudHNbaV1cclxuICAgICAgaWYgIChlLnR5cGU9PT1cImFkdmFuY2VkX29wdGlvbnNcIikgYWR2YW5jZWRPcHRpb25zSW5kZXg9aVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhZHZhbmNlZE9wdGlvbnNJbmRleDwwKSB7IC8vIGVsZW1lbnQgZG9lcyBub3QgZXhpc3RzIGFueW1vcmVcclxuICAgICAgYWR2YW5jZWRPcHRpb25zPXRydWVcclxuICAgICAgcmV0dXJuIFwiYmxvY2tcIlxyXG4gICAgfVxyXG4gICAgaWYgKGluZGV4IDxhZHZhbmNlZE9wdGlvbnNJbmRleCkgcmV0dXJuIFwiYmxvY2tcIiAvLyBiZWZvcmUgYWR2YW5jZWQgb3B0aW9uc1xyXG4gICAgcmV0dXJuIFwibm9uZVwiXHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcblxyXG5cclxuPGRpdiBjbGFzcz1cImZvcm1CdWlsZGVyXCI+XHJcbjxoMT5FZGl0IGZvcm08L2gxPlxyXG48ZGl2IGNsYXNzPVwiZm9ybVwiPlxyXG4gIHsjZWFjaCBmb3JtRWxlbWVudHMgYXMgZWxlbWVudCwgaW5kZXggKGVsZW1lbnQubmFtZSl9XHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzPVwiZHJhZ2dhYmxlXCJcclxuICAgICAgZHJhZ2dhYmxlPVwidHJ1ZVwiXHJcbiAgICAgIHN0eWxlPVwiZGlzcGxheTp7Y2hlY2tBZHZhbmNlZE9wdGlvbnMoZWxlbWVudCxpbmRleCl9XCJcclxuICAgICAgb246ZHJhZ3N0YXJ0PXsoKSA9PiBoYW5kbGVEcmFnU3RhcnQoZXZlbnQsIGluZGV4KX1cclxuICAgICAgb246ZHJhZ292ZXI9e2hhbmRsZURyYWdPdmVyfVxyXG4gICAgICBvbjpkcm9wPXsoKSA9PiBoYW5kbGVEcm9wKGV2ZW50LCBpbmRleCl9PlxyXG4gICAgICA8Rm9ybUVsZW1lbnQge2VsZW1lbnR9IGJpbmQ6YWR2YW5jZWRPcHRpb25zPXthZHZhbmNlZE9wdGlvbnN9XHJcbiAgICAgICAgb246cmVkcmF3QWxsPXsoZSkgPT4ge2Zvcm1FbGVtZW50cz1mb3JtRWxlbWVudHN9fVxyXG4gICAgICAgIG9uOnJlbW92ZT17KCkgPT4gcmVtb3ZlRWxlbWVudChpbmRleCl9ICBcclxuICAgICAgICBvbjpvcGVuUHJvcGVydGllcz17KCkgPT4ge3Nob3dQcm9wZXJ0aWVzSWR4PWluZGV4IH19IFxyXG4gICAgICAgIG9uOmNsb3NlUHJvcGVydGllcz17KCkgPT4ge3Nob3dQcm9wZXJ0aWVzSWR4PS0xIH19XHJcbiAgICAgICAgb246dXBkYXRlPXsoZSkgPT4geyBmb3JtRWxlbWVudHNbaW5kZXhdPWUuZGV0YWlsOyBlbnN1cmVVbmlxdWVOYW1lcygpIH19XHJcbiAgICAgICAgb246ZGVsZXRlPXsoZSkgPT4geyBmb3JtRWxlbWVudHMuc3BsaWNlKHNob3dQcm9wZXJ0aWVzSWR4LDEpO2Zvcm1FbGVtZW50cz1mb3JtRWxlbWVudHM7c2hvd1Byb3BlcnRpZXNJZHg9LTEgfX1cclxuICAgICAgICBzaG93UHJvcGVydGllcz17c2hvd1Byb3BlcnRpZXNJZHg9PT1pbmRleH0vPlxyXG4gICAgICA8L2Rpdj5cclxuICB7L2VhY2h9XHJcbjwvZGl2PlxyXG48ZGl2PlxyXG48bGFiZWwgZm9yPVwiYWRkX2ZpZWxkX3NlbGVjdFwiIGNsYXNzPVwiYWRkX2ZpZWxkX3NlbGVjdF9sYWJlbFwiPiBBZGQgZm9ybSBmaWVsZDo8L2xhYmVsPiBcclxuICA8c2VsZWN0IGNsYXNzPVwiYWRkX2ZpZWxkX3NlbGVjdFwiIG5hbWU9XCJhZGRfZmllbGRfc2VsZWN0XCIgYmluZDp2YWx1ZT17c2VsZWN0ZWRUeXBlfT5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJ0ZXh0XCI+VGV4dCBJbnB1dDwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cInRleHRhcmVhXCI+VGV4dGFyZWE8L29wdGlvbj5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJjaGVja2JveFwiPkNoZWNrYm94PC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwiZHJvcGRvd25cIj5Ecm9wZG93bjwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cInByZV9maWxsZWRfZHJvcGRvd25cIj5QcmUtZmlsbGVkIERyb3Bkb3duPC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwic2xpZGVyXCI+U2xpZGVyPC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwibnVtYmVyXCI+TnVtYmVyPC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwibGF5ZXJfaW1hZ2VcIj5MYXllciBJbWFnZTwvb3B0aW9uPlxyXG4gICAgPG9wdGlvbiB2YWx1ZT1cImFkdmFuY2VkX29wdGlvbnNcIj5BZHZhbmNlZCBPcHRpb25zIFN3aXRjaDwvb3B0aW9uPlxyXG4gIDwvc2VsZWN0PlxyXG4gIDxidXR0b24gb246Y2xpY2s9eygpID0+IGFkZEVsZW1lbnQoc2VsZWN0ZWRUeXBlKX0+QWRkPC9idXR0b24+XHJcbjwvZGl2PlxyXG48L2Rpdj5cclxuPHN0eWxlPlxyXG4gIC5mb3JtQnVpbGRlciB7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgd2lkdGg6IDQ3MHB4O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfVxyXG4gIC5mb3JtQnVpbGRlciBoMSB7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gIH1cclxuICAuZHJhZ2dhYmxlIHtcclxuICAgIGN1cnNvcjogZ3JhYjtcclxuICB9XHJcbiAgLmZvcm0ge1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICB3aWR0aDogNDUwcHg7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udDogXCJTZWdvZSBVSVwiLCBSb2JvdG8sIHN5c3RlbS11aTtcclxuICAgIGZvbnQtc2l6ZToxNHB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICB9XHJcbiAgLmZvcm1CdWlsZGVyIC5hZGRfZmllbGRfc2VsZWN0X2xhYmVsIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcbiAgLmZvcm1CdWlsZGVyIC5hZGRfZmllbGRfc2VsZWN0IHtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDsgICBcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgfVxyXG4gICAgLmZvcm1CdWlsZGVyIGJ1dHRvbiB7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIG1pbi13aWR0aDogNzBweDtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogcmdiKDEyOCwgMTI4LCAxMjgpO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrS0UsMENBQWEsQ0FDWCxPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxLQUFLLENBQ1osS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsS0FDWCxDQUNBLDJCQUFZLENBQUMsaUJBQUcsQ0FDZCxTQUFTLENBQUUsSUFBSSxDQUNmLGFBQWEsQ0FBRSxJQUNqQixDQUNBLHdDQUFXLENBQ1QsTUFBTSxDQUFFLElBQ1YsQ0FDQSxtQ0FBTSxDQUNKLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxLQUFLLENBQ1osSUFBSSxDQUFFLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FDbkMsVUFBVSxJQUFJLENBQ2QsYUFBYSxDQUFFLElBQ2pCLENBQ0EsMkJBQVksQ0FBQyxzQ0FBd0IsQ0FDbkMsT0FBTyxDQUFFLFlBQ1gsQ0FDQSwyQkFBWSxDQUFDLGdDQUFrQixDQUN6QixZQUFZLENBQUUsSUFBSSxDQUNsQixnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLEtBQUssQ0FBRSxLQUFLLENBQ1osT0FBTyxDQUFFLEdBQUcsQ0FDWixPQUFPLENBQUUsWUFDZixDQUNFLDJCQUFZLENBQUMscUJBQU8sQ0FDaEIsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksU0FBUyxDQUFFLElBQUksQ0FDZixTQUFTLENBQUUsSUFBSSxDQUNmLEtBQUssQ0FBRSxLQUFLLENBQ1osZ0JBQWdCLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDcEMsWUFBWSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ2hDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsWUFBWSxDQUFFLElBQ2xCIn0= */");
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (126:2) {#each formElements as element, index (element.name)}
    function create_each_block$4(key_1, ctx) {
    	let div;
    	let formelement;
    	let updating_advancedOptions;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	function formelement_advancedOptions_binding(value) {
    		/*formelement_advancedOptions_binding*/ ctx[12](value);
    	}

    	function remove_handler() {
    		return /*remove_handler*/ ctx[14](/*index*/ ctx[27]);
    	}

    	function openProperties_handler() {
    		return /*openProperties_handler*/ ctx[15](/*index*/ ctx[27]);
    	}

    	function update_handler(...args) {
    		return /*update_handler*/ ctx[17](/*index*/ ctx[27], ...args);
    	}

    	let formelement_props = {
    		element: /*element*/ ctx[25],
    		showProperties: /*showPropertiesIdx*/ ctx[1] === /*index*/ ctx[27]
    	};

    	if (/*advancedOptions*/ ctx[3] !== void 0) {
    		formelement_props.advancedOptions = /*advancedOptions*/ ctx[3];
    	}

    	formelement = new FormElement({ props: formelement_props, $$inline: true });
    	binding_callbacks.push(() => bind(formelement, 'advancedOptions', formelement_advancedOptions_binding));
    	formelement.$on("redrawAll", /*redrawAll_handler*/ ctx[13]);
    	formelement.$on("remove", remove_handler);
    	formelement.$on("openProperties", openProperties_handler);
    	formelement.$on("closeProperties", /*closeProperties_handler*/ ctx[16]);
    	formelement.$on("update", update_handler);
    	formelement.$on("delete", /*delete_handler*/ ctx[18]);

    	function dragstart_handler() {
    		return /*dragstart_handler*/ ctx[19](/*index*/ ctx[27]);
    	}

    	function drop_handler() {
    		return /*drop_handler*/ ctx[20](/*index*/ ctx[27]);
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
    			set_style(div, "display", /*checkAdvancedOptions*/ ctx[10](/*element*/ ctx[25], /*index*/ ctx[27]));
    			add_location(div, file$5, 126, 4, 4030);
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
    					listen_dev(div, "dragover", /*handleDragOver*/ ctx[7], false, false, false, false),
    					listen_dev(div, "drop", drop_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formelement_changes = {};
    			if (dirty & /*formElements*/ 1) formelement_changes.element = /*element*/ ctx[25];
    			if (dirty & /*showPropertiesIdx, formElements*/ 3) formelement_changes.showProperties = /*showPropertiesIdx*/ ctx[1] === /*index*/ ctx[27];

    			if (!updating_advancedOptions && dirty & /*advancedOptions*/ 8) {
    				updating_advancedOptions = true;
    				formelement_changes.advancedOptions = /*advancedOptions*/ ctx[3];
    				add_flush_callback(() => updating_advancedOptions = false);
    			}

    			formelement.$set(formelement_changes);

    			if (!current || dirty & /*formElements*/ 1) {
    				set_style(div, "display", /*checkAdvancedOptions*/ ctx[10](/*element*/ ctx[25], /*index*/ ctx[27]));
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
    		source: "(126:2) {#each formElements as element, index (element.name)}",
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
    	let each_value = /*formElements*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*element*/ ctx[25].name;
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
    			add_location(h1, file$5, 123, 0, 3929);
    			attr_dev(div0, "class", "form svelte-1yl6ahv");
    			add_location(div0, file$5, 124, 0, 3949);
    			attr_dev(label, "for", "add_field_select");
    			attr_dev(label, "class", "add_field_select_label svelte-1yl6ahv");
    			add_location(label, file$5, 145, 0, 4886);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$5, 147, 4, 5065);
    			option1.__value = "text";
    			option1.value = option1.__value;
    			add_location(option1, file$5, 148, 4, 5106);
    			option2.__value = "textarea";
    			option2.value = option2.__value;
    			add_location(option2, file$5, 149, 4, 5152);
    			option3.__value = "checkbox";
    			option3.value = option3.__value;
    			add_location(option3, file$5, 150, 4, 5200);
    			option4.__value = "dropdown";
    			option4.value = option4.__value;
    			add_location(option4, file$5, 151, 4, 5248);
    			option5.__value = "pre_filled_dropdown";
    			option5.value = option5.__value;
    			add_location(option5, file$5, 152, 4, 5296);
    			option6.__value = "slider";
    			option6.value = option6.__value;
    			add_location(option6, file$5, 153, 4, 5366);
    			option7.__value = "number";
    			option7.value = option7.__value;
    			add_location(option7, file$5, 154, 4, 5410);
    			option8.__value = "layer_image";
    			option8.value = option8.__value;
    			add_location(option8, file$5, 155, 4, 5454);
    			option9.__value = "advanced_options";
    			option9.value = option9.__value;
    			add_location(option9, file$5, 156, 4, 5508);
    			attr_dev(select, "class", "add_field_select svelte-1yl6ahv");
    			attr_dev(select, "name", "add_field_select");
    			if (/*selectedType*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[21].call(select));
    			add_location(select, file$5, 146, 2, 4976);
    			attr_dev(button, "class", "svelte-1yl6ahv");
    			add_location(button, file$5, 158, 2, 5590);
    			add_location(div1, file$5, 144, 0, 4879);
    			attr_dev(div2, "class", "formBuilder svelte-1yl6ahv");
    			add_location(div2, file$5, 122, 0, 3902);
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
    			select_option(select, /*selectedType*/ ctx[2], true);
    			append_dev(div1, t15);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[21]),
    					listen_dev(button, "click", /*click_handler*/ ctx[22], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*checkAdvancedOptions, formElements, handleDragStart, event, handleDragOver, handleDrop, showPropertiesIdx, advancedOptions, removeElement, ensureUniqueNames*/ 2011) {
    				each_value = /*formElements*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
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
    	component_subscribe($$self, metadata, $$value => $$invalidate(24, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormBuilder', slots, []);
    	if (!$metadata.forms) set_store_value(metadata, $metadata.forms = {}, $metadata);
    	let { form_key = 'default' } = $$props; // support for multiple forms (e.g. wizards) in the future
    	if (!$metadata.forms[form_key]) set_store_value(metadata, $metadata.forms[form_key] = { elements: [] }, $metadata);
    	if (!$metadata.forms[form_key].elements) set_store_value(metadata, $metadata.forms[form_key].elements = [], $metadata);
    	let formElements = $metadata.forms[form_key].elements;
    	ensureUniqueNames();
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
    		$$invalidate(0, formElements);
    		$$invalidate(1, showPropertiesIdx = formElements.length - 1);
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
    		$$invalidate(0, formElements = reorderedItems);

    		$$invalidate(0, formElements);

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
    			$$invalidate(3, advancedOptions = true);

    			return "block";
    		}

    		if (index < advancedOptionsIndex) return "block"; // before advanced options
    		return "none";
    	}

    	const writable_props = ['form_key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormBuilder> was created with unknown prop '${key}'`);
    	});

    	function formelement_advancedOptions_binding(value) {
    		advancedOptions = value;
    		$$invalidate(3, advancedOptions);
    	}

    	const redrawAll_handler = e => {
    		$$invalidate(0, formElements);
    	};

    	const remove_handler = index => removeElement(index);

    	const openProperties_handler = index => {
    		$$invalidate(1, showPropertiesIdx = index);
    	};

    	const closeProperties_handler = () => {
    		$$invalidate(1, showPropertiesIdx = -1);
    	};

    	const update_handler = (index, e) => {
    		$$invalidate(0, formElements[index] = e.detail, formElements);
    		ensureUniqueNames();
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
    		if ('form_key' in $$props) $$invalidate(11, form_key = $$props.form_key);
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
    		ensureUniqueNames,
    		addElement,
    		handleDragStart,
    		handleDragOver,
    		handleDrop,
    		removeElement,
    		advancedOptions,
    		checkAdvancedOptions,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('form_key' in $$props) $$invalidate(11, form_key = $$props.form_key);
    		if ('formElements' in $$props) $$invalidate(0, formElements = $$props.formElements);
    		if ('dragStartIndex' in $$props) dragStartIndex = $$props.dragStartIndex;
    		if ('showPropertiesIdx' in $$props) $$invalidate(1, showPropertiesIdx = $$props.showPropertiesIdx);
    		if ('selectedType' in $$props) $$invalidate(2, selectedType = $$props.selectedType);
    		if ('advancedOptions' in $$props) $$invalidate(3, advancedOptions = $$props.advancedOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
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
    		form_key,
    		formelement_advancedOptions_binding,
    		redrawAll_handler,
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { form_key: 11 }, add_css$6);

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
    function create_if_block_1$2(ctx) {
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(75:4) {#if name===\\\"removeFromList\\\"}",
    		ctx
    	});

    	return block;
    }

    // (78:4) {#if name==="comboList"}
    function create_if_block$3(ctx) {
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
    		id: create_if_block$3.name,
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
    	let if_block11 = /*name*/ ctx[0] === "removeFromList" && create_if_block_1$2(ctx);
    	let if_block12 = /*name*/ ctx[0] === "comboList" && create_if_block$3(ctx);

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
    					if_block11 = create_if_block_1$2(ctx);
    					if_block11.c();
    					if_block11.m(div, t11);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}

    			if (/*name*/ ctx[0] === "comboList") {
    				if (if_block12) ; else {
    					if_block12 = create_if_block$3(ctx);
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
    function create_if_block$2(ctx) {
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
    		id: create_if_block$2.name,
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
    	let if_block = /*showBox*/ ctx[1] && create_if_block$2(ctx);

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
    					if_block = create_if_block$2(ctx);
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

    /* src\Mappings.svelte generated by Svelte v3.59.2 */

    const { console: console_1$2 } = globals;
    const file$2 = "src\\Mappings.svelte";

    function add_css$3(target) {
    	append_styles(target, "svelte-mlofvx", "#gyre_mappings.svelte-mlofvx .mapping.svelte-mlofvx{border:1px solid white;margin-top:10px;padding:5px;position:relative}#gyre_mappings.svelte-mlofvx .mapping .del.svelte-mlofvx{position:absolute;right:10px;top:2px}#gyre_mappings.svelte-mlofvx button.svelte-mlofvx{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}#gyre_mappings.svelte-mlofvx.svelte-mlofvx{z-index:200;position:fixed;left:10px;top:10px;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:20px;backdrop-filter:blur(20px) brightness(80%);box-shadow:0 0 1rem 0 rgba(255, 255, 255, 0.2);color:white;width:540px;display:block;border-radius:10px;font-size:14px}#gyre_mappings.svelte-mlofvx.svelte-mlofvx{display:none;width:480px;left:200px;top:200px}#gyre_mappings.svelte-mlofvx select.svelte-mlofvx{background-color:grey;font-size:14px;color:white;border:none;margin-top:10px;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}#gyre_mappings.svelte-mlofvx select.svelte-mlofvx{background:transparent;border:1px solid white;border-radius:5px}#gyre_mappings.svelte-mlofvx select option.svelte-mlofvx,#gyre_mappings.svelte-mlofvx select optgroup.svelte-mlofvx{background:black}#gyre_mappings.svelte-mlofvx h1.svelte-mlofvx{font-size:16px;margin-top:5px;margin-bottom:30px}#gyre_mappings.svelte-mlofvx .close.svelte-mlofvx{position:absolute;right:20px;top:20px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwcGluZ3Muc3ZlbHRlIiwic291cmNlcyI6WyJNYXBwaW5ncy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IG1ldGFkYXRhfSBmcm9tICcuL3N0b3Jlcy9tZXRhZGF0YSdcclxuICAgIGltcG9ydCBJY29uIGZyb20gJy4vSWNvbi5zdmVsdGUnXHJcblxyXG4gXHJcbiAgICBsZXQgc2hvd0d5cmVNYXBwaW5ncz1cIm5vbmVcIlxyXG4gICAgbGV0IGd5cmVNYXBwaW5nc0RpYWxvZ0xlZnQ9XCIxMDBweFwiXHJcbiAgICBsZXQgZ3lyZU1hcHBpbmdzRGlhbG9nVG9wPVwiMTAwcHhcIlxyXG4gICAgbGV0IHdpZGdldHM9W11cclxuICAgIGxldCBub2RlVHlwZT1cIlwiXHJcbiAgICBsZXQgbWFwcGluZ0ZpZWxkcz1nZXRNYXBwaW5nRmllbGRzKClcclxuICAgIGxldCBub2RlSWQ9MFxyXG4gICAgZnVuY3Rpb24gb3Blbkd5cmVNYXBwaW5ncyhub2RlLGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9wZW5HeXJlTWFwcGluZ3NcIixub2RlKVxyXG4gICAgICAgIG1hcHBpbmdGaWVsZHM9Z2V0TWFwcGluZ0ZpZWxkcygpXHJcbiAgICAgICAgc2hvd0d5cmVNYXBwaW5ncz1cImJsb2NrXCJcclxuICAgICAgICBub2RlSWQ9bm9kZS5pZFxyXG4gICAgICAgIGNvbnNvbGUubG9nKG5vZGUpXHJcbiAgICAgICAgZ3lyZU1hcHBpbmdzRGlhbG9nTGVmdD1lLmNsaWVudFgtMTAwK1wicHhcIlxyXG4gICAgICAgIGd5cmVNYXBwaW5nc0RpYWxvZ1RvcD1lLmNsaWVudFktMjAwK1wicHhcIlxyXG4gICAgICAgIHdpZGdldHM9bm9kZS53aWRnZXRzXHJcbiAgICAgICAgbm9kZVR5cGU9bm9kZS50eXBlXHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEubWFwcGluZ3MpICRtZXRhZGF0YS5tYXBwaW5ncz17fVxyXG4gICAgICAgIG1hcHBpbmdzPSRtZXRhZGF0YS5tYXBwaW5nc1tub2RlSWRdXHJcbiAgICAgICAgaWYgKCFtYXBwaW5ncykgbWFwcGluZ3M9W11cclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cub3Blbkd5cmVNYXBwaW5ncz1vcGVuR3lyZU1hcHBpbmdzICAgIC8vIGV4cG9zZSBvcGVuIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBDb21meVVJIG1lbnUgZXh0ZW5zaW9uXHJcblxyXG4gICAgLy8gY2hlY2sgb2YgYSB3aWRnZXQgKD1hIG5vZGUgcHJvcGVydHkpIGlzIGNvbm5lY3RlZCB0byBhIGZvcm0gZmllbGRcclxuICAgIGZ1bmN0aW9uIGNoZWNrR3lyZU1hcHBpbmcobm9kZSx3aWRnZXQpIHtcclxuICAgICAgICBpZiAgKCEkbWV0YWRhdGEubWFwcGluZ3MpIHJldHVyblxyXG4gICAgICAgIGlmICghJG1ldGFkYXRhLm1hcHBpbmdzW25vZGUuaWRdKSByZXR1cm5cclxuICAgICAgICBmb3IobGV0IGk9MDtpPCRtZXRhZGF0YS5tYXBwaW5nc1tub2RlLmlkXS5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBtYXBwaW5nPSRtZXRhZGF0YS5tYXBwaW5nc1tub2RlLmlkXVtpXVxyXG4gICAgICAgICAgICBpZiAobWFwcGluZy50b0ZpZWxkPT09d2lkZ2V0Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsYWJlbD0od2lkZ2V0LmxhYmVsIHx8IHdpZGdldC5uYW1lKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsK1wiPVwiK21hcHBpbmcuZnJvbUZpZWxkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aW5kb3cuY2hlY2tHeXJlTWFwcGluZz1jaGVja0d5cmVNYXBwaW5nXHJcblxyXG4gICAgZnVuY3Rpb24gc2V0Q29tYm9WYWx1ZSh3aWRnZXQpIHtcclxuICAgICAgICBpZiAod2lkZ2V0LnR5cGUhPT1cImNvbWJvXCIgfHwgIXdpZGdldC5vcHRpb25zICB8fCAhd2lkZ2V0Lm9wdGlvbnMudmFsdWVzIHx8ICF3aWRnZXQubmFtZSApIHJldHVyblxyXG4gICAgICAgIGlmKCEkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSAkbWV0YWRhdGEuY29tYm9fdmFsdWVzID0ge307XHJcbiAgICAgICAgJG1ldGFkYXRhLmNvbWJvX3ZhbHVlc1t3aWRnZXQubmFtZV09d2lkZ2V0Lm9wdGlvbnMudmFsdWVzIC8vd2lkZ2V0Lm9wdGlvbnNcclxuICAgIH1cclxuICAgIHdpbmRvdy5neXJlU2V0Q29tYm92YWx1ZXM9c2V0Q29tYm9WYWx1ZVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjbG9zZURpYWxvZygpIHtcclxuICAgICAgICBzaG93R3lyZU1hcHBpbmdzPVwibm9uZVwiXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldCBsaXN0IG9mIGZpZWxkcyB3aGljaCBjYW4gYmUgdXNlZCBmb3Igd2lkZ2V0IG1hcHBpbmdzIG9mIGVhY2ggQ29tZnlVSSBub2RlOlxyXG4gICAgICogZmllbGRzOiB0aGUgZm9ybSBmaWVsZHMsIGRlZmluZWQgYnkgdXNlclxyXG4gICAgICogZGVmYXVsdEZpZWxkczogdGhlIGZpZWxkcyB3aG9jaCBhcmUgdXN1YWxseSBhdmFpbGFibGUgXHJcbiAgICAgKiBvdXRwdXRGaWVsZHM6IHRoZSBvdXRwdXQgZmllbGRzLCBsaWtlIGFuIGltYWdlIG9yIG11bHRpcGxlIGltYWdlc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0TWFwcGluZ0ZpZWxkcygpIHtcclxuICAgICAgICBsZXQgZmllbGRzPSBbXVxyXG4gICAgICAgIGlmICgkbWV0YWRhdGEuZm9ybXMgJiYgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQgJiYgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQuZWxlbWVudHMpIGZpZWxkcz0kbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50c1xyXG4gICAgICAgIGxldCBkZWZhdWx0RmllbGRzPVt7bmFtZTpcIm1lcmdlZEltYWdlXCIsbm90SW5SdWxlRWRpdG9yOnRydWV9LHtuYW1lOlwibWFza1wiLG5vdEluUnVsZUVkaXRvcjp0cnVlfSx7bmFtZTpcImhhc01hc2tcIn0se25hbWU6XCJwcm9tcHRcIn0se25hbWU6XCJuZWdhdGl2ZVByb21wdFwifSx7bmFtZTpcImNvbnRyb2xuZXRbXS50eXBlXCJ9LHtuYW1lOlwiY29udHJvbG5ldFtdLmltYWdlXCIsbm90SW5SdWxlRWRpdG9yOnRydWV9LHtuYW1lOlwiY29udHJvbG5ldFtdLnN0cmVuZ3RoXCJ9LHtuYW1lOlwiY29udHJvbG5ldFtdLnN0YXJ0X3BlcmNlbnRcIn0se25hbWU6XCJjb250cm9sbmV0W10uZW5kX3BlcmNlbnRcIn0se25hbWU6XCJjb250cm9sbmV0W10ubW9kZWxcIn1dXHJcbiAgICAgICAgbGV0IG91dHB1dEZpZWxkcz1be25hbWU6XCJyZXN1bHRJbWFnZVwifV1cclxuICAgICAgICBsZXQgcmVzPSB7ZmllbGRzLGRlZmF1bHRGaWVsZHMsb3V0cHV0RmllbGRzfVxyXG4gICAgICAgIHJldHVybiByZXNcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbWFwcGluZ3MgPSBbXVxyXG4gICAgbGV0IGZyb21GaWVsZD1cIlwiXHJcbiAgICBsZXQgdG9GaWVsZD1cIlwiXHJcbiAgICBmdW5jdGlvbiBhZGRNYXBwaW5nKCkge1xyXG4gICAgICAgIGlmICghdG9GaWVsZCB8fCAhZnJvbUZpZWxkKSByZXR1cm5cclxuICAgICAgICBpZiAoIW5vZGVJZCkgcmV0dXJuXHJcbiAgICAgICAgbWFwcGluZ3MucHVzaCh7IGZyb21GaWVsZCx0b0ZpZWxkICB9KVxyXG4gICAgICAgIG1hcHBpbmdzPW1hcHBpbmdzXHJcbiAgICAgICAgJG1ldGFkYXRhLm1hcHBpbmdzW25vZGVJZF0gPSBtYXBwaW5nc1xyXG4gICAgICAgIGZyb21GaWVsZD10b0ZpZWxkPVwiXCJcclxuICAgIH0gICAgXHJcbiAgICBmdW5jdGlvbiBkZWxldGVNYXBwaW5nKGluZGV4KSB7XHJcbiAgICAgICAgbWFwcGluZ3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICBtYXBwaW5ncz1tYXBwaW5nc1xyXG4gICAgICAgICRtZXRhZGF0YS5tYXBwaW5nc1tub2RlSWRdID0gbWFwcGluZ3NcclxuICAgIH1cclxuICAgICAgXHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdiBpZD1cImd5cmVfbWFwcGluZ3NcIiBzdHlsZT1cImRpc3BsYXk6e3Nob3dHeXJlTWFwcGluZ3N9O2xlZnQ6e2d5cmVNYXBwaW5nc0RpYWxvZ0xlZnR9O3RvcDp7Z3lyZU1hcHBpbmdzRGlhbG9nVG9wfVwiID5cclxuICAgIDxoMT5GaWVsZCBNYXBwaW5nczwvaDE+XHJcbiAgICAgICAgPGRpdj57bm9kZVR5cGV9PC9kaXY+XHJcblxyXG4gICAgICAgIDxzZWxlY3QgIGJpbmQ6dmFsdWU9e2Zyb21GaWVsZH0+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiRm9ybSBmaWVsZHNcIj5cclxuICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5maWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkRlZmF1bHRzXCI+XHJcbiAgICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5kZWZhdWx0RmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICA8L29wdGdyb3VwPiAgICAgXHJcbiAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIk91dHB1dHNcIj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCBtYXBwaW5nRmllbGRzLm91dHB1dEZpZWxkcyBhcyBmaWVsZH1cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtmaWVsZC5uYW1lfT57ZmllbGQubmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgPC9vcHRncm91cD4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJhcnJvd1JpZ2h0XCI+PC9JY29uPlxyXG4gICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17dG9GaWVsZH0gPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0Li4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsjZWFjaCB3aWRnZXRzIGFzIHdpZGdldH1cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3dpZGdldC5uYW1lfT57d2lkZ2V0Lm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4ge2FkZE1hcHBpbmcoKX19PisgQWRkPC9idXR0b24+ICAgICBcclxuICAgICAgICB7I2VhY2ggbWFwcGluZ3MgYXMgbWFwcGluZywgaW5kZXh9XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYXBwaW5nXCI+XHJcbiAgICAgICAgICAgICAgICB7bWFwcGluZy5mcm9tRmllbGR9IDxJY29uIG5hbWU9XCJhcnJvd1JpZ2h0XCI+PC9JY29uPnttYXBwaW5nLnRvRmllbGR9XHJcbiAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlbFwiIG9uOmNsaWNrPXsoZSkgPT4ge2RlbGV0ZU1hcHBpbmcoKX19PjxJY29uIG5hbWU9XCJyZW1vdmVGcm9tTGlzdFwiPjwvSWNvbj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgey9lYWNofVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbG9zZVwiPjxJY29uIG5hbWU9XCJjbG9zZVwiIG9uOmNsaWNrPXsoZSk9PntjbG9zZURpYWxvZygpfX0+PC9JY29uPjwvZGl2PlxyXG48L2Rpdj5cclxuXHJcbjxzdHlsZT5cclxuXHJcblxyXG4jZ3lyZV9tYXBwaW5ncyAubWFwcGluZyB7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB3aGl0ZTtcclxuICAgIG1hcmdpbi10b3A6MTBweDtcclxuICAgIHBhZGRpbmc6NXB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcbiNneXJlX21hcHBpbmdzIC5tYXBwaW5nIC5kZWwge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6MTBweDtcclxuICAgIHRvcDogMnB4O1xyXG59XHJcblxyXG5cclxuXHJcbiNneXJlX21hcHBpbmdzIGJ1dHRvbiB7XHJcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgbWluLXdpZHRoOiA3MHB4O1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9XHJcbiNneXJlX21hcHBpbmdzIHtcclxuICAgIHotaW5kZXg6IDIwMDtcclxuICAgIHBvc2l0aW9uOiBmaXhlZDtcclxuICAgIGxlZnQ6IDEwcHg7XHJcbiAgICB0b3A6IDEwcHg7XHJcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgIHBhZGRpbmc6IDIwcHg7XHJcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMjBweCkgYnJpZ2h0bmVzcyg4MCUpO1xyXG4gICAgYm94LXNoYWRvdzogMCAwIDFyZW0gMCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB3aWR0aDogNTQwcHg7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3Mge1xyXG4gICAgZGlzcGxheTpub25lO1xyXG4gICAgd2lkdGg6NDgwcHg7XHJcbiAgICBsZWZ0OjIwMHB4O1xyXG4gICAgdG9wOjIwMHB4O1xyXG59XHJcbiNneXJlX21hcHBpbmdzIHNlbGVjdCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiBub25lO1xyXG4gICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgcGFkZGluZzogM3B4O1xyXG59XHJcbiNneXJlX21hcHBpbmdzIHNlbGVjdCB7XHJcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG59XHJcbiNneXJlX21hcHBpbmdzIHNlbGVjdCBvcHRpb24sI2d5cmVfbWFwcGluZ3Mgc2VsZWN0IG9wdGdyb3VwIHtcclxuICAgIGJhY2tncm91bmQ6IGJsYWNrO1xyXG59XHJcbiNneXJlX21hcHBpbmdzIGgxIHtcclxuICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgIG1hcmdpbi10b3A6IDVweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3MgLmNsb3NlIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAyMHB4O1xyXG4gICAgdG9wOjIwcHg7XHJcbn1cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUlBLDRCQUFjLENBQUMsc0JBQVMsQ0FDcEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUN2QixXQUFXLElBQUksQ0FDZixRQUFRLEdBQUcsQ0FDWCxRQUFRLENBQUUsUUFDZCxDQUNBLDRCQUFjLENBQUMsUUFBUSxDQUFDLGtCQUFLLENBQ3pCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE1BQU0sSUFBSSxDQUNWLEdBQUcsQ0FBRSxHQUNULENBSUEsNEJBQWMsQ0FBQyxvQkFBTyxDQUNsQixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUMvSCxTQUFTLENBQUUsSUFBSSxDQUNmLFNBQVMsQ0FBRSxJQUFJLENBQ2YsS0FBSyxDQUFFLEtBQUssQ0FDWixnQkFBZ0IsQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxZQUFZLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDaEMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsTUFBTSxDQUFFLE9BQU8sQ0FDZixZQUFZLENBQUUsSUFDbEIsQ0FDSiwwQ0FBZSxDQUNYLE9BQU8sQ0FBRSxHQUFHLENBQ1osUUFBUSxDQUFFLEtBQUssQ0FDZixJQUFJLENBQUUsSUFBSSxDQUNWLEdBQUcsQ0FBRSxJQUFJLENBQ1QsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksT0FBTyxDQUFFLElBQUksQ0FDYixlQUFlLENBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUMzQyxVQUFVLENBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQy9DLEtBQUssQ0FBRSxLQUFLLENBQ1osS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsS0FBSyxDQUNkLGFBQWEsQ0FBRSxJQUFJLENBQ25CLFNBQVMsQ0FBRSxJQUNmLENBQ0EsMENBQWUsQ0FDWCxRQUFRLElBQUksQ0FDWixNQUFNLEtBQUssQ0FDWCxLQUFLLEtBQUssQ0FDVixJQUFJLEtBQ1IsQ0FDQSw0QkFBYyxDQUFDLG9CQUFPLENBQ2xCLGdCQUFnQixDQUFFLElBQUksQ0FDdEIsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsS0FBSyxDQUNaLE1BQU0sQ0FBRSxJQUFJLENBQ1osVUFBVSxDQUFFLElBQUksQ0FDaEIsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksT0FBTyxDQUFFLEdBQ2IsQ0FDQSw0QkFBYyxDQUFDLG9CQUFPLENBQ2xCLFVBQVUsQ0FBRSxXQUFXLENBQ3ZCLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FDdkIsYUFBYSxDQUFFLEdBQ25CLENBQ0EsNEJBQWMsQ0FBQyxNQUFNLENBQUMsb0JBQU0sQ0FBQyw0QkFBYyxDQUFDLE1BQU0sQ0FBQyxzQkFBUyxDQUN4RCxVQUFVLENBQUUsS0FDaEIsQ0FDQSw0QkFBYyxDQUFDLGdCQUFHLENBQ2QsU0FBUyxDQUFFLElBQUksQ0FDZixVQUFVLENBQUUsR0FBRyxDQUNmLGFBQWEsQ0FBRSxJQUNuQixDQUNBLDRCQUFjLENBQUMsb0JBQU8sQ0FDbEIsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxJQUFJLElBQ1IifQ== */");
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    // (96:14) {#each mappingFields.fields as field}
    function create_each_block_4$2(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[29].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[29].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$2, 96, 20, 3834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 32 && t_value !== (t_value = /*field*/ ctx[29].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 32 && option_value_value !== (option_value_value = /*field*/ ctx[29].name)) {
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
    		source: "(96:14) {#each mappingFields.fields as field}",
    		ctx
    	});

    	return block;
    }

    // (101:16) {#each mappingFields.defaultFields as field}
    function create_each_block_3$2(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[29].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[29].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$2, 101, 20, 4054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 32 && t_value !== (t_value = /*field*/ ctx[29].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 32 && option_value_value !== (option_value_value = /*field*/ ctx[29].name)) {
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
    		id: create_each_block_3$2.name,
    		type: "each",
    		source: "(101:16) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (106:16) {#each mappingFields.outputFields as field}
    function create_each_block_2$2(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[29].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*field*/ ctx[29].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$2, 106, 20, 4280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 32 && t_value !== (t_value = /*field*/ ctx[29].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 32 && option_value_value !== (option_value_value = /*field*/ ctx[29].name)) {
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
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(106:16) {#each mappingFields.outputFields as field}",
    		ctx
    	});

    	return block;
    }

    // (114:12) {#each widgets as widget}
    function create_each_block_1$2(ctx) {
    	let option;
    	let t_value = /*widget*/ ctx[26].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget*/ ctx[26].name;
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-mlofvx");
    			add_location(option, file$2, 114, 16, 4604);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*widgets*/ 8 && t_value !== (t_value = /*widget*/ ctx[26].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*widgets*/ 8 && option_value_value !== (option_value_value = /*widget*/ ctx[26].name)) {
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
    		source: "(114:12) {#each widgets as widget}",
    		ctx
    	});

    	return block;
    }

    // (119:8) {#each mappings as mapping, index}
    function create_each_block$2(ctx) {
    	let div1;
    	let t0_value = /*mapping*/ ctx[23].fromField + "";
    	let t0;
    	let t1;
    	let icon0;
    	let t2_value = /*mapping*/ ctx[23].toField + "";
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
    			add_location(div0, file$2, 122, 16, 5021);
    			attr_dev(div1, "class", "mapping svelte-mlofvx");
    			add_location(div1, file$2, 119, 12, 4822);
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
    				dispose = listen_dev(div0, "click", /*click_handler_1*/ ctx[16], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*mappings*/ 64) && t0_value !== (t0_value = /*mapping*/ ctx[23].fromField + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*mappings*/ 64) && t2_value !== (t2_value = /*mapping*/ ctx[23].toField + "")) set_data_dev(t2, t2_value);
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(119:8) {#each mappings as mapping, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
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
    	let button;
    	let t10;
    	let t11;
    	let div1;
    	let icon1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*mappingFields*/ ctx[5].fields;
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4$2(get_each_context_4$2(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*mappingFields*/ ctx[5].defaultFields;
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3$2(get_each_context_3$2(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*mappingFields*/ ctx[5].outputFields;
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	icon0 = new Icon({
    			props: { name: "arrowRight" },
    			$$inline: true
    		});

    	let each_value_1 = /*widgets*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*mappings*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	icon1 = new Icon({ props: { name: "close" }, $$inline: true });
    	icon1.$on("click", /*click_handler_2*/ ctx[17]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Field Mappings";
    			t1 = space();
    			div0 = element("div");
    			t2 = text(/*nodeType*/ ctx[4]);
    			t3 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Select...";
    			optgroup0 = element("optgroup");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			optgroup1 = element("optgroup");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			optgroup2 = element("optgroup");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t5 = space();
    			create_component(icon0.$$.fragment);
    			t6 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Select...";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t8 = space();
    			button = element("button");
    			button.textContent = "+ Add";
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			div1 = element("div");
    			create_component(icon1.$$.fragment);
    			attr_dev(h1, "class", "svelte-mlofvx");
    			add_location(h1, file$2, 89, 4, 3568);
    			add_location(div0, file$2, 90, 8, 3601);
    			option0.__value = "";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-mlofvx");
    			add_location(option0, file$2, 93, 12, 3680);
    			attr_dev(optgroup0, "label", "Form fields");
    			attr_dev(optgroup0, "class", "svelte-mlofvx");
    			add_location(optgroup0, file$2, 94, 12, 3729);
    			attr_dev(optgroup1, "label", "Defaults");
    			attr_dev(optgroup1, "class", "svelte-mlofvx");
    			add_location(optgroup1, file$2, 99, 9, 3943);
    			attr_dev(optgroup2, "label", "Outputs");
    			attr_dev(optgroup2, "class", "svelte-mlofvx");
    			add_location(optgroup2, file$2, 104, 12, 4171);
    			attr_dev(select0, "class", "svelte-mlofvx");
    			if (/*fromField*/ ctx[7] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[13].call(select0));
    			add_location(select0, file$2, 92, 8, 3634);
    			option1.__value = "";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-mlofvx");
    			add_location(option1, file$2, 112, 12, 4512);
    			attr_dev(select1, "class", "svelte-mlofvx");
    			if (/*toField*/ ctx[8] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[14].call(select1));
    			add_location(select1, file$2, 111, 8, 4468);
    			attr_dev(button, "class", "svelte-mlofvx");
    			add_location(button, file$2, 117, 8, 4704);
    			attr_dev(div1, "class", "close svelte-mlofvx");
    			add_location(div1, file$2, 125, 8, 5162);
    			attr_dev(div2, "id", "gyre_mappings");
    			set_style(div2, "display", /*showGyreMappings*/ ctx[0]);
    			set_style(div2, "left", /*gyreMappingsDialogLeft*/ ctx[1]);
    			set_style(div2, "top", /*gyreMappingsDialogTop*/ ctx[2]);
    			attr_dev(div2, "class", "svelte-mlofvx");
    			add_location(div2, file$2, 88, 0, 3444);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, select0);
    			append_dev(select0, option0);
    			append_dev(select0, optgroup0);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				if (each_blocks_4[i]) {
    					each_blocks_4[i].m(optgroup0, null);
    				}
    			}

    			append_dev(select0, optgroup1);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(optgroup1, null);
    				}
    			}

    			append_dev(select0, optgroup2);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(optgroup2, null);
    				}
    			}

    			select_option(select0, /*fromField*/ ctx[7], true);
    			append_dev(div2, t5);
    			mount_component(icon0, div2, null);
    			append_dev(div2, t6);
    			append_dev(div2, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(select1, null);
    				}
    			}

    			select_option(select1, /*toField*/ ctx[8], true);
    			append_dev(div2, t8);
    			append_dev(div2, button);
    			append_dev(div2, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}

    			append_dev(div2, t11);
    			append_dev(div2, div1);
    			mount_component(icon1, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[13]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[14]),
    					listen_dev(button, "click", /*click_handler*/ ctx[15], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*nodeType*/ 16) set_data_dev(t2, /*nodeType*/ ctx[4]);

    			if (dirty[0] & /*mappingFields*/ 32) {
    				each_value_4 = /*mappingFields*/ ctx[5].fields;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$2(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_4$2(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_4.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 32) {
    				each_value_3 = /*mappingFields*/ ctx[5].defaultFields;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$2(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3$2(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 32) {
    				each_value_2 = /*mappingFields*/ ctx[5].outputFields;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(optgroup2, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*fromField, mappingFields*/ 160) {
    				select_option(select0, /*fromField*/ ctx[7]);
    			}

    			if (dirty[0] & /*widgets*/ 8) {
    				each_value_1 = /*widgets*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*toField, widgets*/ 264) {
    				select_option(select1, /*toField*/ ctx[8]);
    			}

    			if (dirty[0] & /*deleteMapping, mappings*/ 2112) {
    				each_value = /*mappings*/ ctx[6];
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
    						each_blocks[i].m(div2, t11);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*showGyreMappings*/ 1) {
    				set_style(div2, "display", /*showGyreMappings*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*gyreMappingsDialogLeft*/ 2) {
    				set_style(div2, "left", /*gyreMappingsDialogLeft*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*gyreMappingsDialogTop*/ 4) {
    				set_style(div2, "top", /*gyreMappingsDialogTop*/ ctx[2]);
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
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_component(icon0);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
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
    	component_subscribe($$self, metadata, $$value => $$invalidate(19, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mappings', slots, []);
    	let showGyreMappings = "none";
    	let gyreMappingsDialogLeft = "100px";
    	let gyreMappingsDialogTop = "100px";
    	let widgets = [];
    	let nodeType = "";
    	let mappingFields = getMappingFields();
    	let nodeId = 0;

    	function openGyreMappings(node, e) {
    		console.log("openGyreMappings", node);
    		$$invalidate(5, mappingFields = getMappingFields());
    		$$invalidate(0, showGyreMappings = "block");
    		nodeId = node.id;
    		console.log(node);
    		$$invalidate(1, gyreMappingsDialogLeft = e.clientX - 100 + "px");
    		$$invalidate(2, gyreMappingsDialogTop = e.clientY - 200 + "px");
    		$$invalidate(3, widgets = node.widgets);
    		$$invalidate(4, nodeType = node.type);
    		if (!$metadata.mappings) set_store_value(metadata, $metadata.mappings = {}, $metadata);
    		$$invalidate(6, mappings = $metadata.mappings[nodeId]);
    		if (!mappings) $$invalidate(6, mappings = []);
    	}

    	window.openGyreMappings = openGyreMappings; // expose open function so it can be called from ComfyUI menu extension

    	// check of a widget (=a node property) is connected to a form field
    	function checkGyreMapping(node, widget) {
    		if (!$metadata.mappings) return;
    		if (!$metadata.mappings[node.id]) return;

    		for (let i = 0; i < $metadata.mappings[node.id].length; i++) {
    			let mapping = $metadata.mappings[node.id][i];

    			if (mapping.toField === widget.name) {
    				let label = widget.label || widget.name;
    				return label + "=" + mapping.fromField;
    			}
    		}
    	}

    	window.checkGyreMapping = checkGyreMapping;

    	function setComboValue(widget) {
    		if (widget.type !== "combo" || !widget.options || !widget.options.values || !widget.name) return;
    		if (!$metadata.combo_values) set_store_value(metadata, $metadata.combo_values = {}, $metadata);
    		set_store_value(metadata, $metadata.combo_values[widget.name] = widget.options.values, $metadata); //widget.options
    	}

    	window.gyreSetCombovalues = setComboValue;

    	function closeDialog() {
    		$$invalidate(0, showGyreMappings = "none");
    	}

    	function getMappingFields() {
    		let fields = [];
    		if ($metadata.forms && $metadata.forms.default && $metadata.forms.default.elements) fields = $metadata.forms.default.elements;

    		let defaultFields = [
    			{
    				name: "mergedImage",
    				notInRuleEditor: true
    			},
    			{ name: "mask", notInRuleEditor: true },
    			{ name: "hasMask" },
    			{ name: "prompt" },
    			{ name: "negativePrompt" },
    			{ name: "controlnet[].type" },
    			{
    				name: "controlnet[].image",
    				notInRuleEditor: true
    			},
    			{ name: "controlnet[].strength" },
    			{ name: "controlnet[].start_percent" },
    			{ name: "controlnet[].end_percent" },
    			{ name: "controlnet[].model" }
    		];

    		let outputFields = [{ name: "resultImage" }];
    		let res = { fields, defaultFields, outputFields };
    		return res;
    	}

    	let mappings = [];
    	let fromField = "";
    	let toField = "";

    	function addMapping() {
    		if (!toField || !fromField) return;
    		if (!nodeId) return;
    		mappings.push({ fromField, toField });
    		$$invalidate(6, mappings);
    		set_store_value(metadata, $metadata.mappings[nodeId] = mappings, $metadata);
    		$$invalidate(7, fromField = $$invalidate(8, toField = ""));
    	}

    	function deleteMapping(index) {
    		mappings.splice(index, 1);
    		$$invalidate(6, mappings);
    		set_store_value(metadata, $metadata.mappings[nodeId] = mappings, $metadata);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Mappings> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		fromField = select_value(this);
    		$$invalidate(7, fromField);
    		$$invalidate(5, mappingFields);
    	}

    	function select1_change_handler() {
    		toField = select_value(this);
    		$$invalidate(8, toField);
    		$$invalidate(3, widgets);
    	}

    	const click_handler = e => {
    		addMapping();
    	};

    	const click_handler_1 = e => {
    		deleteMapping();
    	};

    	const click_handler_2 = e => {
    		closeDialog();
    	};

    	$$self.$capture_state = () => ({
    		metadata,
    		Icon,
    		showGyreMappings,
    		gyreMappingsDialogLeft,
    		gyreMappingsDialogTop,
    		widgets,
    		nodeType,
    		mappingFields,
    		nodeId,
    		openGyreMappings,
    		checkGyreMapping,
    		setComboValue,
    		closeDialog,
    		getMappingFields,
    		mappings,
    		fromField,
    		toField,
    		addMapping,
    		deleteMapping,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('showGyreMappings' in $$props) $$invalidate(0, showGyreMappings = $$props.showGyreMappings);
    		if ('gyreMappingsDialogLeft' in $$props) $$invalidate(1, gyreMappingsDialogLeft = $$props.gyreMappingsDialogLeft);
    		if ('gyreMappingsDialogTop' in $$props) $$invalidate(2, gyreMappingsDialogTop = $$props.gyreMappingsDialogTop);
    		if ('widgets' in $$props) $$invalidate(3, widgets = $$props.widgets);
    		if ('nodeType' in $$props) $$invalidate(4, nodeType = $$props.nodeType);
    		if ('mappingFields' in $$props) $$invalidate(5, mappingFields = $$props.mappingFields);
    		if ('nodeId' in $$props) nodeId = $$props.nodeId;
    		if ('mappings' in $$props) $$invalidate(6, mappings = $$props.mappings);
    		if ('fromField' in $$props) $$invalidate(7, fromField = $$props.fromField);
    		if ('toField' in $$props) $$invalidate(8, toField = $$props.toField);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showGyreMappings,
    		gyreMappingsDialogLeft,
    		gyreMappingsDialogTop,
    		widgets,
    		nodeType,
    		mappingFields,
    		mappings,
    		fromField,
    		toField,
    		closeDialog,
    		addMapping,
    		deleteMapping,
    		getMappingFields,
    		select0_change_handler,
    		select1_change_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Mappings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { getMappingFields: 12 }, add_css$3, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mappings",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get getMappingFields() {
    		return this.$$.ctx[12];
    	}

    	set getMappingFields(value) {
    		throw new Error("<Mappings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\RuleEditor.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\RuleEditor.svelte";

    function add_css$2(target) {
    	append_styles(target, "svelte-14rkto5", ".rule-row.svelte-14rkto5.svelte-14rkto5{position:relative;padding:10px;border:1px solid #ccc;margin-bottom:5px}.rule-row.svelte-14rkto5:hover .edit-button.svelte-14rkto5{display:block}.edit-button.svelte-14rkto5.svelte-14rkto5{display:none;position:absolute;top:0;right:0;cursor:pointer;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;padding:5px}.close-button.svelte-14rkto5.svelte-14rkto5{position:absolute;top:5px;right:5px;cursor:pointer}.action-row.svelte-14rkto5.svelte-14rkto5{}.oneLine.svelte-14rkto5.svelte-14rkto5{display:inline-block;margin-right:10px;width:120px;font-size:14px}.input.svelte-14rkto5.svelte-14rkto5{background-color:black;color:white;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}.rightValue.svelte-14rkto5.svelte-14rkto5{width:150px}.ruleEditor.svelte-14rkto5 button.svelte-14rkto5{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.ruleEditor.svelte-14rkto5 .delete.svelte-14rkto5{background-color:red;color:white}.ruleEditor.svelte-14rkto5 h1.svelte-14rkto5{font-size:16px;margin-bottom:30px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVsZUVkaXRvci5zdmVsdGUiLCJzb3VyY2VzIjpbIlJ1bGVFZGl0b3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgXHJcbiAgICBcclxuXHJcbiAgICBpbXBvcnQgeyBtZXRhZGF0YX0gZnJvbSAnLi9zdG9yZXMvbWV0YWRhdGEnXHJcbiAgICBpbXBvcnQgSW5wdXRDb21ibyAgZnJvbSAnLi9JbnB1dENvbWJvLnN2ZWx0ZSdcclxuICAgIGltcG9ydCBNYXBwaW5ncyBmcm9tICcuL01hcHBpbmdzLnN2ZWx0ZSc7XHJcbiAgICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJztcclxuXHJcbiAgICBsZXQgTWFwcGluZ3NDb3BtcG9uZW50XHJcbiAgICBsZXQgY29uZGl0aW9ucyA9IFsnPT0nLCAnIT0nLCAnPicsICc8JywgJz49JywgJzw9J107XHJcbiAgICBsZXQgZWRpdGluZ0luZGV4ID0gbnVsbDsgLy8gSW5kZXggb2YgdGhlIGN1cnJlbnRseSBlZGl0aW5nIHJ1bGVcclxuICAgIGlmICghJG1ldGFkYXRhLnJ1bGVzKSAkbWV0YWRhdGEucnVsZXM9W11cclxuICAgIGxldCBmaWVsZHM9JG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQuZWxlbWVudHMgLy8gZ2V0IGZvcm0gZmllbGRzXHJcbiAgICBsZXQgcnVsZXMgPSAkbWV0YWRhdGEucnVsZXNcclxuICAgIGxldCBtYXBwaW5nRmllbGRzPXtkZWZhdWx0ZmllbGRzOltdfVxyXG4gICAgZnVuY3Rpb24gYWRkUnVsZSgpIHtcclxuICAgICAgcnVsZXMucHVzaCh7IGZpZWxkTmFtZTogJycsIGNvbmRpdGlvbjogJycsIGFjdGlvblR5cGU6ICcnLCByaWdodFZhbHVlOicnLCB0YXJnZXRGaWVsZDogJycsIGFjdGlvblZhbHVlOiAnJyB9KTtcclxuICAgICAgcnVsZXM9cnVsZXNcclxuICAgICAgZWRpdGluZ0luZGV4PXJ1bGVzLmxlbmd0aC0xXHJcbiAgICAgICRtZXRhZGF0YS5ydWxlcyA9IHJ1bGVzO1xyXG4gICAgfVxyXG4gICAgb25Nb3VudCgoKSA9PiB7XHJcbiAgICAgIG1hcHBpbmdGaWVsZHM9TWFwcGluZ3NDb3BtcG9uZW50LmdldE1hcHBpbmdGaWVsZHMoKVxyXG4gICAgICBjb25zb2xlLmxvZyhtYXBwaW5nRmllbGRzKVxyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiBkZWxldGVSdWxlKGluZGV4KSB7XHJcbiAgICAgIHJ1bGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGlmIChlZGl0aW5nSW5kZXggPT09IGluZGV4KSB7XHJcbiAgICAgICAgZWRpdGluZ0luZGV4ID0gbnVsbDsgLy8gUmVzZXQgZWRpdGluZyBpbmRleCBpZiB0aGUgY3VycmVudGx5IGVkaXRlZCBydWxlIGlzIGRlbGV0ZWRcclxuICAgICAgfVxyXG4gICAgICBydWxlcz1ydWxlc1xyXG4gICAgICAkbWV0YWRhdGEucnVsZXMgPSBydWxlcztcclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIGVkaXRSdWxlKGluZGV4KSB7XHJcbiAgICAgIGVkaXRpbmdJbmRleCA9IGluZGV4O1xyXG4gICAgfVxyXG4gIDwvc2NyaXB0PlxyXG4gIFxyXG4gIDxzdHlsZT5cclxuICAgIC5ydWxlLXJvdyB7XHJcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgcGFkZGluZzogMTBweDtcclxuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcclxuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xyXG4gICAgfVxyXG4gICAgLnJ1bGUtcm93OmhvdmVyIC5lZGl0LWJ1dHRvbiB7XHJcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgfVxyXG4gICAgLmVkaXQtYnV0dG9uIHtcclxuICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTI4LCAxMjgsIDEyOCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgIH1cclxuICAgIC5jbG9zZS1idXR0b24ge1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIHRvcDogNXB4O1xyXG4gICAgICByaWdodDogNXB4O1xyXG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcblxyXG4gICAgfSAgICBcclxuICAgIC5hY3Rpb24tcm93IHtcclxuXHJcbiAgICB9XHJcbiAgICAub25lTGluZSB7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgICAgICB3aWR0aDoxMjBweDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcblxyXG4gICAgfVxyXG4gICAgLmlucHV0IHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgcGFkZGluZzogM3B4O1xyXG4gICAgfVxyXG4gICAgLnJpZ2h0VmFsdWUge1xyXG4gICAgICAgIHdpZHRoOiAxNTBweDtcclxuICAgIH1cclxuICAgIC5ydWxlRWRpdG9yIGJ1dHRvbiB7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIG1pbi13aWR0aDogNzBweDtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogcmdiKDEyOCwgMTI4LCAxMjgpO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfVxyXG4gICAgLnJ1bGVFZGl0b3IgLmRlbGV0ZSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIH1cclxuICAgIC5ydWxlRWRpdG9yIGgxIHtcclxuICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gICAgfVxyXG4gIDwvc3R5bGU+XHJcbiAgXHJcblxyXG4gPGRpdiBjbGFzcz1cInJ1bGVFZGl0b3JcIj5cclxuICA8aDE+UnVsZXM8L2gxPlxyXG5cclxuICB7I2VhY2ggcnVsZXMgYXMgcnVsZSwgaW5kZXh9XHJcbiAgICA8ZGl2IGNsYXNzPVwicnVsZS1yb3dcIj5cclxuICAgICAgeyNpZiBlZGl0aW5nSW5kZXggPT09IGluZGV4fVxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNsb3NlLWJ1dHRvblwiIG9uOmNsaWNrPXsoKSA9PiB7IGVkaXRpbmdJbmRleD0tMSB9fT5YPC9kaXY+XHJcblxyXG4gICAgICAgIDwhLS0gSW5wdXRzIGZvciBlZGl0aW5nIC0tPlxyXG5cclxuICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS5maWVsZE5hbWV9ICBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPkZpZWxkLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkZvcm1cIj5cclxuICAgICAgICAgICAgICB7I2VhY2ggZmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiRGVmYXVsdHNcIj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCBtYXBwaW5nRmllbGRzLmRlZmF1bHRGaWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17cnVsZS5jb25kaXRpb259IGNsYXNzPVwib25lTGluZSBpbnB1dFwiPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+Q29uZGl0aW9uLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsjZWFjaCBjb25kaXRpb25zIGFzIGNvbmRpdGlvbn1cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtjb25kaXRpb259Pntjb25kaXRpb259PC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJpbnB1dCByaWdodFZhbHVlXCIgcGxhY2Vob2xkZXI9XCJWYWx1ZVwiIGJpbmQ6dmFsdWU9e3J1bGUucmlnaHRWYWx1ZX0+XHJcblxyXG4gICAgICAgICAgPHNlbGVjdCBiaW5kOnZhbHVlPXtydWxlLmFjdGlvblR5cGV9ICBjbGFzcz1cImlucHV0XCI+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5BY3Rpb24uLi48L29wdGlvbj5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNldFZhbHVlXCI+U2V0IFZhbHVlPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzaG93RmllbGRcIj5TaG93L0hpZGU8L29wdGlvbj5cclxuICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIHsjaWYgcnVsZS5hY3Rpb25UeXBlID09PSAnc2V0VmFsdWUnfVxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbi1yb3dcIj5cclxuICAgICAgICAgICAgICA8c2VsZWN0IGJpbmQ6dmFsdWU9e3J1bGUudGFyZ2V0RmllbGR9IGNsYXNzPVwib25lTGluZSBpbnB1dFwiPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPkZpZWxkLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJGb3JtXCI+XHJcbiAgICAgICAgICAgICAgICAgIHsjZWFjaCBmaWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJEZWZhdWx0c1wiPlxyXG4gICAgICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5kZWZhdWx0RmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICA8L29wdGdyb3VwPlxyXG4gICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgID0gPElucHV0Q29tYm8gIGJpbmQ6dmFsdWU9e3J1bGUuYWN0aW9uVmFsdWV9IH0+PC9JbnB1dENvbWJvPlxyXG4gICAgICAgICAgICAgIDwhLS0gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgYmluZDp2YWx1ZT17cnVsZS5hY3Rpb25WYWx1ZX0gcGxhY2Vob2xkZXI9XCJWYWx1ZVwiICBjbGFzcz1cIm9uZUxpbmUgaW5wdXRcIiBzdHlsZT1cIndpZHRoOjI3MHB4XCI+LS0+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7L2lmfVxyXG4gICAgICAgIDxkaXY+PGJ1dHRvbiBvbjpjbGljaz17KCkgPT4gZGVsZXRlUnVsZShpbmRleCl9IGNsYXNzPVwiZGVsZXRlXCI+RGVsZXRlPC9idXR0b24+PC9kaXY+XHJcbiAgICAgICAgXHJcblxyXG4gICAgICB7OmVsc2V9XHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdC1idXR0b25cIiBvbjpjbGljaz17KCkgPT4gZWRpdFJ1bGUoaW5kZXgpfT5FZGl0PC9kaXY+XHJcbiAgICAgICAgPCEtLSBEaXNwbGF5IFJ1bGUgU3VtbWFyeSAtLT5cclxuICAgICAgICA8ZGl2PiBpZiB7cnVsZS5maWVsZE5hbWV9IHtydWxlLmNvbmRpdGlvbn0ge3J1bGUucmlnaHRWYWx1ZX06IHsjaWYgcnVsZS5hY3Rpb25UeXBlPT09XCJzZXRWYWx1ZVwifXNldCB7cnVsZS50YXJnZXRGaWVsZH09e3J1bGUuYWN0aW9uVmFsdWV9ey9pZn08L2Rpdj5cclxuICAgICAgey9pZn1cclxuICAgIDwvZGl2PlxyXG4gIHsvZWFjaH1cclxuICA8YnV0dG9uIG9uOmNsaWNrPXthZGRSdWxlfT5BZGQgUnVsZTwvYnV0dG9uPlxyXG48L2Rpdj5cclxuPGRpdiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPjxNYXBwaW5ncyBiaW5kOnRoaXM9e01hcHBpbmdzQ29wbXBvbmVudH0+PC9NYXBwaW5ncz48L2Rpdj5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXlDSSx1Q0FBVSxDQUNSLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUN0QixhQUFhLENBQUUsR0FDakIsQ0FDQSx3QkFBUyxNQUFNLENBQUMsMkJBQWEsQ0FDM0IsT0FBTyxDQUFFLEtBQ1gsQ0FDQSwwQ0FBYSxDQUNYLE9BQU8sQ0FBRSxJQUFJLENBQ2IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLENBQUMsQ0FDTixLQUFLLENBQUUsQ0FBQyxDQUNSLE1BQU0sQ0FBRSxPQUFPLENBQ2YsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDakksS0FBSyxDQUFFLEtBQUssQ0FDWixnQkFBZ0IsQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxZQUFZLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDaEMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsT0FBTyxDQUFFLEdBQ2IsQ0FDQSwyQ0FBYyxDQUNaLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxHQUFHLENBQ1IsS0FBSyxDQUFFLEdBQUcsQ0FDVixNQUFNLENBQUUsT0FFVixDQUNBLHlDQUFZLENBRVosQ0FDQSxzQ0FBUyxDQUNMLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLFlBQVksQ0FBRSxJQUFJLENBQ2xCLE1BQU0sS0FBSyxDQUNYLFNBQVMsQ0FBRSxJQUVmLENBQ0Esb0NBQU8sQ0FDSCxnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLEtBQUssQ0FBRSxLQUFLLENBQ1osV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksT0FBTyxDQUFFLEdBQ2IsQ0FDQSx5Q0FBWSxDQUNSLEtBQUssQ0FBRSxLQUNYLENBQ0EsMEJBQVcsQ0FBQyxxQkFBTyxDQUNmLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLFNBQVMsQ0FBRSxJQUFJLENBQ2YsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsS0FBSyxDQUNaLGdCQUFnQixDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLFlBQVksQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxhQUFhLENBQUUsR0FBRyxDQUNsQixNQUFNLENBQUUsT0FBTyxDQUNmLFlBQVksQ0FBRSxJQUNsQixDQUNBLDBCQUFXLENBQUMsc0JBQVEsQ0FDaEIsZ0JBQWdCLENBQUUsR0FBRyxDQUNyQixLQUFLLENBQUUsS0FDWCxDQUNBLDBCQUFXLENBQUMsaUJBQUcsQ0FDYixTQUFTLENBQUUsSUFBSSxDQUNmLGFBQWEsQ0FBRSxJQUNqQiJ9 */");
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[21] = list;
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (171:6) {:else}
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
    		return /*click_handler_2*/ ctx[17](/*index*/ ctx[22]);
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
    			add_location(div0, file$1, 172, 8, 5731);
    			add_location(div1, file$1, 174, 8, 5848);
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
    			if (dirty[0] & /*rules*/ 4 && t3_value !== (t3_value = /*rule*/ ctx[20].fieldName + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*rules*/ 4 && t5_value !== (t5_value = /*rule*/ ctx[20].condition + "")) set_data_dev(t5, t5_value);
    			if (dirty[0] & /*rules*/ 4 && t7_value !== (t7_value = /*rule*/ ctx[20].rightValue + "")) set_data_dev(t7, t7_value);

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
    		source: "(171:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (117:6) {#if editingIndex === index}
    function create_if_block$1(ctx) {
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
    	let each_value_5 = /*fields*/ ctx[5];
    	validate_each_argument(each_value_5);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_2[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*mappingFields*/ ctx[3].defaultFields;
    	validate_each_argument(each_value_4);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_1[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	function select0_change_handler() {
    		/*select0_change_handler*/ ctx[10].call(select0, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	let each_value_3 = /*conditions*/ ctx[4];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	function select1_change_handler() {
    		/*select1_change_handler*/ ctx[11].call(select1, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[12].call(input, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	function select2_change_handler() {
    		/*select2_change_handler*/ ctx[13].call(select2, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	let if_block = /*rule*/ ctx[20].actionType === 'setValue' && create_if_block_1$1(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[16](/*index*/ ctx[22]);
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
    			add_location(div0, file$1, 118, 8, 3314);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$1, 123, 12, 3510);
    			attr_dev(optgroup0, "label", "Form");
    			add_location(optgroup0, file$1, 124, 12, 3558);
    			attr_dev(optgroup1, "label", "Defaults");
    			add_location(optgroup1, file$1, 129, 14, 3752);
    			attr_dev(select0, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[20].fieldName === void 0) add_render_callback(select0_change_handler);
    			add_location(select0, file$1, 122, 10, 3437);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$1, 136, 12, 4066);
    			attr_dev(select1, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[20].condition === void 0) add_render_callback(select1_change_handler);
    			add_location(select1, file$1, 135, 10, 3994);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "input rightValue svelte-14rkto5");
    			attr_dev(input, "placeholder", "Value");
    			add_location(input, file$1, 141, 10, 4265);
    			option2.__value = "";
    			option2.value = option2.__value;
    			add_location(option2, file$1, 144, 12, 4438);
    			option3.__value = "setValue";
    			option3.value = option3.__value;
    			add_location(option3, file$1, 145, 12, 4487);
    			option4.__value = "showField";
    			option4.value = option4.__value;
    			add_location(option4, file$1, 146, 12, 4544);
    			attr_dev(select2, "class", "input svelte-14rkto5");
    			if (/*rule*/ ctx[20].actionType === void 0) add_render_callback(select2_change_handler);
    			add_location(select2, file$1, 143, 10, 4372);
    			attr_dev(button, "class", "delete svelte-14rkto5");
    			add_location(button, file$1, 167, 13, 5549);
    			add_location(div1, file$1, 167, 8, 5544);
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
    					listen_dev(div0, "click", /*click_handler*/ ctx[9], false, false, false, false),
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

    			if (dirty[0] & /*fields*/ 32) {
    				each_value_5 = /*fields*/ ctx[5];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_5(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_5.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 8) {
    				each_value_4 = /*mappingFields*/ ctx[3].defaultFields;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_4$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_4.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select0, /*rule*/ ctx[20].fieldName);
    			}

    			if (dirty[0] & /*conditions*/ 16) {
    				each_value_3 = /*conditions*/ ctx[4];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select1, /*rule*/ ctx[20].condition);
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44 && input.value !== /*rule*/ ctx[20].rightValue) {
    				set_input_value(input, /*rule*/ ctx[20].rightValue);
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select2, /*rule*/ ctx[20].actionType);
    			}

    			if (/*rule*/ ctx[20].actionType === 'setValue') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*rules*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(117:6) {#if editingIndex === index}",
    		ctx
    	});

    	return block;
    }

    // (175:70) {#if rule.actionType==="setValue"}
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
    			if (dirty[0] & /*rules*/ 4 && t1_value !== (t1_value = /*rule*/ ctx[20].targetField + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*rules*/ 4 && t3_value !== (t3_value = /*rule*/ ctx[20].actionValue + "")) set_data_dev(t3, t3_value);
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
    		source: "(175:70) {#if rule.actionType===\\\"setValue\\\"}",
    		ctx
    	});

    	return block;
    }

    // (126:14) {#each fields as field}
    function create_each_block_5(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[23].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[23].name;
    			option.value = option.__value;
    			add_location(option, file$1, 126, 16, 3638);
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
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(126:14) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (131:16) {#each mappingFields.defaultFields as field}
    function create_each_block_4$1(ctx) {
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
    			add_location(option, file$1, 131, 18, 3861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 8 && t_value !== (t_value = /*field*/ ctx[23].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 8 && option_value_value !== (option_value_value = /*field*/ ctx[23].name)) {
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
    		source: "(131:16) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (138:12) {#each conditions as condition}
    function create_each_block_3$1(ctx) {
    	let option;
    	let t_value = /*condition*/ ctx[28] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*condition*/ ctx[28];
    			option.value = option.__value;
    			add_location(option, file$1, 138, 14, 4165);
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
    		source: "(138:12) {#each conditions as condition}",
    		ctx
    	});

    	return block;
    }

    // (149:8) {#if rule.actionType === 'setValue'}
    function create_if_block_1$1(ctx) {
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
    	let each_value_2 = /*fields*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*mappingFields*/ ctx[3].defaultFields;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[14].call(select, /*each_value*/ ctx[21], /*index*/ ctx[22]);
    	}

    	function inputcombo_value_binding(value) {
    		/*inputcombo_value_binding*/ ctx[15](value, /*rule*/ ctx[20]);
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
    			add_location(option, file$1, 151, 16, 4785);
    			attr_dev(optgroup0, "label", "Form");
    			add_location(optgroup0, file$1, 152, 16, 4837);
    			attr_dev(optgroup1, "label", "Defaults");
    			add_location(optgroup1, file$1, 157, 16, 5047);
    			attr_dev(select, "class", "oneLine input svelte-14rkto5");
    			if (/*rule*/ ctx[20].targetField === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$1, 150, 14, 4707);
    			attr_dev(div, "class", "action-row svelte-14rkto5");
    			add_location(div, file$1, 149, 10, 4667);
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

    			if (dirty[0] & /*fields*/ 32) {
    				each_value_2 = /*fields*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(optgroup0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty[0] & /*mappingFields*/ 8) {
    				each_value_1 = /*mappingFields*/ ctx[3].defaultFields;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(optgroup1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty[0] & /*rules, mappingFields, fields*/ 44) {
    				select_option(select, /*rule*/ ctx[20].targetField);
    			}

    			const inputcombo_changes = {};

    			if (!updating_value && dirty[0] & /*rules*/ 4) {
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(149:8) {#if rule.actionType === 'setValue'}",
    		ctx
    	});

    	return block;
    }

    // (154:18) {#each fields as field}
    function create_each_block_2$1(ctx) {
    	let option;
    	let t_value = /*field*/ ctx[23].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*field*/ ctx[23].name;
    			option.value = option.__value;
    			add_location(option, file$1, 154, 20, 4925);
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
    		source: "(154:18) {#each fields as field}",
    		ctx
    	});

    	return block;
    }

    // (159:18) {#each mappingFields.defaultFields as field}
    function create_each_block_1$1(ctx) {
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
    			add_location(option, file$1, 159, 20, 5160);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mappingFields*/ 8 && t_value !== (t_value = /*field*/ ctx[23].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*mappingFields*/ 8 && option_value_value !== (option_value_value = /*field*/ ctx[23].name)) {
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
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(159:18) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (115:2) {#each rules as rule, index}
    function create_each_block$1(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*editingIndex*/ ctx[1] === /*index*/ ctx[22]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "rule-row svelte-14rkto5");
    			add_location(div, file$1, 115, 4, 3180);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(115:2) {#each rules as rule, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let t2;
    	let button;
    	let t4;
    	let div1;
    	let mappings;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*rules*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let mappings_props = {};
    	mappings = new Mappings({ props: mappings_props, $$inline: true });
    	/*mappings_binding*/ ctx[18](mappings);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Rules";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			button = element("button");
    			button.textContent = "Add Rule";
    			t4 = space();
    			div1 = element("div");
    			create_component(mappings.$$.fragment);
    			attr_dev(h1, "class", "svelte-14rkto5");
    			add_location(h1, file$1, 112, 2, 3126);
    			attr_dev(button, "class", "svelte-14rkto5");
    			add_location(button, file$1, 178, 2, 6036);
    			attr_dev(div0, "class", "ruleEditor svelte-14rkto5");
    			add_location(div0, file$1, 111, 1, 3098);
    			set_style(div1, "display", "none");
    			add_location(div1, file$1, 180, 0, 6090);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			append_dev(div0, t2);
    			append_dev(div0, button);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(mappings, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addRule*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteRule, rules, mappingFields, fields, conditions, editingIndex, editRule*/ 446) {
    				each_value = /*rules*/ ctx[2];
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
    						each_blocks[i].m(div0, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const mappings_changes = {};
    			mappings.$set(mappings_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(mappings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(mappings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			/*mappings_binding*/ ctx[18](null);
    			destroy_component(mappings);
    			mounted = false;
    			dispose();
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
    	component_subscribe($$self, metadata, $$value => $$invalidate(19, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RuleEditor', slots, []);
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

    		$$invalidate(2, rules);
    		$$invalidate(1, editingIndex = rules.length - 1);
    		set_store_value(metadata, $metadata.rules = rules, $metadata);
    	}

    	onMount(() => {
    		$$invalidate(3, mappingFields = MappingsCopmponent.getMappingFields());
    		console.log(mappingFields);
    	});

    	function deleteRule(index) {
    		rules.splice(index, 1);

    		if (editingIndex === index) {
    			$$invalidate(1, editingIndex = null); // Reset editing index if the currently edited rule is deleted
    		}

    		$$invalidate(2, rules);
    		set_store_value(metadata, $metadata.rules = rules, $metadata);
    	}

    	function editRule(index) {
    		$$invalidate(1, editingIndex = index);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<RuleEditor> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, editingIndex = -1);
    	};

    	function select0_change_handler(each_value, index) {
    		each_value[index].fieldName = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function select1_change_handler(each_value, index) {
    		each_value[index].condition = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function input_input_handler(each_value, index) {
    		each_value[index].rightValue = this.value;
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function select2_change_handler(each_value, index) {
    		each_value[index].actionType = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function select_change_handler(each_value, index) {
    		each_value[index].targetField = select_value(this);
    		$$invalidate(2, rules);
    		$$invalidate(3, mappingFields);
    		$$invalidate(5, fields);
    	}

    	function inputcombo_value_binding(value, rule) {
    		if ($$self.$$.not_equal(rule.actionValue, value)) {
    			rule.actionValue = value;
    			$$invalidate(2, rules);
    		}
    	}

    	const click_handler_1 = index => deleteRule(index);
    	const click_handler_2 = index => editRule(index);

    	function mappings_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			MappingsCopmponent = $$value;
    			$$invalidate(0, MappingsCopmponent);
    		});
    	}

    	$$self.$capture_state = () => ({
    		metadata,
    		InputCombo,
    		Mappings,
    		onMount,
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
    		if ('MappingsCopmponent' in $$props) $$invalidate(0, MappingsCopmponent = $$props.MappingsCopmponent);
    		if ('conditions' in $$props) $$invalidate(4, conditions = $$props.conditions);
    		if ('editingIndex' in $$props) $$invalidate(1, editingIndex = $$props.editingIndex);
    		if ('fields' in $$props) $$invalidate(5, fields = $$props.fields);
    		if ('rules' in $$props) $$invalidate(2, rules = $$props.rules);
    		if ('mappingFields' in $$props) $$invalidate(3, mappingFields = $$props.mappingFields);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		MappingsCopmponent,
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
    		click_handler_2,
    		mappings_binding
    	];
    }

    class RuleEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {}, add_css$2, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RuleEditor",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    class workflowStructurePass {

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

      // Gyre loops: reroute end loop link and make new link between groups
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
            }
          }
        });
      }

      duplicateGroupWithNodesAndLinks(groupName) {
        // Assuming getGroupByName and isNodeInGroup functions are defined elsewhere
        const originalGroup = this.getGroupByName(groupName);
        if (!originalGroup) return; // Exit if group not found
        console.log("# nodes", this.workflow.nodes.length);

        let maxNodeId = this.workflow.last_node_id;
        let maxLinkId = this.workflow.last_link_id;

        // Duplicate group
        const newGroup = JSON.parse(JSON.stringify(originalGroup));
        newGroup.title += " Copy"; // Adjust the group title
        newGroup.bounding[0] += 1000; // Shift the new group to prevent overlap
        this.workflow.groups.push(newGroup);

        this.nodeMapping = {}; // Map old node IDs to new node IDs

        // Duplicate nodes
        this.workflow.nodes.forEach(node => {
          if (this.isNodeInGroup(node.id, groupName)) {
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.id = ++maxNodeId;
            newNode.pos[0] += 1000;
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
       this.adjustLinksForSpecialNodes(groupName);
        maxLinkId = this.workflow.last_link_id;

        this.updateNodeLinks();
        // Update the workflow's metadata
        this.workflow.last_node_id = maxNodeId;
        this.workflow.last_link_id = maxLinkId;
      }


    }

    /* src\WorkflowManager.svelte generated by Svelte v3.59.2 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src\\WorkflowManager.svelte";

    function add_css$1(target) {
    	append_styles(target, "svelte-1ac5lll", "@import 'dist/build/gyrestyles.css';\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gICAgaW1wb3J0IEZvcm1CdWlsZGVyIGZyb20gXCIuL0Zvcm1CdWlsZGVyLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQgUnVsZUVkaXRvciBmcm9tIFwiLi9SdWxlRWRpdG9yLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQgTWFwcGluZ3MgZnJvbSBcIi4vTWFwcGluZ3Muc3ZlbHRlXCJcclxuXHJcbiAgICBpbXBvcnQge3dyaXRhYmxlfSBmcm9tICdzdmVsdGUvc3RvcmUnXHJcbiAgICBpbXBvcnQge29uTW91bnR9IGZyb20gJ3N2ZWx0ZSdcclxuICAgIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gJy4vc3RvcmVzL21ldGFkYXRhJ1xyXG4gICAgaW1wb3J0IEljb24gZnJvbSAnLi9JY29uLnN2ZWx0ZSdcclxuICAgIGltcG9ydCB7IHdvcmtmbG93U3RydWN0dXJlUGFzcyB9IGZyb20gJy4vd29ya2Zsb3dTdHJ1Y3R1cmVQYXNzLmpzJ1xyXG5cclxuICAgIGxldCBhbGx3b3JrZmxvd3M7XHJcbiAgICBsZXQgbW92aW5nID0gZmFsc2U7XHJcbiAgICBsZXQgbGVmdCA9IDEwXHJcbiAgICBsZXQgdG9wID0gMTBcclxuICAgIGxldCBzdHlsZWVsO1xyXG4gICAgbGV0IGxvYWRlZHdvcmtmbG93O1xyXG5cclxuICAgIGxldCBmb2xkT3V0ID0gZmFsc2VcclxuICAgIGxldCBuYW1lID0gXCJcIiAgIC8vIGN1cnJlbnQgbG9hZGVkIHdvcmtmbG93IG5hbWVcclxuICAgIGxldCBzdGF0ZSA9IFwibGlzdFwiXHJcbiAgICBsZXQgdGFncyA9IFtcIlR4dDJJbWFnZVwiLCBcIklucGFpbnRpbmdcIiwgXCJDb250cm9sTmV0XCIsIFwiTGF5ZXJNZW51XCIsIFwiRGVhY3RpdmF0ZWRcIl1cclxuICAgIGxldCB3b3JrZmxvd0xpc3QgPSB3cml0YWJsZShbXSkgICAgLy8gdG9kbzpsb2FkIGFsbCB3b3JrZmxvdyBiYXNpYyBkYXRhIChuYW1lLCBsYXN0IGNoYW5nZWQgYW5kIGd5cmUgb2JqZWN0KSBmcm9tIHNlcnZlciB2aWEgc2VydmVyIHJlcXVlc3RcclxuICAgIGxldCBhY3RpdmF0ZWRUYWdzID0ge31cclxuICAgIGxldCBzZWxlY3RlZFRhZyA9IFwiXCJcclxuXHJcbiAgXHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oKSB7XHJcbiAgICAgICAgbW92aW5nID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShlKSB7XHJcbiAgICAgICAgaWYgKG1vdmluZykge1xyXG4gICAgICAgICAgICBsZWZ0ICs9IGUubW92ZW1lbnRYO1xyXG4gICAgICAgICAgICB0b3AgKz0gZS5tb3ZlbWVudFk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTW91bnQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IGxvYWRMaXN0KCk7XHJcbiAgICAgICAgYWRkRXh0ZXJuYWxMb2FkTGlzdGVuZXIoKTtcclxuICAgIH0pXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZEV4dGVybmFsTG9hZExpc3RlbmVyKCkge1xyXG4gICAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tZnktZmlsZS1pbnB1dFwiKTtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXRMaXN0ZW5lciA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGZpbGVJbnB1dCAmJiBmaWxlSW5wdXQuZmlsZXMgJiYgZmlsZUlucHV0LmZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGVJbnB1dCwgZmlsZUlucHV0LmZpbGVzKTtcclxuICAgICAgICAgICAgICAgIG5ldyBEYXRlKGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWQpLnRvRGF0ZVN0cmluZygpXHJcbiAgICAgICAgICAgICAgICBsZXQgZml4ZWRmaWxlbmFtZSA9IGdldEF2YWxhYmxlRmlsZU5hbWUoZmlsZUlucHV0LmZpbGVzWzBdLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyYXBoID0gd2luZG93LmFwcC5ncmFwaC5zZXJpYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGdyYXBoLm5hbWUgPSBmaXhlZGZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGgubGFzdE1vZGlmaWVkID0gZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZFxyXG4gICAgICAgICAgICAgICAgaWYgKCFncmFwaC5leHRyYT8ud29ya3NwYWNlX2luZm8pIGdyYXBoLmV4dHJhLndvcmtzcGFjZV9pbmZvID0gW107XHJcbiAgICAgICAgICAgICAgICBncmFwaC5leHRyYS53b3Jrc3BhY2VfaW5mby5uYW1lID0gZml4ZWRmaWxlbmFtZTtcclxuICAgICAgICAgICAgICAgIGdyYXBoLmV4dHJhLndvcmtzcGFjZV9pbmZvLmxhc3RNb2RpZmllZCA9IGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5leHRyYS53b3Jrc3BhY2VfaW5mby5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IG5ldyBEYXRlKGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWQpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXTtcclxuICAgICAgICAgICAgICAgIGlmICghZ3JhcGguZXh0cmEuZ3lyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoLmV4dHJhLmd5cmUgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdyYXBoLmV4dHJhLmd5cmUubGFzdE1vZGlmaWVkID0gZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZDtcclxuICAgICAgICAgICAgICAgIGdyYXBoLmV4dHJhLmd5cmUubGFzdE1vZGlmaWVkUmVhZGFibGUgPSBuZXcgRGF0ZShmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkKS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgbG9hZGVkd29ya2Zsb3cgPSBncmFwaDtcclxuICAgICAgICAgICAgICAgIGxvYWRXb3JrZmxvdyhncmFwaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGZpbGVJbnB1dD8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmaWxlSW5wdXRMaXN0ZW5lcik7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRBdmFsYWJsZUZpbGVOYW1lKG5hbWUpIHtcclxuICAgICAgICBpZiAoIW5hbWUpIHJldHVybiAnbmV3JztcclxuICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgICBsZXQgaW5kID0gMTtcclxuICAgICAgICBsZXQgZ29vZG5hbWUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgZXh0ID0gbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xyXG4gICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1xcLlteLy5dKyQvLCBcIlwiKTtcclxuICAgICAgICBsZXQgbmV3bmFtZSA9IG5hbWU7XHJcbiAgICAgICAgd2hpbGUgKCFnb29kbmFtZSkge1xyXG4gICAgICAgICAgICBsZXQgYWxsY3Vycm5hbWVzID0gYWxsd29ya2Zsb3dzLm1hcCgoZWwpID0+IGVsLm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoYWxsY3Vycm5hbWVzLmluY2x1ZGVzKG5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICBuZXduYW1lID0gYCR7bmFtZX0oJHtpbmR9KWA7XHJcbiAgICAgICAgICAgICAgICBpbmQgPSBpbmQgKyAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ29vZG5hbWUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBgJHtuZXduYW1lfWA7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcclxuICAgICAgICBtb3ZpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gaXNWaXNpYmxlKHdvcmtmbG93KSB7XHJcbiAgICAgICAgbGV0IG15dGFncyA9IHdvcmtmbG93Py5neXJlPy50YWdzIHx8IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGFjdGl2ZVRhZyBpbiBhY3RpdmF0ZWRUYWdzKSB7XHJcbiAgICAgICAgICAgIGlmIChhY3RpdmF0ZWRUYWdzW2FjdGl2ZVRhZ10gJiYgIW15dGFncy5pbmNsdWRlcyhhY3RpdmVUYWcpKSByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gbG9hZExpc3QoKSB7XHJcbiAgICAgICAgLy8gdG9kbzogbWFrZSBzZXJ2ZXIgcmVxdWVzdCBhbmQgcmVhZCAkbWV0YWRhdGEgb2YgYWxsIGV4aXN0aW5nIHdvcmtmbG93cyBvbiBmaWxlc3lzdGVtXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IHNjYW5Mb2NhbE5ld0ZpbGVzKClcclxuICAgICAgICBsZXQgZGF0YV93b3JrZmxvd19saXN0ID0gcmVzdWx0Lm1hcCgoZWwpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHtuYW1lOiBlbC5uYW1lfVxyXG4gICAgICAgICAgICBsZXQgZ3lyZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChlbC5qc29uKSBneXJlID0gSlNPTi5wYXJzZShlbC5qc29uKS5leHRyYS5neXJlO1xyXG4gICAgICAgICAgICByZXMubGFzdE1vZGlmaWVkUmVhZGFibGUgPSBKU09OLnBhcnNlKGVsLmpzb24pLmV4dHJhLmd5cmU/Lmxhc3RNb2RpZmllZFJlYWRhYmxlIHx8IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChneXJlKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuZ3lyZSA9IGd5cmU7XHJcbiAgICAgICAgICAgICAgICByZXMuZ3lyZS5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IEpTT04ucGFyc2UoZWwuanNvbikuZXh0cmEuZ3lyZT8ubGFzdE1vZGlmaWVkUmVhZGFibGUgfHwgXCJcIjtcclxuICAgICAgICAgICAgICAgIHJlcy5neXJlLmxhc3RNb2RpZmllZCA9IEpTT04ucGFyc2UoZWwuanNvbikuZXh0cmEuZ3lyZT8ubGFzdE1vZGlmaWVkIHx8IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YV93b3JrZmxvd19saXN0KTtcclxuICAgICAgICB3b3JrZmxvd0xpc3Quc2V0KGRhdGFfd29ya2Zsb3dfbGlzdClcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBzY2FuTG9jYWxOZXdGaWxlcygpIHtcclxuICAgICAgICBsZXQgZXhpc3RGbG93SWRzID0gW107XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi93b3Jrc3BhY2UvcmVhZHdvcmtmbG93ZGlyXCIsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RGbG93SWRzLFxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICByZXN1bHQgPSBmaXhEYXRlc0Zyb21TZXJ2ZXIocmVzdWx0KTtcclxuICAgICAgICAgICAgYWxsd29ya2Zsb3dzID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzY2FuIGxvY2FsIG5ldyBmaWxlczpcIiwgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmaXhEYXRlc0Zyb21TZXJ2ZXIocmVzdWx0KSB7XHJcbiAgICAgICAgbGV0IG5ld2VsID0gcmVzdWx0Lm1hcCgoZWwpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9iampzID0gSlNPTi5wYXJzZShlbC5qc29uKTtcclxuICAgICAgICAgICAgb2JqanMuZXh0cmEuZ3lyZS5sYXN0TW9kaWZpZWQgPSBuZXcgRGF0ZShlbC5sYXN0bW9kaWZpZWQgKiAxMDAwKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGxldCBkYXRlc3RyID0gbmV3IERhdGUoZWwubGFzdG1vZGlmaWVkICogMTAwMCkudG9JU09TdHJpbmcoKTtcclxuICAgICAgICAgICAgb2JqanMuZXh0cmEuZ3lyZS5sYXN0TW9kaWZpZWRSZWFkYWJsZSA9IGRhdGVzdHIuc3BsaXQoJ1QnKVswXSArIFwiIFwiICsgZGF0ZXN0ci5zcGxpdCgnVCcpWzFdLnJlcGxhY2UoL1xcLlteLy5dKyQvLCBcIlwiKTtcclxuICAgICAgICAgICAgbGV0IGpzb24gPSBKU09OLnN0cmluZ2lmeShvYmpqcyk7XHJcbiAgICAgICAgICAgIHJldHVybiB7Li4uZWwsIGpzb259XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbmV3ZWw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRXb3JrZmxvdyh3b3JrZmxvdykge1xyXG4gICAgICAgIGF3YWl0IGxvYWRMaXN0KCk7XHJcbiAgICAgICAgLy8gdG9kbzpjaGVjayBpZiBjdXJyZW50IHdvcmtmbG93IGlzIHVuc2F2ZWQgYW5kIG1ha2UgY29uZmlybSBvdGhlcndpc2VcclxuICAgICAgICAvLyAxLiBtYWtlIHNlcnZlciByZXF1ZXN0IGJ5IHdvcmtmbG93Lm5hbWUsIGdldHRpbmcgZnVsbCB3b3JrZmxvdyBkYXRhIGhlcmVcclxuICAgICAgICAvLyAyLiB1cGRhdGUgQ29tZnlVSSB3aXRoIG5ldyB3b3JrZmxvd1xyXG4gICAgICAgIC8vIDMuIHNldCBuYW1lIGFuZCAkbWV0YWRhdGEgaGVyZVxyXG4gICAgICAgIGlmICghd29ya2Zsb3cuZ3lyZSkge1xyXG4gICAgICAgICAgICB3b3JrZmxvdy5neXJlID0ge307XHJcbiAgICAgICAgICAgIHdvcmtmbG93Lmd5cmUudGFncyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcImxvYWQgd29ya2Zsb3chIVwiKTtcclxuICAgICAgICBuYW1lID0gd29ya2Zsb3cubmFtZVxyXG4gICAgICAgICRtZXRhZGF0YSA9IHdvcmtmbG93Lmd5cmU7XHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEudGFncykgJG1ldGFkYXRhLnRhZ3M9W11cclxuICAgICAgICBpZiAod2luZG93LmFwcC5ncmFwaCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJhcHAuZ3JhcGggaXMgbnVsbCBjYW5ub3QgbG9hZCB3b3JrZmxvd1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBhbGx3b3JrZmxvd3MuZmluZCgoZWwpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsLm5hbWUgPT0gd29ya2Zsb3cubmFtZTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAoIWxvYWRlZHdvcmtmbG93KSB7XHJcbiAgICAgICAgICAgIGlmICghY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFwcC5sb2FkR3JhcGhEYXRhKHdvcmtmbG93KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCB3ZiA9IEpTT04ucGFyc2UoY3VycmVudC5qc29uKTtcclxuICAgICAgICAgICAgICAgIGlmICghd2YubmFtZSAmJiBuYW1lKSB3Zi5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hcHAubG9hZEdyYXBoRGF0YSh3Zik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBzdGF0ZT1cInByb3BlcnRpZXNcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gdGVzdEZpcnN0UGFzcygpIHtcclxuICAgICAgICBsZXQgd29ya2Zsb3c9d2luZG93LmFwcC5ncmFwaC5zZXJpYWxpemUoKVxyXG4gICAgICAgIHdvcmtmbG93PUpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkod29ya2Zsb3cpKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHdvcmtmbG93KVxyXG4gICAgICAgIGxldCB3cz1uZXcgd29ya2Zsb3dTdHJ1Y3R1cmVQYXNzKHdvcmtmbG93KVxyXG4gICAgICAgIHdzLmR1cGxpY2F0ZUdyb3VwV2l0aE5vZGVzQW5kTGlua3MoXCJjb250cm9sbmV0W11cIilcclxuICAgICAgICBjb25zb2xlLmxvZyh3b3JrZmxvdylcclxuICAgICAgICB3aW5kb3cuYXBwLmxvYWRHcmFwaERhdGEod29ya2Zsb3cpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2hvd1N0cnVjdHVyZSgpIHtcclxuICAgICAgICBsZXQgd29ya2Zsb3c9d2luZG93LmFwcC5ncmFwaC5zZXJpYWxpemUoKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHdvcmtmbG93KVxyXG4gICAgfVxyXG4gICAgYXN5bmMgZnVuY3Rpb24gc2F2ZVdvcmtmbG93KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZVdvcmtmbG93XCIpO1xyXG4gICAgICAgIGxldCBncmFwaCA9IHdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMgaXMgc2NlbmFyaW8ganVzdCBhZnRlciBsb2FkaW5nIHdvcmtmbG93IGFuZCBub3Qgc2F2ZSBpdFxyXG4gICAgICAgIGlmIChsb2FkZWR3b3JrZmxvdyAmJiBsb2FkZWR3b3JrZmxvdy5leHRyYS53b3Jrc3BhY2VfaW5mbykge1xyXG4gICAgICAgICAgICBncmFwaC5leHRyYSA9IGxvYWRlZHdvcmtmbG93LmV4dHJhO1xyXG4gICAgICAgICAgICAkbWV0YWRhdGEgPSBsb2FkZWR3b3JrZmxvdy5leHRyYS5neXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2FkZWR3b3JrZmxvdyA9IG51bGw7XHJcblxyXG4gICAgICAgIGxldCBmaWxlX3BhdGggPSBncmFwaC5leHRyYT8ud29ya3NwYWNlX2luZm8/Lm5hbWUgfHwgXCJuZXcuanNvblwiO1xyXG4gICAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGZpbGVfcGF0aCA9IG5hbWVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFmaWxlX3BhdGguZW5kc1dpdGgoJy5qc29uJykpIHtcclxuICAgICAgICAgICAgLy8gQWRkIC5qc29uIGV4dGVuc2lvbiBpZiBpdCBkb2Vzbid0IGV4aXN0XHJcbiAgICAgICAgICAgIGZpbGVfcGF0aCArPSAnLmpzb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJG1ldGFkYXRhICYmIGdyYXBoLmV4dHJhKSBncmFwaC5leHRyYS5neXJlID0gJG1ldGFkYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBncmFwaEpzb24gPSBKU09OLnN0cmluZ2lmeShncmFwaCk7XHJcbiAgICAgICAgYXdhaXQgdXBkYXRlRmlsZShmaWxlX3BhdGgsIGdyYXBoSnNvbik7XHJcblxyXG4gICAgICAgIC8vIHRvZG86Z2V0IHdvcmtmbG93IGZvbSBjb21meVVJXHJcbiAgICAgICAgLy8gJG1ldGFkYXRhIHNob3VsZCBhbHJlYWR5IHBvaW50IHRvIGV4dHJhcy5neXJlIC0gc28gbm90aGluZyB0byBkbyBoZXJlXHJcbiAgICAgICAgLy8gMS4gbWFrZSBzZXJ2ZXIgcmVxdWVzdCwgd2l0aCAgbmFtZSBhbmQgZnVsbCB3b3JrZmxvdywgc3RvcmUgaXQgb24gZmlsZXN5c3RlbSB0aGVyZVxyXG4gICAgICAgIC8vIDIuIHNldCB1bnNhdmVkIHN0YXRlIHRvIGZhbHNlXHJcbiAgICAgICAgLy8gMy4gbG9hZCBsaXN0IG9mIGFsbCB3b3JrZmxvd3MgYWdhaW5cclxuICAgICAgICBhbGVydChcInNhdmUgd29ya2Zsb3cgXCIgKyBuYW1lKSAvLyByZW1vdmVcclxuICAgICAgICBzYXZlRGV2ZWxvcEpzb24oZ3JhcGgpO1xyXG4gICAgICAgIGF3YWl0IGxvYWRMaXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gc2F2ZURldmVsb3BKc29uKGdyYXBoKSB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hcHAuZ3JhcGhUb1Byb21wdCgpLnRoZW4ocD0+IHtcclxuICAgICAgICAgICAgY29uc3QgYXBpcmF3anNvbiA9IEpTT04uc3RyaW5naWZ5KHAub3V0cHV0LCBudWxsLCAyKTsgLy8gY29udmVydCB0aGUgZGF0YSB0byBhIEpTT04gc3RyaW5nXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwianNvbiBmb3IgZGV2ZWxsb3AhIVwiLGFwaXJhd2pzb24pO1xyXG4gICAgICAgICAgICAgY3JlYXRlR3lyZUFwaUpzb24oZ3JhcGgsYXBpcmF3anNvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVHeXJlQXBpSnNvbihncmFwaCxhcGlyYXdqc29uKXtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgICBsZXQgYXBpcmF3anNvbm9iaiA9ICBKU09OLnBhcnNlKGFwaXJhd2pzb24pO1xyXG4gICAgICAgIGxldCBhbGxkYXRhID0gSlNPTi5zdHJpbmdpZnkoe2dyYXBoLGFwaXJhd2pzb25vYmp9KTtcclxuICAgICAgICBsZXQgZmlsZV9wYXRoID0gZ3JhcGguZXh0cmE/LndvcmtzcGFjZV9pbmZvPy5uYW1lIHx8IFwibmV3Lmpzb25cIjtcclxuICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICBmaWxlX3BhdGggPSBuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZmlsZV9wYXRoLmVuZHNXaXRoKCcuanNvbicpKSB7XHJcbiAgICAgICAgICAgIC8vIEFkZCAuanNvbiBleHRlbnNpb24gaWYgaXQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgICBmaWxlX3BhdGggKz0gJy5qc29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBkYXRlQXBpRmlsZShmaWxlX3BhdGgsYWxsZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQXBpRmlsZShmaWxlX3BhdGgsanNvbkRhdGEpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL3dvcmtzcGFjZS91cGRhdGVfYXBpX2pzb25fZmlsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlX3BhdGg6IGZpbGVfcGF0aCxcclxuICAgICAgICAgICAgICAgICAgICBqc29uX3N0cjoganNvbkRhdGEsXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHNhdmluZyB3b3JrZmxvdyAuanNvbiBmaWxlOiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNhdmluZyB3b3Jrc3BhY2U6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUZpbGUoZmlsZV9wYXRoLCBqc29uRGF0YSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvd29ya3NwYWNlL3VwZGF0ZV9qc29uX2ZpbGVcIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZV9wYXRoOiBmaWxlX3BhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAganNvbl9zdHI6IGpzb25EYXRhLFxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBzYXZpbmcgd29ya2Zsb3cgLmpzb24gZmlsZTogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzYXZpbmcgd29ya3NwYWNlOlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRUYWcoKSB7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RlZFRhZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEudGFncykgJG1ldGFkYXRhLnRhZ3MgPSBbXVxyXG4gICAgICAgICRtZXRhZGF0YS50YWdzLnB1c2goc2VsZWN0ZWRUYWcpXHJcbiAgICAgICAgJG1ldGFkYXRhID0gJG1ldGFkYXRhXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlVGFnKHRhZykge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gJG1ldGFkYXRhLnRhZ3MuaW5kZXhPZih0YWcpO1xyXG4gICAgICAgICRtZXRhZGF0YS50YWdzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgJG1ldGFkYXRhID0gJG1ldGFkYXRhXHJcbiAgICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdiBpZD1cIndvcmtmbG93TWFuYWdlclwiIGNsYXNzPVwid29ya2Zsb3dNYW5hZ2VyXCIgc3R5bGU9XCJsZWZ0OiB7bGVmdH1weDsgdG9wOiB7dG9wfXB4O1wiPlxyXG4gIDxkaXYgY2xhc3M9XCJtaW5pTWVudVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW92ZUljb25cIj5cclxuICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJtb3ZlXCIgb246bW91c2Vkb3duPXtvbk1vdXNlRG93bn0+PC9JY29uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgeyNpZiAhbmFtZX1cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiR3lyZVwiIGNsYXNzPVwiZ3lyZUxvZ29cIj48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2tcIj5HeXJlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19IHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2tcIj57bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrXCIgY2xhc3M9XCJzYXZlSWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwic2F2ZVwiIG9uOmNsaWNrPXsoZSkgPT4ge3NhdmVXb3JrZmxvdygpfX0gPjwvSWNvbj4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICB7I2lmICFmb2xkT3V0fVxyXG4gICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9sZG91dFwiIG9uOmNsaWNrPXsoZSkgPT4ge2ZvbGRPdXQ9dHJ1ZX19PlxyXG4gICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImRvd25cIj48L0ljb24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZm9sZE91dH1cclxuIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7IHRlc3RGaXJzdFBhc3MoKX0gfT5UZXN0PC9idXR0b24+XHJcbiA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4geyBzaG93U3RydWN0dXJlKCl9IH0+V0YgSlNPTjwvYnV0dG9uPlxyXG5cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb2xkb3V0XCIgb246Y2xpY2s9eyhlKSA9PiB7Zm9sZE91dD1mYWxzZX19PlxyXG4gICAgICAgICAgICA8SWNvbiBuYW1lPVwidXBcIj48L0ljb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1haW5cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdE1lbnVcIj5cclxuICAgICAgICAgICAgeyNrZXkgc3RhdGV9XHJcbiAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwibGlzdFwiIHtzdGF0ZX0gb246Y2xpY2s9eyAoZSkgPT4gIHtzdGF0ZT1cImxpc3RcIiB9fSA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEgJiYgJG1ldGFkYXRhLmxhc3RNb2RpZmllZH1cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwicHJvcGVydGllc1wiIHtzdGF0ZX0gb246Y2xpY2s9e2FzeW5jIChlKSA9PiAge3N0YXRlPVwicHJvcGVydGllc1wiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJlZGl0Rm9ybVwiIHtzdGF0ZX0gb246Y2xpY2s9e2FzeW5jIChlKSA9PiAge3N0YXRlPVwiZWRpdEZvcm1cIiB9fSAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZWRpdFJ1bGVzXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7c3RhdGU9XCJlZGl0UnVsZXNcIiB9fSAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgIHs6ZWxzZX1cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwicHJvcGVydGllc1wiIGRlYWN0aXZhdGU9XCJkZWFjdGl2YXRlXCIgID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImVkaXRGb3JtXCIgICBkZWFjdGl2YXRlPVwiZGVhY3RpdmF0ZVwiID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImVkaXRSdWxlc1wiICAgZGVhY3RpdmF0ZT1cImRlYWN0aXZhdGVcIj48L0ljb24+ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgey9rZXl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuXHJcbiAgICAgICAgICAgIHsjaWYgc3RhdGUgPT09IFwicHJvcGVydGllc1wifVxyXG4gICAgICAgICAgICAgICAgPGgxPldvcmtmbG93IFByb3BlcnRpZXM8L2gxPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5hbWVcIj5OYW1lOjwvbGFiZWw+PGlucHV0IG5hbWU9XCJuYW1lXCIgdHlwZT1cInRleHRcIiBiaW5kOnZhbHVlPXtuYW1lfSBjbGFzcz1cInRleHRfaW5wdXRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdlZGl0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ1RpdGxlXCI+Q2xpY2sgb24gYSBUYWcgdG8gcmVtb3ZlIGl0PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEudGFnc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2VhY2ggJG1ldGFkYXRhLnRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdcIiBvbjpjbGljaz17KGUpID0+IHtyZW1vdmVUYWcodGFnKX19Pnt0YWd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInRhZ3NlbGVjdFwiIGJpbmQ6dmFsdWU9e3NlbGVjdGVkVGFnfSBvbjpjaGFuZ2U9eyhlKSA9PiB7YWRkVGFnKCl9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZCB2YWx1ZT1cIlwiPkFkZCBUYWcuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEudGFncyAmJiAhJG1ldGFkYXRhLnRhZ3MuaW5jbHVkZXModGFnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwie3RhZ31cIj57dGFnfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibGljZW5zZVwiPkxpY2Vuc2U6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJpbnB1dCBsaWNlbnNlXCIgbmFtZT1cImxpY2Vuc2VcIiBiaW5kOnZhbHVlPXskbWV0YWRhdGEubGljZW5zZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZCB2YWx1ZT1cIlwiPlNlbGVjdC4uLjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQgdmFsdWU9XCJ5ZXNfY29tbWVyY2lhbFwiPkNvbW1lcmNpYWwgYWxsb3dlZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQgdmFsdWU9XCJub25fY29tbWVyY2lhbFwiPk5vbiBDb21tZXJjaWFsPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZCB2YWx1ZT1cIm5lZWRzX2xpY2Vuc2VcIj5OZWVkcyBsaWNlbnNlIGZvciBDb21tZXJjaWFsIHVzZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXRMaW5lXCIgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJkZXNjcmlwdGlvblwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246dG9wXCI+RGVzY3JpcHRpb246PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJ0ZXh0X2lucHV0XCIgYmluZDp2YWx1ZT17JG1ldGFkYXRhLmRlc2NyaXB0aW9ufT48L3RleHRhcmVhPiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dExpbmVcIiA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNhdGVnb3J5XCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3BcIj5DYXRlZ29yeSAob25seSBsYXllciBtZW51KTo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwidGV4dF9pbnB1dFwiIGJpbmQ6dmFsdWU9eyRtZXRhZGF0YS5jYXRlZ29yeX0+ICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcImVkaXRGb3JtXCJ9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8Rm9ybUJ1aWxkZXI+PC9Gb3JtQnVpbGRlcj5cclxuICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgeyNpZiBzdGF0ZSA9PT0gXCJlZGl0UnVsZXNcIn1cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHhcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsjaWYgJG1ldGFkYXRhLmZvcm1zICYmICRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0ICYmICRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzfVxyXG4gICAgICAgICAgICAgICAgICAgIDxSdWxlRWRpdG9yPjwvUnVsZUVkaXRvcj5cclxuICAgICAgICAgICAgICAgIHs6ZWxzZX1cclxuICAgICAgICAgICAgICAgICAgICBQbGVhc2UgZGVmaW5lIGEgZm9ybSBmaXJzdFxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgeyNpZiBzdGF0ZSA9PT0gXCJsaXN0XCJ9XHJcbiAgICAgICAgICAgICAgICA8aDE+V29ya2Zsb3cgTGlzdDwvaDE+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIHsjZWFjaCB0YWdzIGFzIHRhZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjpjbGljaz17IChlKSA9PiB7IGFjdGl2YXRlZFRhZ3NbdGFnXT0hYWN0aXZhdGVkVGFnc1t0YWddOyR3b3JrZmxvd0xpc3Q9JHdvcmtmbG93TGlzdH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczpvbj17YWN0aXZhdGVkVGFnc1t0YWddfT57dGFnfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgeyNpZiB3b3JrZmxvd0xpc3R9XHJcbiAgICAgICAgICAgICAgICAgICAgeyNlYWNoICR3b3JrZmxvd0xpc3QgYXMgd29ya2Zsb3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgaXNWaXNpYmxlKHdvcmtmbG93KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid29ya2Zsb3dFbnRyeVwiIG9uOmNsaWNrPXtsb2FkV29ya2Zsb3cod29ya2Zsb3cpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7d29ya2Zsb3cubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFzdF9jaGFuZ2VkXCI+e3dvcmtmbG93Lmxhc3RNb2RpZmllZFJlYWRhYmxlfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgd29ya2Zsb3cuZ3lyZSAmJiB3b3JrZmxvdy5neXJlLnRhZ3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2VhY2ggd29ya2Zsb3cuZ3lyZS50YWdzIGFzIHRhZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnXCI+e3RhZ308L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcblxyXG4gICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICB7L2lmfSA8IS0tIGZvbGRPdXQgLS0+XHJcbjwvZGl2PlxyXG48TWFwcGluZ3M+PC9NYXBwaW5ncz5cclxuPHN2ZWx0ZTp3aW5kb3cgb246bW91c2V1cD17b25Nb3VzZVVwfSBvbjptb3VzZW1vdmU9e29uTW91c2VNb3ZlfS8+XHJcbiBcclxuPHN0eWxlPlxyXG4gICAgQGltcG9ydCAnZGlzdC9idWlsZC9neXJlc3R5bGVzLmNzcyc7XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWlkSSxRQUFRLDJCQUEyQiJ9 */");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    // (337:16) {:else}
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
    	icon.$on("click", /*click_handler_2*/ ctx[22]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(/*name*/ ctx[3]);
    			t1 = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			set_style(div0, "display", "inline-block");
    			add_location(div0, file, 338, 20, 12122);
    			set_style(div1, "display", "inline-block");
    			attr_dev(div1, "class", "saveIcon");
    			add_location(div1, file, 339, 20, 12223);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(icon, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_1*/ ctx[21], false, false, false, false);
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
    		source: "(337:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (333:16) {#if !name}
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
    			add_location(div, file, 335, 20, 11920);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[20], false, false, false, false);
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
    		source: "(333:16) {#if !name}",
    		ctx
    	});

    	return block;
    }

    // (347:4) {#if !foldOut}
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
    			add_location(div, file, 348, 12, 12577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_3*/ ctx[23], false, false, false, false);
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
    		source: "(347:4) {#if !foldOut}",
    		ctx
    	});

    	return block;
    }

    // (353:4) {#if foldOut}
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
    			add_location(button0, file, 353, 1, 12727);
    			add_location(button1, file, 354, 1, 12789);
    			attr_dev(div0, "class", "foldout");
    			add_location(div0, file, 357, 8, 12929);
    			attr_dev(div1, "class", "leftMenu");
    			add_location(div1, file, 361, 8, 13075);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file, 375, 8, 13939);
    			attr_dev(div3, "class", "main");
    			add_location(div3, file, 360, 8, 13047);
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
    					listen_dev(button0, "click", /*click_handler_4*/ ctx[24], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_5*/ ctx[25], false, false, false, false),
    					listen_dev(div0, "click", /*click_handler_6*/ ctx[26], false, false, false, false)
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
    		source: "(353:4) {#if foldOut}",
    		ctx
    	});

    	return block;
    }

    // (369:16) {:else}
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
    		source: "(369:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (365:16) {#if $metadata && $metadata.lastModified}
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

    	icon0.$on("click", /*click_handler_8*/ ctx[28]);

    	icon1 = new Icon({
    			props: {
    				name: "editForm",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon1.$on("click", /*click_handler_9*/ ctx[29]);

    	icon2 = new Icon({
    			props: {
    				name: "editRules",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon2.$on("click", /*click_handler_10*/ ctx[30]);

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
    		source: "(365:16) {#if $metadata && $metadata.lastModified}",
    		ctx
    	});

    	return block;
    }

    // (363:12) {#key state}
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

    	icon.$on("click", /*click_handler_7*/ ctx[27]);
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
    		source: "(363:12) {#key state}",
    		ctx
    	});

    	return block;
    }

    // (378:12) {#if state === "properties"}
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
    			add_location(h1, file, 378, 16, 14022);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file, 379, 16, 14068);
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "text_input");
    			add_location(input0, file, 379, 47, 14099);
    			attr_dev(div0, "class", "tagTitle");
    			add_location(div0, file, 381, 20, 14228);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 382, 20, 14305);
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file, 391, 24, 14836);
    			attr_dev(select0, "class", "tagselect");
    			if (/*selectedTag*/ ctx[6] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[33].call(select0));
    			add_location(select0, file, 390, 20, 14729);
    			attr_dev(div2, "class", "tagedit");
    			add_location(div2, file, 380, 16, 14185);
    			attr_dev(label1, "for", "license");
    			add_location(label1, file, 399, 16, 15220);
    			option1.selected = true;
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file, 401, 20, 15373);
    			option2.selected = true;
    			option2.__value = "yes_commercial";
    			option2.value = option2.__value;
    			add_location(option2, file, 402, 20, 15439);
    			option3.selected = true;
    			option3.__value = "non_commercial";
    			option3.value = option3.__value;
    			add_location(option3, file, 403, 20, 15528);
    			option4.selected = true;
    			option4.__value = "needs_license";
    			option4.value = option4.__value;
    			add_location(option4, file, 404, 20, 15613);
    			attr_dev(select1, "class", "input license");
    			attr_dev(select1, "name", "license");
    			if (/*$metadata*/ ctx[7].license === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[35].call(select1));
    			add_location(select1, file, 400, 16, 15275);
    			attr_dev(label2, "for", "description");
    			set_style(label2, "vertical-align", "top");
    			add_location(label2, file, 407, 20, 15784);
    			attr_dev(textarea, "class", "text_input");
    			add_location(textarea, file, 408, 20, 15878);
    			attr_dev(div3, "class", "inputLine");
    			add_location(div3, file, 406, 16, 15738);
    			attr_dev(label3, "for", "category");
    			set_style(label3, "vertical-align", "top");
    			add_location(label3, file, 411, 20, 16061);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "text_input");
    			add_location(input1, file, 412, 20, 16167);
    			attr_dev(div4, "class", "inputLine");
    			add_location(div4, file, 410, 16, 16015);
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
    			select_option(select1, /*$metadata*/ ctx[7].license, true);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, label2);
    			append_dev(div3, t17);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*$metadata*/ ctx[7].description);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, label3);
    			append_dev(div4, t20);
    			append_dev(div4, input1);
    			set_input_value(input1, /*$metadata*/ ctx[7].category);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[31]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[33]),
    					listen_dev(select0, "change", /*change_handler*/ ctx[34], false, false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[35]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[36]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[37])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*name*/ 8 && input0.value !== /*name*/ ctx[3]) {
    				set_input_value(input0, /*name*/ ctx[3]);
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
    						each_blocks[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty[0] & /*selectedTag, tags*/ 576) {
    				select_option(select0, /*selectedTag*/ ctx[6]);
    			}

    			if (dirty[0] & /*$metadata*/ 128) {
    				select_option(select1, /*$metadata*/ ctx[7].license);
    			}

    			if (dirty[0] & /*$metadata*/ 128) {
    				set_input_value(textarea, /*$metadata*/ ctx[7].description);
    			}

    			if (dirty[0] & /*$metadata*/ 128 && input1.value !== /*$metadata*/ ctx[7].category) {
    				set_input_value(input1, /*$metadata*/ ctx[7].category);
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
    		source: "(378:12) {#if state === \\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (384:24) {#if $metadata.tags}
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
    			if (dirty[0] & /*removeTag, $metadata*/ 524416) {
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
    		source: "(384:24) {#if $metadata.tags}",
    		ctx
    	});

    	return block;
    }

    // (386:28) {#each $metadata.tags as tag}
    function create_each_block_4(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[52] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_11(...args) {
    		return /*click_handler_11*/ ctx[32](/*tag*/ ctx[52], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 386, 32, 14548);
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
    			if (dirty[0] & /*$metadata*/ 128 && t_value !== (t_value = /*tag*/ ctx[52] + "")) set_data_dev(t, t_value);
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
    		source: "(386:28) {#each $metadata.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (394:28) {#if $metadata.tags && !$metadata.tags.includes(tag)}
    function create_if_block_9(ctx) {
    	let option;
    	let t_value = /*tag*/ ctx[52] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*tag*/ ctx[52];
    			option.value = option.__value;
    			add_location(option, file, 394, 32, 15043);
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
    		source: "(394:28) {#if $metadata.tags && !$metadata.tags.includes(tag)}",
    		ctx
    	});

    	return block;
    }

    // (393:24) {#each tags as tag}
    function create_each_block_3(ctx) {
    	let show_if = /*$metadata*/ ctx[7].tags && !/*$metadata*/ ctx[7].tags.includes(/*tag*/ ctx[52]);
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
    			if (dirty[0] & /*$metadata*/ 128) show_if = /*$metadata*/ ctx[7].tags && !/*$metadata*/ ctx[7].tags.includes(/*tag*/ ctx[52]);

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
    		source: "(393:24) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (416:12) {#if state === "editForm"}
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
    			add_location(div, file, 416, 16, 16355);
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
    		source: "(416:12) {#if state === \\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (420:12) {#if state === "editRules"}
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
    			add_location(div, file, 420, 16, 16513);
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
    		source: "(420:12) {#if state === \\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    // (424:16) {:else}
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
    		source: "(424:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (422:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}
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
    		source: "(422:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}",
    		ctx
    	});

    	return block;
    }

    // (428:12) {#if state === "list"}
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
    			add_location(h1, file, 428, 16, 16866);
    			attr_dev(div, "class", "tags");
    			add_location(div, file, 429, 16, 16906);
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
    		source: "(428:12) {#if state === \\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (431:20) {#each tags as tag}
    function create_each_block_2(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[52] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_12(...args) {
    		return /*click_handler_12*/ ctx[38](/*tag*/ ctx[52], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[52]]);
    			add_location(div, file, 432, 24, 17073);
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

    			if (dirty[0] & /*activatedTags, tags*/ 544) {
    				toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[52]]);
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
    		source: "(431:20) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (438:16) {#if workflowList}
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
    		source: "(438:16) {#if workflowList}",
    		ctx
    	});

    	return block;
    }

    // (440:24) {#if isVisible(workflow)}
    function create_if_block_3(ctx) {
    	let div2;
    	let t0_value = /*workflow*/ ctx[49].name + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2_value = /*workflow*/ ctx[49].lastModifiedReadable + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let mounted;
    	let dispose;
    	let if_block = /*workflow*/ ctx[49].gyre && /*workflow*/ ctx[49].gyre.tags && create_if_block_4(ctx);

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
    			add_location(div0, file, 443, 32, 17733);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 444, 32, 17830);
    			attr_dev(div2, "class", "workflowEntry");
    			add_location(div2, file, 441, 28, 17589);
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
    						if (is_function(/*loadWorkflow*/ ctx[15](/*workflow*/ ctx[49]))) /*loadWorkflow*/ ctx[15](/*workflow*/ ctx[49]).apply(this, arguments);
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
    			if (dirty[0] & /*$workflowList*/ 256 && t0_value !== (t0_value = /*workflow*/ ctx[49].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*$workflowList*/ 256 && t2_value !== (t2_value = /*workflow*/ ctx[49].lastModifiedReadable + "")) set_data_dev(t2, t2_value);

    			if (/*workflow*/ ctx[49].gyre && /*workflow*/ ctx[49].gyre.tags) {
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
    		source: "(440:24) {#if isVisible(workflow)}",
    		ctx
    	});

    	return block;
    }

    // (446:36) {#if workflow.gyre && workflow.gyre.tags}
    function create_if_block_4(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*workflow*/ ctx[49].gyre.tags;
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
    				each_value_1 = /*workflow*/ ctx[49].gyre.tags;
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
    		source: "(446:36) {#if workflow.gyre && workflow.gyre.tags}",
    		ctx
    	});

    	return block;
    }

    // (447:40) {#each workflow.gyre.tags as tag}
    function create_each_block_1(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[52] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 447, 44, 18048);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 256 && t_value !== (t_value = /*tag*/ ctx[52] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(447:40) {#each workflow.gyre.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (439:20) {#each $workflowList as workflow}
    function create_each_block(ctx) {
    	let show_if = /*isVisible*/ ctx[14](/*workflow*/ ctx[49]);
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
    			if (dirty[0] & /*$workflowList*/ 256) show_if = /*isVisible*/ ctx[14](/*workflow*/ ctx[49]);

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
    		source: "(439:20) {#each $workflowList as workflow}",
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
    	mappings = new Mappings({ $$inline: true });

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
    			add_location(div0, file, 327, 12, 11580);
    			attr_dev(div1, "class", "title");
    			add_location(div1, file, 330, 12, 11706);
    			attr_dev(div2, "class", "miniMenu");
    			add_location(div2, file, 326, 2, 11544);
    			attr_dev(div3, "id", "workflowManager");
    			attr_dev(div3, "class", "workflowManager");
    			set_style(div3, "left", /*left*/ ctx[0] + "px");
    			set_style(div3, "top", /*top*/ ctx[1] + "px");
    			add_location(div3, file, 325, 0, 11452);
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

    async function updateApiFile(file_path, jsonData) {
    	try {
    		const response = await fetch("/workspace/update_api_json_file", {
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
    		if (!$metadata.tags) set_store_value(metadata, $metadata.tags = [], $metadata);

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

    	function testFirstPass() {
    		let workflow = window.app.graph.serialize();
    		workflow = JSON.parse(JSON.stringify(workflow));
    		console.log(workflow);
    		let ws = new workflowStructurePass(workflow);
    		ws.duplicateGroupWithNodesAndLinks("controlnet[]");
    		console.log(workflow);
    		window.app.loadGraphData(workflow);
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

    		saveDevelopJson(graph);
    		await loadList();
    	}

    	async function saveDevelopJson(graph) {
    		window.app.graphToPrompt().then(p => {
    			const apirawjson = JSON.stringify(p.output, null, 2); // convert the data to a JSON string
    			console.log("json for devellop!!", apirawjson);
    			createGyreApiJson(graph, apirawjson);
    		});
    	}

    	function createGyreApiJson(graph, apirawjson) {
    		debugger;
    		let apirawjsonobj = JSON.parse(apirawjson);
    		let alldata = JSON.stringify({ graph, apirawjsonobj });
    		let file_path = graph.extra?.workspace_info?.name || "new.json";

    		if (name) {
    			file_path = name;
    		}

    		if (!file_path.endsWith('.json')) {
    			// Add .json extension if it doesn't exist
    			file_path += '.json';
    		}

    		updateApiFile(file_path, alldata);
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
    		$$invalidate(9, tags);
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

    	$$self.$capture_state = () => ({
    		FormBuilder,
    		RuleEditor,
    		Mappings,
    		writable,
    		onMount,
    		metadata,
    		Icon,
    		workflowStructurePass,
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
    		saveDevelopJson,
    		createGyreApiJson,
    		updateApiFile,
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
    		testFirstPass,
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
    		click_handler_9,
    		click_handler_10,
    		input0_input_handler,
    		click_handler_11,
    		select0_change_handler,
    		change_handler,
    		select1_change_handler,
    		textarea_input_handler,
    		input1_input_handler,
    		click_handler_12
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
