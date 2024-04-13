
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

    let layer_image_preview="data:image/jpeg;base64,/9j/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////7gAhQWRvYmUAZAAAAAABAwAQAwIDBgAAAAAAAAAAAAAAAP/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAEHBwcNDA0YEBAYFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8IAEQgAkgCrAwERAAIRAQMRAf/EANsAAAICAwEBAAAAAAAAAAAAAAIDAAEFBgcECAEBAAIDAQAAAAAAAAAAAAAAAAECAwQFBhAAAQQCAQIGAgMBAQAAAAAAAQACAwQRBQYQEiAwIUETBzEUQCIVYDIRAAIBAgQDBQMIBwMMAwAAAAECAxIEABEiBSEyEzFCUiMGQVEzIDDwYYFyghQQccFikkMVQNEHYJGhsaKywtJTY3MkkzQlEgABAwICBAsGBAcAAAAAAAAAARECIRIxIhAw8KIgQEFRYTJCUmJyA3GhgpKywmCBsdLB0fETI5Oz/9oADAMBAQIRAxEAAAD5imLLLIUUUWQhExEKTCEIiFkIWEQoEohCy7Q+9fPivREUQsiYRMCRYRAQSpSqSze5rdL9Dx/fta+s8/f5353rePFlpETZEWQoYEWCCCUNh1HJj6T3eXhexzFJCY8uDNzjg9fUuXuxMIWWUOLICLKNm0dnqXI2d2rIes4y+pz8N3OZQiR1tp+jtcy4HZ8WDJC5XCDyAgB1t03l7PVvL9DHbdMdao7+Hn/q+H7c9N0wZtj3dZe/p4/c18NZzXg9fTOV0LmpRMHggGx6ebtXnNnV96KyU9OG+MvTdOJ0dV9RyMR1dPPYsvQdbZPoaW/Zsendnm6X1NHVufvcs872PDiywehZsuKev+U6HgzU2TXnD5Go9Gg1ZGL+GtMsyYzs6G46e1k8j0d7kbdkodq1s4ubdDU+evJ+i84xAS9ye+8zNr+lda2X1MmPmdl1N0tecXuauCtCcmH02tks0Tcw5HPrdL6OLZrxxK1vnHDkkLkEisdeOv4Le/i7GA18jcOXKY757XysjJ79VpvR1n4I9VNmpysY8l2udzX0ejztIUDAYSxtz7vReNvl0Dh5dW5ezmtfYPJbI8va2Xm5m5cbFtF6GDM6+b2+n53CPT8vC1JpKsYKk1HY+5+Q/JDcj2zHWeTlxfD2rwbOV0801tj12x5nXtr/AH9HAen5/M97CupWOU45VjLqRWWWOtDrn5Ibcdx3jompbavN7qefteC05OmXM9Xn8h9NparkqFZXjKoTSVY5GpMGSZMNsbeG3MyDuO0Zqjp3D236mXHdTByjra3liQqXQnGXSV0BWRgMQYcjkdjLjvDLjvBXXM2qKarK6lYyqFVBSw1VAYGgi5EFIrDsK4rRdx2WUBUqkroXQFQxIwqEHIstMLlZdoqyXFYdoIqAQXSQoCqoVCiJh6EQibIQGYXKpXYVhEgMBhVFFQhCJh6EQtMLBFxCrBLsOVllQqFVSUqkoRMP/9oACAECAAEFAPK/HQLBP8MN7l8MrU7KLSP4GVlV6T5FXpRRotBVrXseJq74yVnzfd72tEM0eKuzb3Nc0oeiCkha9Wta5iP9fLysK5sYoE646ZRXi0x9rlXsuaWyAh72rPcHMyrOuZIJ67oishAE+N72sVq656sUZS+kW5t/1dqrRikH9iJntTtg5ir7LuX+i0KKw14khbILetLU4FEEDwEq3fjiUt90jjY7W4a4NpDvuVmOZ2ujVLZB7Y7AU7Q5td+FG/uUbnMNfY9ya4FWte2RTQPjPgsksYRlxrteP7QGeQyBtktbYtQtUEkVgS02wmtbLzHOHMc9oVWySa72gNfhGVzFW2faLIjkj8BAKsUQ0saVgFSwenygtJaAL5rtqXXTMlDY3fNK0MkLg6YObDckjP8ApuChtse1zmkGR3bjwYXoVPTa8TV3tLSAJIiEIsgRhfsiMwPa98OwjkHzRuQacftmJtmz8ioU5XFsWE4LCx1CAQCkhbIrNB0aexzE4uKczLXN9JGelWt3m0WgQumlDqT3LV6HD2sDQR4AgggggnNVrXdycDGJI8tMBa6WAl/d2Nr0yXxwSyqtQZGsFFFFHwAoFAoFNOEFZqtmbPSfCrFkhpjL2iFrTW1RkEULY+mUPREolZWeuVlArKBQKaU5oereqJd/mzd1TWtYRgLKJRKJRKJ8WUCgUCgVlZWV6IlE5RciV3IlZ6Z8eUCgUCsrKyiVlZRKysrKz5GVlZQKDl3LuXcu5FyJWfMysoFZWVlZWUSs/wAU+R//2gAIAQMAAQUA8r1QXcj/AA3OAQlaU0Aofnz8FFTWmMU1l7kHOCr3HNUUzXrKGT5v4XqVIHKxTKcCF+UfRMkLFXutcvU+YVFXc9fD2J0QLXlwU0AILCCGlf8AlByr3XMUczXr8rKPj7e5RwhqjlappMqI9ytV+6P1T4QU2o16mo9qNJykiLFFI5ir3g5NwUPFHCXL4wERlEuCMpChmwWOBE1chOjUDi10ze5Pb2pzWuE1IgDOa91zTDM1/haPVsnaO7tXd3JpTmd6ZWke2Vj4iJi4y1mtDmEPaPWaEBTtKILkY2FTUvWv3tf4RJkAgrCagzCa84kjEhngDFh5GASThepUkIcnVsqSEtTAQhE3PgKymuTXoOQKD0HlCMuD2EAwEL4imRgI1u5MgDFYc0rHk5QemOTQEHFMByG+sknamMTmtCZM0C3fLkfXy8pr8JsmVEV8qjlQb3l8oAlexilm70RlHzWv7VFKCg1BydI4iSzhF2VjoPNIQJCislCcFS2S7+FjrjoP+h//2gAIAQEAAQUAQAQHUlHoPFnwZWQvRenTCAWEUeo6NaXF+vvsYfTyffCA6lHqFx/ie03T9NxbV6mJ0K5DwejsVs9Vf1tjPXPg9wgsIlFEoFVqtizPxH6avyxxcR27Ne6PBLPQsWz1evvxcj4BdoDwDp7gdCiUSvyuJ8B3PIDxfjup40hag/XH2rxupqrnIPrvcV5qb2KDW2rMzWyQSR2TE7knA9dtBttNsdVZ6BBe+EUSiVUp2rtniH1tq6cFbeautr9lVNXV8ZnsxRc9p19kxvwgUtxdqN1Gw3V3Q3Whkep4y7dDdaHZae3sdVS2Fbkv1zfoA5CCwvdEpxXEOA7fk02q+v8AT6PX2dVHc3NCDZ1W/wC/KzW8e3+1/bbar7B2y4/Hr5rFBkS0FrbVpOObuXSs196LTbu5co7PVbz68DK7oVyjgGt263Gi2ensr3KcV9dcdrb/AJJWdRaavJbuuuPl1PIaun18mhO6qS8m2PF9NyyePda3f8TbreW7m8+3VbQhgmjZsNJsoxf2Gri/V1W3Gvmv1J5Yq7dbbg5D9da68L3Godm7Y1W1Nh7kolaHe7PRbjjW54R9ojk1exr9nJJaoDWcohm2e50uvZfhkMULeN1OQbrln15W1Emiqcg294soMuRtZ81HYbuioue0LVLXfYWzpVtPsaWz1ushuRn7h+/9IJznPuSspoUWWu4t9s63cVN/ot3xYzyzWJ6e8dspRLCxlD9CvWijmvXeWbK/V0m4+vt3Uml4tyWkI2xua3Uzb69pNXa0+xfo9LV4/wA/+29tyKm5qIWPUlNTAmNTAuD/AGJvOKOi4zo+VRNm1ttkFGKlKNzPFa124kdb1W8iZJuJNlSr6sVmWt9T4lpzoN5d2N7lHNeJ8Apcn5NveS7V4CcE4L3BTUxMwmppWs2d/WXtXy/hv2E7lfDtpo9vp5pnPdbo/rVdnTmrULP7UnLN9HFouI/XOv3FXffZuu1FBxTinYTinFe4TUwphTXJrkCgQuC/btzT1NjxaGTTxtc+9qZ6cT9w3Z3aj7XHeCabnP2PyPmNwu9HOTnpzk5yJWfUBNTU0prk1ya5ByDlxbmG/wCLbKre+sOa1qvDQwbD7F43w6G/sLt+45yc4BOenPTnIuRK9wEAggUCmuTXIOQcu5BwXcEXJzk56c9OenORciemfUBYQQQKBQcg9B6EiD13ovTnpz056LkSiemVlDqOgK7kXr5EJEJF8qL056c9Fyyis9fbHXHQlFyL13oSISL5V3lFyLiiVnw+3gKcnI9Agh0PQ+L2/9oACAECAgY/ANVXRUpxPpKxVvKpVCnEnahg/mYwKY7dBXApr6jy/haJBmTd+oppzIPHDboGauroVMyvLuwKrb3RISSgko5k8JVco6HNpy5ZbdA0k+LsaKlOG6qyDen8/wC2Q0VlLn/uvItVr4l3ZUtuu9Ne9L/n2et1xnGRTNdLb2lGjt7R1rt7S5FGkjoPCsd/9CqFOE3Wl3TPhuiWoioO9q7xcu4InKJJcq90ZVz7dIyjvpeKjTT5f6j0MuVdugaSLwXQuxU6SuZBFjllzCX7o6rmj3esUjWPejEvVf8AUbXlUMR1pcMow6S95/k2810i5WWP5bvBbEeKHMZkGQtkgtMy9rtCximZe0NJFWRjapai/MVWJlVI7o6srDq0U28Q9NFr5eHSijSwGUfkHVKjyQeKOX+r1eztMk6WQ7N3a+0XGPmYtaSovaESSraJGOPYFVckZfbu6qpRHTboHx8I46lqIWqrJvF0skI/Dd8wyK6p3SuSMfNGZW+Xhrd+gnqeq7x6vd34lqYavvDw6wyxr7B3950DqJHrWi+p6nV26wienGCea77R1S6Xi17cphcgi2+4RcPqKpc/xCLJ0jt4TKjcQoNJB473V+kejfF/IeWaW3Qc343/AP/aAAgBAwIGPwDW04niY8WxUrgZV4hQaOG8Pj9RXS8RpYnRrebQvOVTNwKjoZqxKKU1NDMVoU0XJiV0UKjIMqDoo2o6DKVK10MNpbTgPFRkoMuBTgsNpqUEoyfmIi4Dcg8ceBQqYe4f09vlPFwmXgUG5B1HQoPoroopgpQdq61pFsdNViUtHVBERddQccZcR1KKcn2jIPxFxkKr+45uJ5aIUxK8SroaOH44/9oACAEBAQY/AP7LlkPf2D9fzeSio+4ccVvbSqnjZGA/1fNfT3fNBoV6VoDk904NP6l8bfq/iwBBHXcEAPcScZG9/wB1f1Yyy4+7DT2oFrd5E1AaHJ8Q9n31/FVgwXkRjcdh7VYe9W7D8x9n7PmEgt4nmmkOSRICzE/UB24S93Xp9UFHttud4zHNmc6WkEi9lL1jT95tWLuee1g25NujErWivWRCxWmkxhoo2yarovIktCdWihscB/m4ezPHH29mAe0Z/bhre4iE1uTwDjiv29xv1Ye62+q6shxZcvNQfWBzD61x+rt+V9n7Pli4Cm12pWHXv2UNklQVmijLK01GeqjSvfZMfn9th/NdEL+aadc/zELDJwAU7O3NV5UpwNw2aaQ2kqPHPt+QCW6y5x5QsA8lAD8UaKap+Zeny7jtFyl5tm8lre0O4bex6zW9sMlL1JEpcJ5ThxG8nL5NFCLDb7nFb7nAqqt20ElvDMqIABKWEaB3YaWWCKjvs/PgVDg3FSCCCDxBUjNSD7GB1YENtC80pBKxoKmIHEnIZ+zAOWTociGAOR9xVv7sSihTHMpEkWWQ4+0HtX8P+7hp7YC0vuJ6gGhyfGvsq8a/jqwbe+hMT9qN2qw96sOB+T9n7Pkpa2kL3FxKaY4YlLuze4AceGF3f1LIJjEQ521VYqpU55TEDW3viX8dVWHvbqFdusmi/wDzZ7VTVDb5eYKnpGUr/wAjuaaEaitTezSuBelZbNaYyzKDUvmRiMcRkr0r+Be9dxh2LLqiRUAUcQWJ40kK3tz1N/Dia7lhZNwtwjQSKhV5oGbW8y5DipLMoCLTqq6ndJDHPsOWZIy45/WMMkMsgEnElWKEgDLsByzw6QiRpGLTiZwzK6hFzRXYn4agy8Q33PEX3S2luXjEVsksUipIJnU0o6lXajJWpfLw6IuTCnb7mJtIEoJYqsvHNVala1qVlWSnu6qcC13CExSsKkParj3ow4N9eWGtruFZoW7Yz7D7wRkQfrGGuttqurQcWjy81PsHOPu/w97HHh9X6fs/Z8iqMi129PjXsmWWQHEIhKmRuHd0+Nlxbzen1E0vCO7lmUSG6BYFlJY0x0ZEhI/AlSYudr3XdGspmfqtQgmSRmckOy5q0ZyX4flU81NPOdru7L89ttwco7iKVaJChYq9ZeMAFYqHDS6F/eoxLZW0cVtcIjQw7fdLUddLmTqL0nElI0kinxt3sSypG+XHoSZl42p5hmAocd7RTTiWG3zLdOsmTNUZmHZkGaORTyuvTkXm/ewLgRH8lKSqSXDaRK2ZPFAI1C6qFZvM6WmpHwWUMqqKgrCRjpIR2zoC01e8/ufvYltbHzob/wApGVRU0kdRjaIyUvmrP4fvri76m2G/s7uLoSm+zXNXDySo4jiehVkyr+Iiu2nVpxc3U8ivtDWwMLVrLPEqSFStAK1p1a9SxtJ8Pp9NH6eILa+Md7ts+UkbKAcgeAZGADIRx9uLm/2i8iuLOECQ2ztTKi9h4nS1J9unB/08P78PcW//AKm4HiZlGhz7eooPt8fN4qsG3v4TG3Eo44o496t2Ef7Xi/R9n6RaT0skMEtyImzycwrUFNILZd58l5Vwm2mR7a3EZMUUao4jcZhKXyENxH3lZdVNNOtVx1o5vzCgdMuQ3TnoypMmbLqpGj/i5sTTrctt9301jJLkPrzrTPIdZKWYUV6f+18R3M+VxthQTSXNogMKhXIYSmQs/UDsEpXqSaav38Ty2TBXWvoWskuYIrJY1yvXU2nxu3K2M4rTqWEj03MMtJhcK3Ty6bEM51U6Vq8FOLR5HiuLK6QtA8LF4TkBUp4ANTpbL4dTLhbG1jSVWzolugGRTlqIU5qeB9mnVS6tHpwJCjRkr/7MTMr28rUAEkrkitqXOmh+/H0/LxG1heRygsTCjGhGfIaVUkkZN3z4atOLYFZOtD1JrhYHkCtJJxQ5rlE4BL1eY+lvCmKJikpguM1zQMVR2GZFTBMytOddMenkZcSWUimK3hkLPcNVEiO7dj9UqEJ7eGjw6sLOuYUABiDmpzHDs94GDbbtaiYIM4CopKM3BjUDnqHNiF/SygOsTvc208jlnYAFFizDaufmdMHaNwtWJkkETwOhWRH5eCkVI6Z/hxc2quJFglkiEg7GCMVq+3H2fptd322XpXto9cTkAj2hlIPddSVYeHEFrEyem/VmVJ2kyMtpcnx2TkkREHV+UP3U6lNeLrarmSRTYyCNkFMeTgLm3TzOVXh6i91v3MJPZ3KvHbMORygzXidBKyFubzE7neXAW7iUiYgyRysDGAeJLKyUl2GksxrarmbC7htM0VrMzM89lnocLlpINBiccckR5NS8sWFiuGILdIjb1ZWtXiY1NXC4Z2Y6V1nqRtDWr+bJiO53K4LWFvAQu3hqG5glMdCRaMtXT6qeZ4eVjuO1zW22223qEHXnokknGbds8oGQXJBQFZn0dN/i4NltcZvH6lKOPLUuhGXxulxXw6X/AA4e6nMsF1C7pLLBSjEqaStIrgdSwNen/wCTEhsBJLGo6rQqscaotJOSysy+1tKLHFU33tcdu4kuXI6txZxRySoqEAnMRDPmJB5Ven7uHiWFHCuGED1uKjkHKJKcyrJHH36oaE6UWILS3ay3GxUFzDGHd42cnj1Cy0FiVd6mkanuQ4G4wwy2sSqxliuloZUQ/Ez+G0ZXXUkj6cGe2l6SKpkllYhI0ReJZm4ChRx1YmsfSKxbhvHSNvdeqGUhI14gpZqe1uLL+Zyppq6ayK9WM/aeJx9Pd8gMpKsCCCO3MdhxDsX+I0TXcMa9Kw9TxqXvrfwifI1XUKsP/OurW1eLO+guUv8AZ5j1dp3eBme1lU8KldGIRxqHTLK64a5iQy3RzbpZKEZCSXOlhT28R/y4jiWQQTwJIDFkWLnMnLUdKgHLhppxbwWN1LD0z1LkUZhBwGZYrp6lJOoN97nXDW5Ec1zcwyS2xfqQAGM0ABs4xJUp1SZUfy61VnqW2iurmKxlDRNtxlcpKkxp0qoXoqprZFWKNEo1R82Lb07sEItrjVHJKHLSiEZrHkkEaMkj6WzTw61evG2Mt8d33u7WW4vIOJaKMKcpC82sLo79LN3FxaqUE6MAY4oq2mGa11NbNRMvNzgUr49WpLm7dLSWPONJiskgYxqCEQZoqurK2peo9Nf4Z7ixWEXyp1IHd2jYaGpKNIW5MjI2rU+rFwtxGpCoyblIrGRJGkyUNnGHVMw+bUa6/wCBbPevU+6vaelYldNvqUtf3qPxaK3OUU0iN2ebGkMatU/ex/QtqiOzek4WJi2yORnkn459S7lYlp3LaqD5aadOivH09n6Pp7vlSwRCO/2S8I/qOy3YrtZge1sj8OXIaJk1I1PNhd5/w+llLwjPcvT8kiruFsGYBmjJ/wDsW656ZFOnR1e9gR3FNvOjhyxjCssmRXJ+HK2kMmn/AKmp8LbXVg63kuU1pOHEcOvRGwiyTynEbMlBSqnp6cTX25O97fDyzGGWN2gZQi1PIrsA2XlrF/L55O5i3kaSNwjO4UgTJG5ACtqQszx5MyKj01qveqx1YbdnmAKzXi0KZnjXpoahS9XeoHi5tNWLOIv1Zb8MJXRVYpTk7KroFV16dNVTO3m/dxJbW9nAalIjFzFnFIGbMux/mKuefPqSnpNzYFpZWq329XUpM18xWSBWLFiscSOUR0KiN6l5P3tWIdr2WG3m3OQNCIre3twkZKspypK6Ke2Ly/w4udpEFp6h9UOV6loI0NjaumWRuaAoklVhn0U5eWSXvvLuu93b3l7LwrflRAcwkaDJY417qIKfkfT3fLhv9uuJLS9tmDwXETFHRveCMJaesBHsvqphRF6gjCxWl03AKLoU+RL7pkHS5uXRj8vfQdNq/LEis6zQPwzhcVrUc3bNdNGqvqacSrFt3RsWboxmWGOSSgnPoCUKGYsw1sVRE5vLXEtvtsMklwIVqd6GIdoD1I41ORqd34tR9xe9iX+lRmNo2pu4brW0alyzFnPDShyXhp+7g5Si3luGZYZLZY36aFUFZQhgx4dwq8nNz4/pe0rF+eRo0uJlKrHDEyjOVISFV2ZaYz0a6Gr1/ExuG+bz6hkttns3c3V3KGiiDPxy6sqt1JGB+F8XkTmZWxN6e/w8ilsNvkBjvt9ny/qN4O1qSMvy0DHjRFS7d7vI3yDj6e75lNi9QwNvXpfKmO3YgXNpn/MtJTnTlwbpOen3fL5sXG9+nt2l3T01dkB7q3kMcttK3KLuIny5amokqpSRHaRZEZkxPapElvZ2RC1W0skoaRMwQ7EgNWyDlala/wCXjcotwuUjZpDdRyW5V0kkgBqjYZtM3TkK8zdBGTmqerETWl+5voenJSoMfWkzCmBpFk0SnVNQ1Hl01SSs8eIrj1ZCE3F41Nr6bj6Zv5MsxXPLnIbSB8qs6+pzUJowr7hKsNhASbLa7cUW8AY91RzOcyXlcs/4fl/T3fNf1DZrowSsKJ4iA0U0efGOaM6ZEPub8OqnEJt5bb0NvuRhvLXKixmL9skUoGUXHmjkp06K2prwzbnvWzQ2hiMJuTukLI0SoCtEaZvmaBwyZmarmwbf0Ww3P1C8Ihn9QuhS2twAFpsrZhk0mWQa4kXu6E1aZb2+nkurudi81xMxeR2PazM2ZJPzH2fs/s32fs/yZ//Z";

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

    /* src\LayerStack3D.svelte generated by Svelte v3.59.2 */

    const file$8 = "src\\LayerStack3D.svelte";

    function add_css$9(target) {
    	append_styles(target, "svelte-124zhq", ".svelte-124zhq.svelte-124zhq{box-sizing:border-box}.layer-container.svelte-124zhq.svelte-124zhq{width:100px;height:100px;top:50%;left:50%;perspective:1350px;transform-style:preserve-3d}.layer.svelte-124zhq.svelte-124zhq{background-size:cover;background-position:center;width:100px;height:100px;position:absolute;transition:all 0.6s ease-in-out;cursor:pointer;z-index:1;border-radius:10px;box-shadow:1px 1px 0 1px #f9f9fb,\r\n    -1px 0 28px 0 rgba(34, 33, 81, 0.01),\r\n    28px 28px 28px 0 rgba(34, 33, 81, 0.85)}.drop-layer.svelte-124zhq.svelte-124zhq{background:radial-gradient(#0099dd, #026e81);transform:rotateX(45deg) rotateZ(45deg) translateZ(50px)}.bottom-layer.svelte-124zhq.svelte-124zhq{transform:rotateX(45deg) rotateZ(45deg) translateZ(50px)}.bottom-layer.svelte-124zhq.svelte-124zhq:hover,.bottom-layer-flat.svelte-124zhq.svelte-124zhq{transform:translate3d(0px, 50px, 50px)}.mid-layer.svelte-124zhq.svelte-124zhq{transform:rotateX(45deg) rotateZ(45deg) translateZ(100px)}.mid-layer.svelte-124zhq.svelte-124zhq:hover,.mid-layer-flat.svelte-124zhq.svelte-124zhq{transform:translate3d(0px, -100px, 50px)}.drop-ripple.svelte-124zhq.svelte-124zhq{display:inline-block;position:relative}.drop-ripple.svelte-124zhq div.svelte-124zhq{position:absolute;border:4px solid #fff;opacity:1;border-radius:50%;animation:svelte-124zhq-drop-ripples 1s cubic-bezier(0, 0.2, 0.8, 1) infinite}.drop-ripple.svelte-124zhq div.svelte-124zhq:nth-child(2){animation-delay:-0.5s}@keyframes svelte-124zhq-drop-ripples{0%{top:46px;left:46px;width:0;height:0;opacity:1}100%{top:0px;left:0px;width:92px;height:92px;opacity:0}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5ZXJTdGFjazNELnN2ZWx0ZSIsInNvdXJjZXMiOlsiTGF5ZXJTdGFjazNELnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbjxzY3JpcHQ+XHJcbmV4cG9ydCBsZXQgbGF5ZXJzPVtdXHJcbmV4cG9ydCBsZXQgc3RhdGU9XCIzZFwiXHJcbmV4cG9ydCBsZXQgbW9kZT1cIlwiXHJcbjwvc2NyaXB0PlxyXG48ZGl2IGNsYXNzPVwibGF5ZXItY29udGFpbmVyIHN0YWNrZWQtdG9wXCI+XHJcblxyXG4gIHsjaWYgIW1vZGU9PT1cImRyb3BcIn1cclxuICAgIHsjaWYgbGF5ZXJzLmxlbmd0aD09PTB9XHJcbiAgICA8ZGl2IGNsYXNzPVwibGF5ZXIgYm90dG9tLWxheWVyIFwiIGNsYXNzOmJvdHRvbS1sYXllci1mbGF0PXtzdGF0ZT09PVwiZmxhdFwifSBzdHlsZT1cImJhY2tncm91bmQ6IHVybCgvYXBwZGF0YS9jaGVja2VyX3RodW1iLnBuZylcIj48L2Rpdj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGxheWVycy5sZW5ndGg9PT0xfVxyXG4gICAgPGRpdiBjbGFzcz1cImxheWVyIGJvdHRvbS1sYXllciBcIiAgY2xhc3M6Ym90dG9tLWxheWVyLWZsYXQ9e3N0YXRlPT09XCJmbGF0XCJ9IHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKHtsYXllcnNbMF19KTtcIj48L2Rpdj5cclxuICAgIHsvaWZ9ICBcclxuICAgIHsjaWYgbGF5ZXJzLmxlbmd0aD09PTJ9XHJcbiAgICA8ZGl2IGNsYXNzPVwibGF5ZXIgbWlkLWxheWVyIFwiICBjbGFzczptaWQtbGF5ZXItZmxhdD17c3RhdGU9PT1cImZsYXRcIn0gc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoe2xheWVyc1sxXX0pXCI+PC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwibGF5ZXIgYm90dG9tLWxheWVyIFwiIGNsYXNzOmJvdHRvbS1sYXllci1mbGF0PXtzdGF0ZT09PVwiZmxhdFwifSBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCh7bGF5ZXJzWzBdfSlcIj48L2Rpdj5cclxuICAgIHsvaWZ9ICBcclxuICB7OmVsc2V9XHJcbiAgICA8ZGl2IGNsYXNzPVwibGF5ZXIgZHJvcC1sYXllciBkcm9wLXJpcHBsZVwiICA+XHJcbiAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICB7L2lmfVxyXG5cclxuPC9kaXY+XHJcbjxzdHlsZT5cclxuICAgICAgICAgICAgKiB7XHJcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICAgICAgfVxyXG5cclxuLmxheWVyLWNvbnRhaW5lciB7XHJcbiAgICB3aWR0aDogMTAwcHg7XHJcbiAgICBoZWlnaHQ6IDEwMHB4O1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICBsZWZ0OiA1MCU7XHJcbiAgICBwZXJzcGVjdGl2ZTogMTM1MHB4O1xyXG4gICB0cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xyXG5cclxufVxyXG5cclxuLmxheWVyIHtcclxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcclxuICAgIHdpZHRoOiAxMDBweDtcclxuICAgIGhlaWdodDogMTAwcHg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC42cyBlYXNlLWluLW91dDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHotaW5kZXg6IDE7XHJcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gIGJveC1zaGFkb3c6XHJcbiAgICAxcHggMXB4IDAgMXB4ICNmOWY5ZmIsXHJcbiAgICAtMXB4IDAgMjhweCAwIHJnYmEoMzQsIDMzLCA4MSwgMC4wMSksXHJcbiAgICAyOHB4IDI4cHggMjhweCAwIHJnYmEoMzQsIDMzLCA4MSwgMC44NSk7ICBcclxufVxyXG4uZHJvcC1sYXllciB7XHJcbiAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KCMwMDk5ZGQsICMwMjZlODEpO1xyXG4gICAgdHJhbnNmb3JtOiByb3RhdGVYKDQ1ZGVnKSByb3RhdGVaKDQ1ZGVnKSB0cmFuc2xhdGVaKDUwcHgpO1xyXG59XHJcblxyXG5cclxuLmJvdHRvbS1sYXllciB7XHJcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVgoNDVkZWcpIHJvdGF0ZVooNDVkZWcpIHRyYW5zbGF0ZVooNTBweCk7XHJcbn1cclxuLmJvdHRvbS1sYXllcjpob3ZlciwgLmJvdHRvbS1sYXllci1mbGF0IHtcclxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwcHgsIDUwcHgsIDUwcHgpO1xyXG5cclxufVxyXG4ubWlkLWxheWVyIHtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlWCg0NWRlZykgcm90YXRlWig0NWRlZykgdHJhbnNsYXRlWigxMDBweCk7XHJcbn1cclxuLm1pZC1sYXllcjpob3ZlciwgLm1pZC1sYXllci1mbGF0ICB7XHJcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAtMTAwcHgsIDUwcHgpO1xyXG5cclxufVxyXG4udG9wLWxheWVyIHtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlWCg0NWRlZykgcm90YXRlWig0NWRlZykgdHJhbnNsYXRlWigxNTBweCk7XHJcbn1cclxuXHJcbi5kcm9wLXJpcHBsZSB7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbn1cclxuLmRyb3AtcmlwcGxlIGRpdiB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIGJvcmRlcjogNHB4IHNvbGlkICNmZmY7XHJcbiAgb3BhY2l0eTogMTtcclxuICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgYW5pbWF0aW9uOiBkcm9wLXJpcHBsZXMgMXMgY3ViaWMtYmV6aWVyKDAsIDAuMiwgMC44LCAxKSBpbmZpbml0ZTtcclxufVxyXG4uZHJvcC1yaXBwbGUgZGl2Om50aC1jaGlsZCgyKSB7XHJcbiAgYW5pbWF0aW9uLWRlbGF5OiAtMC41cztcclxufVxyXG5Aa2V5ZnJhbWVzIGRyb3AtcmlwcGxlcyB7XHJcbiAgMCUge1xyXG4gICAgdG9wOiA0NnB4O1xyXG4gICAgbGVmdDogNDZweDtcclxuICAgIHdpZHRoOiAwO1xyXG4gICAgaGVpZ2h0OiAwO1xyXG4gICAgb3BhY2l0eTogMTtcclxuICB9XHJcbiAgMTAwJSB7XHJcbiAgICB0b3A6IDBweDtcclxuICAgIGxlZnQ6IDBweDtcclxuICAgIHdpZHRoOiA5MnB4O1xyXG4gICAgaGVpZ2h0OiA5MnB4O1xyXG4gICAgb3BhY2l0eTogMDtcclxuICB9XHJcbn1cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNkJZLDRCQUFFLENBQ0YsVUFBVSxDQUFFLFVBQ2hCLENBRVIsNENBQWlCLENBQ2IsS0FBSyxDQUFFLEtBQUssQ0FDWixNQUFNLENBQUUsS0FBSyxDQUNiLEdBQUcsQ0FBRSxHQUFHLENBQ1IsSUFBSSxDQUFFLEdBQUcsQ0FDVCxXQUFXLENBQUUsTUFBTSxDQUNwQixlQUFlLENBQUUsV0FFcEIsQ0FFQSxrQ0FBTyxDQUNMLGVBQWUsQ0FBRSxLQUFLLENBQ3RCLG1CQUFtQixDQUFFLE1BQU0sQ0FDekIsS0FBSyxDQUFFLEtBQUssQ0FDWixNQUFNLENBQUUsS0FBSyxDQUNiLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLFVBQVUsQ0FBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FDaEMsTUFBTSxDQUFFLE9BQU8sQ0FDZixPQUFPLENBQUUsQ0FBQyxDQUNWLGFBQWEsQ0FBRSxJQUFJLENBQ3JCLFVBQVUsQ0FDUixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQzFCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQzFDLENBQ0EsdUNBQVksQ0FDVixVQUFVLENBQUUsZ0JBQWdCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUMzQyxTQUFTLENBQUUsUUFBUSxLQUFLLENBQUMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUM1RCxDQUdBLHlDQUFjLENBQ1YsU0FBUyxDQUFFLFFBQVEsS0FBSyxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FDNUQsQ0FDQSx5Q0FBYSxNQUFNLENBQUUsOENBQW1CLENBQ2xDLFNBQVMsQ0FBRSxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FFNUMsQ0FDQSxzQ0FBVyxDQUNQLFNBQVMsQ0FBRSxRQUFRLEtBQUssQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsV0FBVyxLQUFLLENBQzdELENBQ0Esc0NBQVUsTUFBTSxDQUFFLDJDQUFpQixDQUM3QixTQUFTLENBQUUsWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBRTlDLENBS0Esd0NBQWEsQ0FDWCxPQUFPLENBQUUsWUFBWSxDQUNyQixRQUFRLENBQUUsUUFFWixDQUNBLDBCQUFZLENBQUMsaUJBQUksQ0FDZixRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3RCLE9BQU8sQ0FBRSxDQUFDLENBQ1YsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsU0FBUyxDQUFFLDBCQUFZLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFDMUQsQ0FDQSwwQkFBWSxDQUFDLGlCQUFHLFdBQVcsQ0FBQyxDQUFFLENBQzVCLGVBQWUsQ0FBRSxLQUNuQixDQUNBLFdBQVcsMEJBQWEsQ0FDdEIsRUFBRyxDQUNELEdBQUcsQ0FBRSxJQUFJLENBQ1QsSUFBSSxDQUFFLElBQUksQ0FDVixLQUFLLENBQUUsQ0FBQyxDQUNSLE1BQU0sQ0FBRSxDQUFDLENBQ1QsT0FBTyxDQUFFLENBQ1gsQ0FDQSxJQUFLLENBQ0gsR0FBRyxDQUFFLEdBQUcsQ0FDUixJQUFJLENBQUUsR0FBRyxDQUNULEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixPQUFPLENBQUUsQ0FDWCxDQUNGIn0= */");
    }

    // (21:2) {:else}
    function create_else_block$4(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "svelte-124zhq");
    			add_location(div0, file$8, 22, 6, 872);
    			attr_dev(div1, "class", "svelte-124zhq");
    			add_location(div1, file$8, 23, 6, 891);
    			attr_dev(div2, "class", "layer drop-layer drop-ripple svelte-124zhq");
    			add_location(div2, file$8, 21, 4, 820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(21:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if !mode==="drop"}
    function create_if_block$7(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let if_block0 = /*layers*/ ctx[0].length === 0 && create_if_block_3$3(ctx);
    	let if_block1 = /*layers*/ ctx[0].length === 1 && create_if_block_2$4(ctx);
    	let if_block2 = /*layers*/ ctx[0].length === 2 && create_if_block_1$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*layers*/ ctx[0].length === 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$3(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*layers*/ ctx[0].length === 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$4(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*layers*/ ctx[0].length === 2) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$6(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(10:2) {#if !mode===\\\"drop\\\"}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#if layers.length===0}
    function create_if_block_3$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "layer bottom-layer  svelte-124zhq");
    			set_style(div, "background", "url(/appdata/checker_thumb.png)");
    			toggle_class(div, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			add_location(div, file$8, 11, 4, 192);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2) {
    				toggle_class(div, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(11:4) {#if layers.length===0}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if layers.length===1}
    function create_if_block_2$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "layer bottom-layer  svelte-124zhq");
    			set_style(div, "background-image", "url(" + /*layers*/ ctx[0][0] + ")");
    			toggle_class(div, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			add_location(div, file$8, 14, 4, 370);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*layers*/ 1) {
    				set_style(div, "background-image", "url(" + /*layers*/ ctx[0][0] + ")");
    			}

    			if (dirty & /*state*/ 2) {
    				toggle_class(div, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(14:4) {#if layers.length===1}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if layers.length===2}
    function create_if_block_1$6(ctx) {
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "layer mid-layer  svelte-124zhq");
    			set_style(div0, "background-image", "url(" + /*layers*/ ctx[0][1] + ")");
    			toggle_class(div0, "mid-layer-flat", /*state*/ ctx[1] === "flat");
    			add_location(div0, file$8, 17, 4, 543);
    			attr_dev(div1, "class", "layer bottom-layer  svelte-124zhq");
    			set_style(div1, "background-image", "url(" + /*layers*/ ctx[0][0] + ")");
    			toggle_class(div1, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			add_location(div1, file$8, 18, 4, 667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*layers*/ 1) {
    				set_style(div0, "background-image", "url(" + /*layers*/ ctx[0][1] + ")");
    			}

    			if (dirty & /*state*/ 2) {
    				toggle_class(div0, "mid-layer-flat", /*state*/ ctx[1] === "flat");
    			}

    			if (dirty & /*layers*/ 1) {
    				set_style(div1, "background-image", "url(" + /*layers*/ ctx[0][0] + ")");
    			}

    			if (dirty & /*state*/ 2) {
    				toggle_class(div1, "bottom-layer-flat", /*state*/ ctx[1] === "flat");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(17:4) {#if layers.length===2}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (!/*mode*/ ctx[2] === "drop") return create_if_block$7;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "layer-container stacked-top svelte-124zhq");
    			add_location(div, file$8, 7, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerStack3D', slots, []);
    	let { layers = [] } = $$props;
    	let { state = "3d" } = $$props;
    	let { mode = "" } = $$props;
    	const writable_props = ['layers', 'state', 'mode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LayerStack3D> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('layers' in $$props) $$invalidate(0, layers = $$props.layers);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    	};

    	$$self.$capture_state = () => ({ layers, state, mode });

    	$$self.$inject_state = $$props => {
    		if ('layers' in $$props) $$invalidate(0, layers = $$props.layers);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [layers, state, mode];
    }

    class LayerStack3D extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { layers: 0, state: 1, mode: 2 }, add_css$9);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerStack3D",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get layers() {
    		throw new Error("<LayerStack3D>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layers(value) {
    		throw new Error("<LayerStack3D>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<LayerStack3D>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<LayerStack3D>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<LayerStack3D>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<LayerStack3D>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FormElement.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1$1 } = globals;
    const file$7 = "src\\FormElement.svelte";

    function add_css$8(target) {
    	append_styles(target, "svelte-18iagk8", ".svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{box-sizing:border-box}.element-preview.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{position:relative;margin-bottom:20px}.element-preview.svelte-18iagk8 .editElementButton.svelte-18iagk8.svelte-18iagk8{display:none;position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;background-color:rgb(51, 51, 51);width:50px;text-align:center}.element-preview.svelte-18iagk8:hover .editElementButton.svelte-18iagk8.svelte-18iagk8{display:block}.element-preview.svelte-18iagk8 select.svelte-18iagk8.svelte-18iagk8{margin-right:10px;background-color:black;color:white;padding:5px;display:inline-block;min-width:280px}.element-preview.svelte-18iagk8 input.svelte-18iagk8.svelte-18iagk8,textarea.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{background:none;position:relative;display:inline-block;color:white;margin:0;min-width:280px}.colorInput.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{padding:0;border:0}.textInput.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8,.textarea.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{width:280px}.element-preview.svelte-18iagk8 label.svelte-18iagk8.svelte-18iagk8{min-width:110px;display:inline-block}.element-preview.svelte-18iagk8 .checkboxLabel.svelte-18iagk8.svelte-18iagk8{vertical-align:5px}.element-preview.svelte-18iagk8 .textarea_label.svelte-18iagk8.svelte-18iagk8{vertical-align:top}.element-preview.svelte-18iagk8 .layer_image_label.svelte-18iagk8.svelte-18iagk8{vertical-align:60px}.element-preview.svelte-18iagk8 .layer_drop_layers.svelte-18iagk8.svelte-18iagk8{vertical-align:80px}.element-preview.svelte-18iagk8 .slider_label.svelte-18iagk8.svelte-18iagk8{vertical-align:10px}.element-properties.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{background-color:rgb(51, 51, 51);padding:10px;display:block;position:relative}.element-properties.svelte-18iagk8 label.svelte-18iagk8.svelte-18iagk8{min-width:110px;display:inline-block}.element-properties.svelte-18iagk8 input.svelte-18iagk8.svelte-18iagk8,textarea.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{background:none;position:relative;display:inline-block;color:white;margin:0}.formLine.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{display:block;margin-bottom:10px}.element-properties.svelte-18iagk8 .formClose.svelte-18iagk8.svelte-18iagk8{position:absolute;right:0px;top:0px;cursor:pointer;padding:5px;width:20px}.slidervalue.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{vertical-align:10px;margin-right:10px}.element-properties.svelte-18iagk8 button.svelte-18iagk8.svelte-18iagk8{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:15px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}.element-properties.svelte-18iagk8 .delete.svelte-18iagk8.svelte-18iagk8{background-color:red;color:white}.checkbox-wrapper-3.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{display:inline-block}.checkbox-wrapper-3.svelte-18iagk8 input[type=\"checkbox\"].svelte-18iagk8.svelte-18iagk8{visibility:hidden;display:none}.checkbox-wrapper-3.svelte-18iagk8 .toggle.svelte-18iagk8.svelte-18iagk8{position:relative;display:block;width:40px;height:20px;cursor:pointer;-webkit-tap-highlight-color:transparent;transform:translate3d(0, 0, 0)}.checkbox-wrapper-3.svelte-18iagk8 .toggle.svelte-18iagk8.svelte-18iagk8:before{content:\"\";position:relative;top:3px;left:3px;width:34px;height:14px;display:block;background:#9A9999;border-radius:8px;transition:background 0.2s ease}.checkbox-wrapper-3.svelte-18iagk8 .toggle span.svelte-18iagk8.svelte-18iagk8{position:absolute;top:0;left:0;width:20px;height:20px;display:block;background:white;border-radius:10px;box-shadow:0 3px 8px rgba(154, 153, 153, 0.5);transition:all 0.2s ease}.checkbox-wrapper-3.svelte-18iagk8 .toggle span.svelte-18iagk8.svelte-18iagk8:before{content:\"\";position:absolute;display:block;margin:-18px;width:56px;height:56px;background:rgba(79, 46, 220, 0.5);border-radius:50%;transform:scale(0);opacity:1;pointer-events:none}.checkbox-wrapper-3.svelte-18iagk8 input.svelte-18iagk8:checked+.toggle.svelte-18iagk8:before{background:rgb(227, 206, 116)}.checkbox-wrapper-3.svelte-18iagk8 input:checked+.toggle span.svelte-18iagk8.svelte-18iagk8{background:#cda600;transform:translateX(20px);transition:all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25), background 0.15s ease;box-shadow:0 3px 8px rgba(79, 46, 220, 0.2)}.checkbox-wrapper-3.svelte-18iagk8 input:checked+.toggle span.svelte-18iagk8.svelte-18iagk8:before{transform:scale(1);opacity:0;transition:all 0.4s ease}.showHidden.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{opacity:0.5}.drop_layers.svelte-18iagk8.svelte-18iagk8.svelte-18iagk8{display:inline-block;margin-top:30px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUVsZW1lbnQuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtRWxlbWVudC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XHJcblxyXG4gICAgZXhwb3J0IGxldCBlbGVtZW50O1xyXG4gICAgZXhwb3J0IGxldCBzaG93UHJvcGVydGllcz1mYWxzZVxyXG4gICAgaW1wb3J0IHtsYXllcl9pbWFnZV9wcmV2aWV3fSBmcm9tIFwiLi9pbWFnZXNcIlxyXG4gICAgaW1wb3J0IHttZXRhZGF0YX0gZnJvbSBcIi4vc3RvcmVzL21ldGFkYXRhXCJcclxuICAgIGltcG9ydCBMYXllclN0YWNrM0QgZnJvbSBcIi4vTGF5ZXJTdGFjazNELnN2ZWx0ZVwiXHJcblxyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxyXG4gICAgZXhwb3J0IGxldCB2YWx1ZVxyXG4gICAgZXhwb3J0IGxldCByZWFkb25seT1cIlwiXHJcbiAgICBsZXQgbGF5ZXJzPVtdXHJcbiAgICBpZiAoZWxlbWVudC50eXBlPT09XCJzbGlkZXJcIikge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHZhbHVlPWVsZW1lbnQubWluXHJcbiAgICB9XHJcbiAgICAvLyBGdW5jdGlvbiB0byBpbW1lZGlhdGVseSB1cGRhdGUgdGhlIHBhcmVudCBjb21wb25lbnRcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUVsZW1lbnQodXBkYXRlZFByb3BzKSB7XHJcbiAgICAgICAgZWxlbWVudD17IC4uLmVsZW1lbnQsIC4uLnVwZGF0ZWRQcm9wcyB9XHJcbiAgICAgICAgaWYgKGVsZW1lbnQudHlwZT09PVwic2xpZGVyXCIgfHwgZWxlbWVudC50eXBlPT09XCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB2YWx1ZT1lbGVtZW50LmRlZmF1bHRcclxuICAgICAgICAgICAgZWxlbWVudC5taW49cGFyc2VGbG9hdChlbGVtZW50Lm1pbilcclxuICAgICAgICAgICAgZWxlbWVudC5tYXg9cGFyc2VGbG9hdChlbGVtZW50Lm1heClcclxuICAgICAgICAgICAgZWxlbWVudC5kZWZhdWx0PXBhcnNlRmxvYXQoZWxlbWVudC5kZWZhdWx0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBkaXNwYXRjaCgndXBkYXRlJywgZWxlbWVudClcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgb3B0aW9uIHVwZGF0ZXMgZm9yIGRyb3Bkb3duc1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlT3B0aW9uQ2hhbmdlKGV2ZW50LCBpbmRleCwga2V5KSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZE9wdGlvbnMgPSBbLi4uZWxlbWVudC5vcHRpb25zXVxyXG4gICAgICAgIHVwZGF0ZWRPcHRpb25zW2luZGV4XVtrZXldID0gZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgdXBkYXRlRWxlbWVudCh7IG9wdGlvbnM6IHVwZGF0ZWRPcHRpb25zIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGEgbmV3IG9wdGlvbiB0byB0aGUgZHJvcGRvd25cclxuICAgIGZ1bmN0aW9uIGFkZE9wdGlvbigpIHtcclxuICAgICAgICB1cGRhdGVFbGVtZW50KHsgb3B0aW9uczogWy4uLmVsZW1lbnQub3B0aW9ucywgeyB0ZXh0OiAnJywga2V5OiAnJyB9XSB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBhbiBvcHRpb24gZnJvbSB0aGUgZHJvcGRvd25cclxuICAgIGZ1bmN0aW9uIHJlbW92ZU9wdGlvbihpbmRleCkge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRPcHRpb25zID0gZWxlbWVudC5vcHRpb25zLmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpXHJcbiAgICAgICAgdXBkYXRlRWxlbWVudCh7IG9wdGlvbnM6IHVwZGF0ZWRPcHRpb25zIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb3BlblByb3BlcnRpZXMoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goJ29wZW5Qcm9wZXJ0aWVzJyx7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNsb3NlUHJvcGVydGllcygpIHtcclxuICAgICAgICBkaXNwYXRjaCgnY2xvc2VQcm9wZXJ0aWVzJyx7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgZGlzcGF0Y2goXCJkZWxldGVcIix7fSlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNoYW5nZVZhbHVlKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgdmFsdWU9bmV3VmFsdWVcclxuICAgICAgICBkaXNwYXRjaChcImNoYW5nZVwiLHt2YWx1ZTp2YWx1ZX0pXHJcbiAgICB9XHJcbiAgICBleHBvcnQgbGV0IGFkdmFuY2VkT3B0aW9ucz10cnVlXHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdiBjbGFzcz1cImVsZW1lbnQtcHJldmlld1wiIGNsYXNzOnNob3dIaWRkZW49e2VsZW1lbnQuaGlkZGVufT5cclxuICAgIHsjaWYgcmVhZG9ubHkhPT1cInJlYWRvbmx5XCJ9XHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZWRpdEVsZW1lbnRCdXR0b25cIiBvbjpjbGljaz17b3BlblByb3BlcnRpZXN9PkVkaXQ8L2Rpdj5cclxuICAgIHsvaWZ9XHJcbiAgICA8IS0tIEVsZW1lbnQgcHJldmlldyBiYXNlZCBvbiB0eXBlIC0tPlxyXG4gICAgeyNpZiBlbGVtZW50LnR5cGU9PT1cImFkdmFuY2VkX29wdGlvbnNcIn0gXHJcbiAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktbWlzc2luZy1hdHRyaWJ1dGUgLS0+XHJcbiAgICAgICAgPGJ1dHRvbiBvbjpjbGljaz17KGUpID0+IHsgYWR2YW5jZWRPcHRpb25zPSFhZHZhbmNlZE9wdGlvbnM7IGRpc3BhdGNoKFwicmVkcmF3QWxsXCIse30pIH19PlNob3cgQWR2YW5jZWQgT3B0aW9uczwvYnV0dG9uPlxyXG4gICAgey9pZn1cclxuXHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZT09PVwibGF5ZXJfaW1hZ2VcIn0gXHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfSBjbGFzcz1cImxheWVyX2ltYWdlX2xhYmVsXCI+e2VsZW1lbnQubmFtZX06PC9sYWJlbD5cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1taXNzaW5nLWF0dHJpYnV0ZSAtLT5cclxuICAgICAgICA8aW1nIG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIHNyYz1cIntsYXllcl9pbWFnZV9wcmV2aWV3fVwiPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlPT09XCJkcm9wX2xheWVyc1wifSBcclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9IGNsYXNzPVwibGF5ZXJfZHJvcF9sYXllcnNcIj57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICAgICAgeyNlYWNoIEFycmF5KHBhcnNlSW50KGVsZW1lbnQubnVtX2xheWVycykpIGFzIF8sIGl9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZHJvcF9sYXllcnNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8TGF5ZXJTdGFjazNEIG1vZGU9XCJkcm9wXCI+PC9MYXllclN0YWNrM0Q+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgIFxyXG4gICAgICAgICAgICB7L2VhY2h9XHJcbiAgICB7L2lmfSAgICBcclxuICAgIHsjaWYgZWxlbWVudC50eXBlPT09XCJsYXllcl9pbWFnZV9pZHNcIn1cclxuICAgIDxMYXllclN0YWNrM0Qge2xheWVyc30+PC9MYXllclN0YWNrM0Q+XHJcblxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnY29sb3JfcGlja2VyJ31cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9PntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiY29sb3JcIiBjbGFzcz1cInRleHRJbnB1dCBjb2xvcklucHV0XCIgcGxhY2Vob2xkZXI9XCJ7ZWxlbWVudC5wbGFjZWhvbGRlcn1cIiB7cmVhZG9ubHl9ICB7dmFsdWV9IG9uOmNoYW5nZT17ZSA9PiB7Y2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpfX0vPlxyXG4gICAgey9pZn0gICAgXHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3RleHQnfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0+e2VsZW1lbnQubGFiZWx9OjwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ0ZXh0SW5wdXRcIiBwbGFjZWhvbGRlcj1cIntlbGVtZW50LnBsYWNlaG9sZGVyfVwiIHtyZWFkb25seX0gIHt2YWx1ZX0gb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fS8+XHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAndGV4dGFyZWEnfVxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJ0ZXh0YXJlYV9sYWJlbFwiPntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cInRleHRhcmVhXCIgcGxhY2Vob2xkZXI9XCJ7ZWxlbWVudC5wbGFjZWhvbGRlcn1cIiAge3JlYWRvbmx5fSBuYW1lPVwie2VsZW1lbnQubmFtZX1cIiBvbjpjaGFuZ2U9e2UgPT4ge2NoYW5nZVZhbHVlKGUudGFyZ2V0LnZhbHVlKX19Pnt2YWx1ZX08L3RleHRhcmVhPlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ2NoZWNrYm94JyB9XHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfSBjbGFzcz1cImNoZWNrYm94TGFiZWxcIj57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuXHJcbiAgICAgIDwhLS0gPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3ZhbHVlfSAgb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fS8+IHtlbGVtZW50LmxhYmVsfS0tPiAgXHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGVja2JveC13cmFwcGVyLTNcIj5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9e2VsZW1lbnQubmFtZX0gIHtyZWFkb25seX0gIGNoZWNrZWQ9e3ZhbHVlfSAgb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fSAvPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9e2VsZW1lbnQubmFtZX0gY2xhc3M9XCJ0b2dnbGVcIj48c3Bhbj48L3NwYW4+PC9sYWJlbD5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAnZHJvcGRvd24nfVxyXG4gICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIGNsYXNzPVwiZHJvcGRvd25cIiAge3JlYWRvbmx5fSBvbjpjaGFuZ2U9e2UgPT4ge2NoYW5nZVZhbHVlKGUudGFyZ2V0LnZhbHVlKX19ID5cclxuICAgICAgICAgICAgeyNlYWNoIGVsZW1lbnQub3B0aW9ucyBhcyBvcHRpb259XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb24udmFsdWV9IHNlbGVjdGVkPXt2YWx1ZT09PW9wdGlvbi52YWx1ZX0+e29wdGlvbi50ZXh0fSA8L29wdGlvbj5cclxuICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ3ByZV9maWxsZWRfZHJvcGRvd24nfVxyXG4gICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfT57ZWxlbWVudC5sYWJlbH06PC9sYWJlbD5cclxuICAgICAgICB7I2lmIGVsZW1lbnQud2lkZ2V0X25hbWUgJiYgJG1ldGFkYXRhLmNvbWJvX3ZhbHVlc1tlbGVtZW50LndpZGdldF9uYW1lXSB9XHJcbiAgICAgICAgPHNlbGVjdCBuYW1lPVwie2VsZW1lbnQubmFtZX1cIiBjbGFzcz1cImRyb3Bkb3duXCIgIHtyZWFkb25seX0gb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fT5cclxuICAgICAgICAgIHsjZWFjaCAkbWV0YWRhdGEuY29tYm9fdmFsdWVzW2VsZW1lbnQud2lkZ2V0X25hbWVdIGFzIHZ9XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt2fSAgc2VsZWN0ZWQ9e3ZhbHVlPT09dn0+e3Z9IDwvb3B0aW9uPlxyXG4gICAgICAgICAgICB7L2VhY2h9IFxyXG4gICAgICAgIDwvc2VsZWN0PiAgICAgIFxyXG4gICAgICAgIHs6ZWxzZSBpZiAhZWxlbWVudC53aWRnZXRfbmFtZX0gIFxyXG4gICAgICAgICAgICBTZWxlY3QgV2lkZ2V0XHJcbiAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICBXaWRnZXQge2VsZW1lbnQud2lkZ2V0X25hbWV9IG5vdCBmb3VuZC5cclxuICAgICAgICB7L2lmfVxyXG4gICAgezplbHNlIGlmIGVsZW1lbnQudHlwZSA9PT0gJ3NsaWRlcid9XHJcbiAgICAgICAgPGxhYmVsIGZvcj17ZWxlbWVudC5uYW1lfSBjbGFzcz1cInNsaWRlcl9sYWJlbFwiPntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwic2xpZGVydmFsdWVcIj57dmFsdWV9PC9zcGFuPjxpbnB1dCAge3JlYWRvbmx5fSB0eXBlPVwicmFuZ2VcIiBtaW49e2VsZW1lbnQubWlufSBtYXg9e2VsZW1lbnQubWF4fSBzdGVwPXtlbGVtZW50LnN0ZXB9IHt2YWx1ZX0gbmFtZT1cIntlbGVtZW50Lm5hbWV9XCIgb246Y2hhbmdlPXtlID0+IHtjaGFuZ2VWYWx1ZShlLnRhcmdldC52YWx1ZSl9fS8+XHJcbiAgICB7OmVsc2UgaWYgZWxlbWVudC50eXBlID09PSAnbnVtYmVyJ31cclxuICAgICAgICA8bGFiZWwgZm9yPXtlbGVtZW50Lm5hbWV9PntlbGVtZW50LmxhYmVsfTo8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbWluPXtlbGVtZW50Lm1pbn0gbWF4PXtlbGVtZW50Lm1heH0gIHtyZWFkb25seX0gc3RlcD17ZWxlbWVudC5zdGVwfSB7dmFsdWV9IG5hbWU9XCJ7ZWxlbWVudC5uYW1lfVwiIG9uOmNoYW5nZT17ZSA9PiB7Y2hhbmdlVmFsdWUoZS50YXJnZXQudmFsdWUpfX0vPlxyXG4gICAgey9pZn0gICAgXHJcbjwvZGl2PlxyXG57I2lmIHNob3dQcm9wZXJ0aWVzfVxyXG48ZGl2IGNsYXNzPVwiZWxlbWVudC1wcm9wZXJ0aWVzXCIgPlxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtQ2xvc2VcIiBvbjpjbGljaz17Y2xvc2VQcm9wZXJ0aWVzfT5YPC9kaXY+XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSAhPT0gJ2xheWVyX2ltYWdlJyAmJiAgZWxlbWVudC50eXBlIT09XCJhZHZhbmNlZF9vcHRpb25zXCIgICYmICBlbGVtZW50LnR5cGUhPT1cImRyb3BfbGF5ZXJzXCJ9IFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiID5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxhYmVsXCI+TGFiZWw6PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImxhYmVsXCIgdmFsdWU9e2VsZW1lbnQubGFiZWx9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IGxhYmVsOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJuYW1lXCI+IE5hbWU6IDwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgIHZhbHVlPXtlbGVtZW50Lm5hbWV9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBuYW1lOiBlLnRhcmdldC52YWx1ZSB9KSB9IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwiZGVmYXVsdFwiPiBEZWZhdWx0IHZhbHVlOiA8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJkZWZhdWx0XCIgdmFsdWU9e2VsZW1lbnQuZGVmYXVsdH0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgZGVmYXVsdDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+ICAgIFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cImhpZGRlblwiPkhpZGRlbjogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJoaWRkZW5cIiBiaW5kOmNoZWNrZWQ9e2VsZW1lbnQuaGlkZGVufSAgLz4gSGlkZSBJbnB1dCBpbiBmb3JtXHJcbiAgICAgICAgPC9kaXY+ICAgICAgIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAndGV4dCcgfHwgZWxlbWVudC50eXBlID09PSAndGV4dGFyZWEnIHx8IGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicgIHx8IGVsZW1lbnQudHlwZSA9PT0gJ2NvbG9yX3BpY2tlcid9fVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cInBsYWNlaG9sZGVyXCI+IFBsYWNlaG9sZGVyOiA8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJwbGFjZWhvbGRlclwiIHZhbHVlPXtlbGVtZW50LnBsYWNlaG9sZGVyfSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBwbGFjZWhvbGRlcjogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+ICBcclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ2xheWVyX2ltYWdlJyB9XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwibmFtZVwiPiBOYW1lOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXtlbGVtZW50Lm5hbWV9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBuYW1lOiBlLnRhcmdldC52YWx1ZSB9KX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJmcm9tX3NlbGVjdGlvblwiPlBpeGVsIERhdGE6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiZnJvbV9zZWxlY3Rpb25cIiBiaW5kOmNoZWNrZWQ9e2VsZW1lbnQuZnJvbV9zZWxlY3Rpb259ICAvPiBGcm9tIFNlbGVjdGlvblxyXG4gICAgICAgIDwvZGl2PiAgICAgIFxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnZHJvcF9sYXllcnMnIH1cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybUxpbmVcIj5cclxuICAgICAgICAgICAgPGxhYmVsICBmb3I9XCJuYW1lXCI+IE5hbWU6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e2VsZW1lbnQubmFtZX0gb246Y2hhbmdlPXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm5hbWVcIj4gTGFiZWw6IDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e2VsZW1lbnQubGFiZWx9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBsYWJlbDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+ICAgIFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIm5hbWVcIj4gTnVtYmVyOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXtlbGVtZW50Lm51bV9sYXllcnN9IG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBudW1fbGF5ZXJzOiBwYXJzZUludChlLnRhcmdldC52YWx1ZSkgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+ICAgICAgICAgICAgXHJcbiAgICB7L2lmfSAgICBcclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnZHJvcGRvd24nfVxyXG4gICAgICAgIHsjZWFjaCBlbGVtZW50Lm9wdGlvbnMgYXMgb3B0aW9uLCBpbmRleH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidGV4dFwiPk9wdGlvbiBUZXh0OjwvbGFiZWw+IDxpbnB1dCBuYW1lPVwidGV4dFwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e29wdGlvbi50ZXh0fSBvbjppbnB1dD17KGUpID0+IGhhbmRsZU9wdGlvbkNoYW5nZShlLCBpbmRleCwgJ3RleHQnKX0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImtleVwiPk9wdGlvbiBWYWx1ZTo8L2xhYmVsPiA8aW5wdXQgbmFtZT1cInZhbHVlXCIgdHlwZT1cInRleHRcIiB2YWx1ZT17b3B0aW9uLnZhbHVlfSBvbjppbnB1dD17KGUpID0+IGhhbmRsZU9wdGlvbkNoYW5nZShlLCBpbmRleCwgJ3ZhbHVlJyl9IC8+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKSA9PiByZW1vdmVPcHRpb24oaW5kZXgpfT5SZW1vdmUgT3B0aW9uPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXthZGRPcHRpb259PkFkZCBPcHRpb248L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3ByZV9maWxsZWRfZHJvcGRvd24nfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgIGZvcj1cIndpZGdldF9uYW1lXCI+IENvbWJvIFdpZGdldDogPC9sYWJlbD5cclxuICAgICAgICAgICAgPHNlbGVjdCAgbmFtZT1cIndpZGdldF9uYW1lXCIgIG9uOmNoYW5nZT17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyB3aWRnZXRfbmFtZTogZS50YXJnZXQudmFsdWUgfSl9IGJpbmQ6dmFsdWU9e2VsZW1lbnQud2lkZ2V0X25hbWV9ICA+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uPlNlbGVjdC4uLjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEuY29tYm9fdmFsdWVzfVxyXG4gICAgICAgICAgICAgICAgICAgIHsjZWFjaCBPYmplY3QuZW50cmllcygkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSBhcyBbd2lkZ2V0X25hbWUsdmFsdWVzXX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17d2lkZ2V0X25hbWV9Pnt3aWRnZXRfbmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgIDwvZGl2PlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgZWxlbWVudC50eXBlID09PSAnc2xpZGVyJyB8fCBlbGVtZW50LnR5cGUgPT09ICdudW1iZXInfVxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibWluXCI+IE1pbjogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJtaW5cIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e2VsZW1lbnQubWlufSBvbjppbnB1dD17KGUpID0+IHVwZGF0ZUVsZW1lbnQoeyBtaW46IGUudGFyZ2V0LnZhbHVlIH0pfSAvPiAgXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1MaW5lXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCAgZm9yPVwibWF4XCI+IE1heDo8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cIm1heFwiIHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17ZWxlbWVudC5tYXh9IG9uOmlucHV0PXsoZSkgPT4gdXBkYXRlRWxlbWVudCh7IG1heDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICAgPC9kaXY+IFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtTGluZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwic3RlcFwiPiBTdGVwOiA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cInN0ZXBcIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9e2VsZW1lbnQuc3RlcH0gb246aW5wdXQ9eyhlKSA9PiB1cGRhdGVFbGVtZW50KHsgc3RlcDogZS50YXJnZXQudmFsdWUgfSl9IC8+XHJcbiAgICAgICA8L2Rpdj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcid9XHJcbiAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKT0+eyAgdXBkYXRlRWxlbWVudCh7IHR5cGU6IFwic2xpZGVyXCIgfSkgfX0+Q29udmVydCB0byBTbGlkZXI8L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIGVsZW1lbnQudHlwZSA9PT0gJ3NsaWRlcid9XHJcbiAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKT0+eyAgdXBkYXRlRWxlbWVudCh7IHR5cGU6IFwibnVtYmVyXCIgfSkgfX0+Q29udmVydCB0byBOdW1iZXI8L2J1dHRvbj5cclxuICAgIHsvaWZ9XHJcbiAgICA8ZGl2PjxidXR0b24gb246Y2xpY2s9eygpID0+IGRlbGV0ZUVsZW1lbnQoKX0gY2xhc3M9XCJkZWxldGVcIj5EZWxldGU8L2J1dHRvbj48L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG57L2lmfVxyXG5cclxuPHN0eWxlPlxyXG4gICAgKiB7XHJcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuXHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IHtcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLmVkaXRFbGVtZW50QnV0dG9uIHtcclxuICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICByaWdodDowcHg7XHJcbiAgICAgICAgdG9wOiAwcHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNTEsIDUxLCA1MSk7XHJcbiAgICAgICAgd2lkdGg6NTBweDtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLmVsZW1lbnQtcHJldmlldzpob3ZlciAuZWRpdEVsZW1lbnRCdXR0b24ge1xyXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyBzZWxlY3Qge1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgcGFkZGluZzogNXB4OyAgIFxyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgICAgICBtaW4td2lkdGg6IDI4MHB4O1xyXG5cclxuICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IGlucHV0LHRleHRhcmVhIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY29sb3I6d2hpdGU7XHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgIG1pbi13aWR0aDogMjgwcHg7XHJcbiAgICB9XHJcbiAgICAuY29sb3JJbnB1dCB7XHJcbiAgICAgICAgcGFkZGluZzowO1xyXG4gICAgICAgIGJvcmRlcjowO1xyXG4gICAgfVxyXG4gICAgLnRleHRJbnB1dCwudGV4dGFyZWEge1xyXG4gICAgICAgIHdpZHRoOiAyODBweDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgbGFiZWwge1xyXG4gICAgICAgIG1pbi13aWR0aDogMTEwcHg7XHJcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJldmlldyAuY2hlY2tib3hMYWJlbCB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IDVweDtcclxuXHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IC50ZXh0YXJlYV9sYWJlbCB7XHJcbiAgICAgICAgdmVydGljYWwtYWxpZ246IHRvcDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLmxheWVyX2ltYWdlX2xhYmVsIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogNjBweDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByZXZpZXcgLmxheWVyX2Ryb3BfbGF5ZXJzIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogODBweDtcclxuICAgIH0gICAgXHJcbiAgICAuZWxlbWVudC1wcmV2aWV3IC5zbGlkZXJfbGFiZWwge1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiAxMHB4O1xyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDUxLCA1MSwgNTEpO1xyXG4gICAgICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICAgICAgZGlzcGxheTpibG9jaztcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gICAgfVxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyBsYWJlbCB7XHJcbiAgICAgICAgbWluLXdpZHRoOiAxMTBweDtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICB9XHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIGlucHV0LHRleHRhcmVhIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY29sb3I6d2hpdGU7XHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfSAgICBcclxuICAgIC5mb3JtTGluZSB7XHJcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgIH1cclxuICAgIC5lbGVtZW50LXByb3BlcnRpZXMgLmZvcm1DbG9zZSB7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIHJpZ2h0OjBweDtcclxuICAgICAgICB0b3A6IDBweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgcGFkZGluZzogNXB4O1xyXG4gICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgfSAgICBcclxuIFxyXG4gICAgLnNsaWRlcnZhbHVlIHtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogMTBweDtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICB9IFxyXG4gICAgLmVsZW1lbnQtcHJvcGVydGllcyBidXR0b24ge1xyXG4gICAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICBtaW4td2lkdGg6IDcwcHg7XHJcbiAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMjcsIDIwNiwgMTE2KTtcclxuICAgICAgICBib3JkZXItY29sb3I6IHJnYigxMjgsIDEyOCwgMTI4KTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgIH1cclxuXHJcbiAgICAuZWxlbWVudC1wcm9wZXJ0aWVzIC5kZWxldGUge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICB9ICAgICAgIFxyXG4vKiBjaGVja2JveCAqL1xyXG4uY2hlY2tib3gtd3JhcHBlci0zIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxufSAuY2hlY2tib3gtd3JhcHBlci0zIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXSB7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gIH1cclxuXHJcbiAgLmNoZWNrYm94LXdyYXBwZXItMyAudG9nZ2xlIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgd2lkdGg6IDQwcHg7XHJcbiAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcclxuICB9XHJcbiAgLmNoZWNrYm94LXdyYXBwZXItMyAudG9nZ2xlOmJlZm9yZSB7XHJcbiAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgdG9wOiAzcHg7XHJcbiAgICBsZWZ0OiAzcHg7XHJcbiAgICB3aWR0aDogMzRweDtcclxuICAgIGhlaWdodDogMTRweDtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgYmFja2dyb3VuZDogIzlBOTk5OTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycyBlYXNlO1xyXG4gIH1cclxuICAuY2hlY2tib3gtd3JhcHBlci0zIC50b2dnbGUgc3BhbiB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgd2lkdGg6IDIwcHg7XHJcbiAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgIGJveC1zaGFkb3c6IDAgM3B4IDhweCByZ2JhKDE1NCwgMTUzLCAxNTMsIDAuNSk7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xyXG4gIH1cclxuICAuY2hlY2tib3gtd3JhcHBlci0zIC50b2dnbGUgc3BhbjpiZWZvcmUge1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgbWFyZ2luOiAtMThweDtcclxuICAgIHdpZHRoOiA1NnB4O1xyXG4gICAgaGVpZ2h0OiA1NnB4O1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSg3OSwgNDYsIDIyMCwgMC41KTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAuY2hlY2tib3gtd3JhcHBlci0zIGlucHV0OmNoZWNrZWQgKyAudG9nZ2xlOmJlZm9yZSB7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjI3LCAyMDYsIDExNik7XHJcbiAgfVxyXG4gIC5jaGVja2JveC13cmFwcGVyLTMgaW5wdXQ6Y2hlY2tlZCArIC50b2dnbGUgc3BhbiB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjY2RhNjAwO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDIwcHgpO1xyXG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgY3ViaWMtYmV6aWVyKDAuOCwgMC40LCAwLjMsIDEuMjUpLCBiYWNrZ3JvdW5kIDAuMTVzIGVhc2U7XHJcbiAgICBib3gtc2hhZG93OiAwIDNweCA4cHggcmdiYSg3OSwgNDYsIDIyMCwgMC4yKTtcclxuICB9XHJcbiAgLmNoZWNrYm94LXdyYXBwZXItMyBpbnB1dDpjaGVja2VkICsgLnRvZ2dsZSBzcGFuOmJlZm9yZSB7XHJcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xyXG4gICAgb3BhY2l0eTogMDtcclxuICAgIHRyYW5zaXRpb246IGFsbCAwLjRzIGVhc2U7XHJcbiAgfVxyXG4gIC5zaG93SGlkZGVuIHtcclxuICAgIG9wYWNpdHk6IDAuNTtcclxuICB9XHJcblxyXG4gIC5kcm9wX2xheWVycyB7XHJcbiAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcclxuICAgIG1hcmdpbi10b3A6MzBweDtcclxuICB9XHJcbjwvc3R5bGU+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrUEksNkNBQUUsQ0FDRSxVQUFVLENBQUUsVUFFaEIsQ0FDQSw2REFBaUIsQ0FDYixRQUFRLENBQUUsUUFBUSxDQUNsQixhQUFhLENBQUUsSUFDbkIsQ0FDQSwrQkFBZ0IsQ0FBQyxnREFBbUIsQ0FDaEMsT0FBTyxDQUFFLElBQUksQ0FDYixRQUFRLENBQUUsUUFBUSxDQUNsQixNQUFNLEdBQUcsQ0FDVCxHQUFHLENBQUUsR0FBRyxDQUNSLE1BQU0sQ0FBRSxPQUFPLENBQ2YsT0FBTyxDQUFFLEdBQUcsQ0FDWixnQkFBZ0IsQ0FBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNqQyxNQUFNLElBQUksQ0FDVixVQUFVLENBQUUsTUFDaEIsQ0FFQSwrQkFBZ0IsTUFBTSxDQUFDLGdEQUFtQixDQUN0QyxPQUFPLENBQUUsS0FDYixDQUNBLCtCQUFnQixDQUFDLG9DQUFPLENBQ3BCLFlBQVksQ0FBRSxJQUFJLENBQ2xCLGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsR0FBRyxDQUNaLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLFNBQVMsQ0FBRSxLQUVqQixDQUNFLCtCQUFnQixDQUFDLG1DQUFLLENBQUMscURBQVMsQ0FDNUIsVUFBVSxDQUFFLElBQUksQ0FDaEIsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLFlBQVksQ0FDckIsTUFBTSxLQUFLLENBQ1gsTUFBTSxDQUFFLENBQUMsQ0FDVCxTQUFTLENBQUUsS0FDZixDQUNBLHdEQUFZLENBQ1IsUUFBUSxDQUFDLENBQ1QsT0FBTyxDQUNYLENBQ0EsdURBQVUsQ0FBQyxzREFBVSxDQUNqQixLQUFLLENBQUUsS0FDWCxDQUNBLCtCQUFnQixDQUFDLG1DQUFNLENBQ25CLFNBQVMsQ0FBRSxLQUFLLENBQ2hCLE9BQU8sQ0FBRSxZQUNiLENBQ0EsK0JBQWdCLENBQUMsNENBQWUsQ0FDNUIsY0FBYyxDQUFFLEdBRXBCLENBQ0EsK0JBQWdCLENBQUMsNkNBQWdCLENBQzdCLGNBQWMsQ0FBRSxHQUNwQixDQUNBLCtCQUFnQixDQUFDLGdEQUFtQixDQUNoQyxjQUFjLENBQUUsSUFDcEIsQ0FDQSwrQkFBZ0IsQ0FBQyxnREFBbUIsQ0FDaEMsY0FBYyxDQUFFLElBQ3BCLENBQ0EsK0JBQWdCLENBQUMsMkNBQWMsQ0FDM0IsY0FBYyxDQUFFLElBQ3BCLENBQ0EsZ0VBQW9CLENBQ2hCLGdCQUFnQixDQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ2pDLE9BQU8sQ0FBRSxJQUFJLENBQ2IsUUFBUSxLQUFLLENBQ2IsUUFBUSxDQUFFLFFBRWQsQ0FDQSxrQ0FBbUIsQ0FBQyxtQ0FBTSxDQUN0QixTQUFTLENBQUUsS0FBSyxDQUNoQixPQUFPLENBQUUsWUFDYixDQUNBLGtDQUFtQixDQUFDLG1DQUFLLENBQUMscURBQVMsQ0FDL0IsVUFBVSxDQUFFLElBQUksQ0FDaEIsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLFlBQVksQ0FDckIsTUFBTSxLQUFLLENBQ1gsTUFBTSxDQUFFLENBQ1osQ0FDQSxzREFBVSxDQUNOLE9BQU8sQ0FBRSxLQUFLLENBQ2QsYUFBYSxDQUFFLElBQ25CLENBQ0Esa0NBQW1CLENBQUMsd0NBQVcsQ0FDM0IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsTUFBTSxHQUFHLENBQ1QsR0FBRyxDQUFFLEdBQUcsQ0FDUixNQUFNLENBQUUsT0FBTyxDQUNmLE9BQU8sQ0FBRSxHQUFHLENBQ1osS0FBSyxDQUFFLElBQ1gsQ0FFQSx5REFBYSxDQUNULGNBQWMsQ0FBRSxJQUFJLENBQ3BCLFlBQVksQ0FBRSxJQUNsQixDQUNBLGtDQUFtQixDQUFDLG9DQUFPLENBQ3ZCLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ25JLFNBQVMsQ0FBRSxJQUFJLENBQ2YsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsS0FBSyxDQUNaLGdCQUFnQixDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLFlBQVksQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxhQUFhLENBQUUsR0FBRyxDQUNsQixNQUFNLENBQUUsT0FBTyxDQUNmLFlBQVksQ0FBRSxJQUNsQixDQUVBLGtDQUFtQixDQUFDLHFDQUFRLENBQ3hCLGdCQUFnQixDQUFFLEdBQUcsQ0FDckIsS0FBSyxDQUFFLEtBQ1gsQ0FFSixnRUFBb0IsQ0FDaEIsT0FBTyxDQUFFLFlBQ2IsQ0FBRSxrQ0FBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsK0JBQUUsQ0FDekMsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsT0FBTyxDQUFFLElBQ1gsQ0FFQSxrQ0FBbUIsQ0FBQyxxQ0FBUSxDQUMxQixRQUFRLENBQUUsUUFBUSxDQUNsQixPQUFPLENBQUUsS0FBSyxDQUNkLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsT0FBTyxDQUNmLDJCQUEyQixDQUFFLFdBQVcsQ0FDeEMsU0FBUyxDQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNoQyxDQUNBLGtDQUFtQixDQUFDLHFDQUFPLE9BQVEsQ0FDakMsT0FBTyxDQUFFLEVBQUUsQ0FDWCxRQUFRLENBQUUsUUFBUSxDQUNsQixHQUFHLENBQUUsR0FBRyxDQUNSLElBQUksQ0FBRSxHQUFHLENBQ1QsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLE9BQU8sQ0FBRSxLQUFLLENBQ2QsVUFBVSxDQUFFLE9BQU8sQ0FDbkIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsVUFBVSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFDOUIsQ0FDQSxrQ0FBbUIsQ0FBQyxPQUFPLENBQUMsa0NBQUssQ0FDL0IsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLENBQUMsQ0FDTixJQUFJLENBQUUsQ0FBQyxDQUNQLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixPQUFPLENBQUUsS0FBSyxDQUNkLFVBQVUsQ0FBRSxLQUFLLENBQ2pCLGFBQWEsQ0FBRSxJQUFJLENBQ25CLFVBQVUsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUM5QyxVQUFVLENBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUN2QixDQUNBLGtDQUFtQixDQUFDLE9BQU8sQ0FBQyxrQ0FBSSxPQUFRLENBQ3RDLE9BQU8sQ0FBRSxFQUFFLENBQ1gsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLEtBQUssQ0FDZCxNQUFNLENBQUUsS0FBSyxDQUNiLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDbEMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsU0FBUyxDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQ25CLE9BQU8sQ0FBRSxDQUFDLENBQ1YsY0FBYyxDQUFFLElBQ2xCLENBRUEsa0NBQW1CLENBQUMsb0JBQUssUUFBUSxDQUFHLHNCQUFPLE9BQVEsQ0FDakQsVUFBVSxDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUMvQixDQUNBLGtDQUFtQixDQUFDLEtBQUssUUFBUSxDQUFHLE9BQU8sQ0FBQyxrQ0FBSyxDQUMvQyxVQUFVLENBQUUsT0FBTyxDQUNuQixTQUFTLENBQUUsV0FBVyxJQUFJLENBQUMsQ0FDM0IsVUFBVSxDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUM3RSxVQUFVLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQzdDLENBQ0Esa0NBQW1CLENBQUMsS0FBSyxRQUFRLENBQUcsT0FBTyxDQUFDLGtDQUFJLE9BQVEsQ0FDdEQsU0FBUyxDQUFFLE1BQU0sQ0FBQyxDQUFDLENBQ25CLE9BQU8sQ0FBRSxDQUFDLENBQ1YsVUFBVSxDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFDdkIsQ0FDQSx3REFBWSxDQUNWLE9BQU8sQ0FBRSxHQUNYLENBRUEseURBQWEsQ0FDWCxRQUFRLFlBQVksQ0FDcEIsV0FBVyxJQUNiIn0= */");
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i][0];
    	child_ctx[47] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	child_ctx[52] = i;
    	return child_ctx;
    }

    function get_each_context_3$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[55] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[58] = list[i];
    	child_ctx[60] = i;
    	return child_ctx;
    }

    // (65:4) {#if readonly!=="readonly"}
    function create_if_block_25$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Edit";
    			attr_dev(div, "class", "editElementButton svelte-18iagk8");
    			add_location(div, file$7, 66, 8, 2176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*openProperties*/ ctx[12], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_25$1.name,
    		type: "if",
    		source: "(65:4) {#if readonly!==\\\"readonly\\\"}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#if element.type==="advanced_options"}
    function create_if_block_24$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Show Advanced Options";
    			attr_dev(button, "class", "svelte-18iagk8");
    			add_location(button, file$7, 71, 8, 2409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[16], false, false, false, false);
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
    		id: create_if_block_24$1.name,
    		type: "if",
    		source: "(70:4) {#if element.type===\\\"advanced_options\\\"}",
    		ctx
    	});

    	return block;
    }

    // (75:4) {#if element.type==="layer_image"}
    function create_if_block_23$1(ctx) {
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
    			attr_dev(label, "class", "layer_image_label svelte-18iagk8");
    			add_location(label, file$7, 75, 8, 2592);
    			attr_dev(img, "name", img_name_value = /*element*/ ctx[0].name);
    			if (!src_url_equal(img.src, img_src_value = layer_image_preview)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-18iagk8");
    			add_location(img, file$7, 77, 8, 2732);
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

    			if (dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && img_name_value !== (img_name_value = /*element*/ ctx[0].name)) {
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
    		id: create_if_block_23$1.name,
    		type: "if",
    		source: "(75:4) {#if element.type===\\\"layer_image\\\"}",
    		ctx
    	});

    	return block;
    }

    // (80:4) {#if element.type==="drop_layers"}
    function create_if_block_22$1(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let each_1_anchor;
    	let current;
    	let each_value_4 = Array(parseInt(/*element*/ ctx[0].num_layers));
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4$3(get_each_context_4$3(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(label, "for", label_for_value = /*element*/ ctx[0].name);
    			attr_dev(label, "class", "layer_drop_layers svelte-18iagk8");
    			add_location(label, file$7, 80, 8, 2849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*element*/ 1) && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element*/ 1) {
    				each_value_4 = Array(parseInt(/*element*/ ctx[0].num_layers));
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$3(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_4$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
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
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22$1.name,
    		type: "if",
    		source: "(80:4) {#if element.type===\\\"drop_layers\\\"}",
    		ctx
    	});

    	return block;
    }

    // (82:12) {#each Array(parseInt(element.num_layers)) as _, i}
    function create_each_block_4$3(ctx) {
    	let div;
    	let layerstack3d;
    	let t;
    	let current;
    	layerstack3d = new LayerStack3D({ props: { mode: "drop" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(layerstack3d.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "drop_layers svelte-18iagk8");
    			add_location(div, file$7, 82, 16, 3008);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(layerstack3d, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layerstack3d.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layerstack3d.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layerstack3d);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$3.name,
    		type: "each",
    		source: "(82:12) {#each Array(parseInt(element.num_layers)) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (88:4) {#if element.type==="layer_image_ids"}
    function create_if_block_21$1(ctx) {
    	let layerstack3d;
    	let current;

    	layerstack3d = new LayerStack3D({
    			props: { layers: /*layers*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layerstack3d.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layerstack3d, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layerstack3d.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layerstack3d.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layerstack3d, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21$1.name,
    		type: "if",
    		source: "(88:4) {#if element.type===\\\"layer_image_ids\\\"}",
    		ctx
    	});

    	return block;
    }

    // (92:4) {#if element.type === 'color_picker'}
    function create_if_block_20$1(ctx) {
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
    			attr_dev(label, "class", "svelte-18iagk8");
    			add_location(label, file$7, 92, 8, 3318);
    			attr_dev(input, "type", "color");
    			attr_dev(input, "class", "textInput colorInput svelte-18iagk8");
    			attr_dev(input, "placeholder", input_placeholder_value = /*element*/ ctx[0].placeholder);
    			input.readOnly = /*readonly*/ ctx[4];
    			input.value = /*value*/ ctx[1];
    			add_location(input, file$7, 93, 8, 3378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[17], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_placeholder_value !== (input_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty[0] & /*value*/ 2) {
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
    		id: create_if_block_20$1.name,
    		type: "if",
    		source: "(92:4) {#if element.type === 'color_picker'}",
    		ctx
    	});

    	return block;
    }

    // (135:40) 
    function create_if_block_19$1(ctx) {
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
    			attr_dev(label, "class", "svelte-18iagk8");
    			add_location(label, file$7, 135, 8, 6054);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			input.readOnly = /*readonly*/ ctx[4];
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = /*value*/ ctx[1];
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-18iagk8");
    			add_location(input, file$7, 136, 8, 6114);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler_7*/ ctx[24], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
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
    		id: create_if_block_19$1.name,
    		type: "if",
    		source: "(135:40) ",
    		ctx
    	});

    	return block;
    }

    // (132:40) 
    function create_if_block_18$2(ctx) {
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
    			attr_dev(label, "class", "slider_label svelte-18iagk8");
    			add_location(label, file$7, 132, 8, 5715);
    			attr_dev(span, "class", "slidervalue svelte-18iagk8");
    			add_location(span, file$7, 133, 8, 5796);
    			input.readOnly = /*readonly*/ ctx[4];
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", input_min_value = /*element*/ ctx[0].min);
    			attr_dev(input, "max", input_max_value = /*element*/ ctx[0].max);
    			attr_dev(input, "step", input_step_value = /*element*/ ctx[0].step);
    			input.value = /*value*/ ctx[1];
    			attr_dev(input, "name", input_name_value = /*element*/ ctx[0].name);
    			attr_dev(input, "class", "svelte-18iagk8");
    			add_location(input, file$7, 133, 48, 5836);
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
    				dispose = listen_dev(input, "change", /*change_handler_6*/ ctx[23], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*value*/ 2) set_data_dev(t3, /*value*/ ctx[1]);

    			if (dirty[0] & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_min_value !== (input_min_value = /*element*/ ctx[0].min)) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_max_value !== (input_max_value = /*element*/ ctx[0].max)) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_step_value !== (input_step_value = /*element*/ ctx[0].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(input, "value", /*value*/ ctx[1]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_name_value !== (input_name_value = /*element*/ ctx[0].name)) {
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
    		id: create_if_block_18$2.name,
    		type: "if",
    		source: "(132:40) ",
    		ctx
    	});

    	return block;
    }

    // (119:53) 
    function create_if_block_15$2(ctx) {
    	let label;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label_for_value;
    	let t2;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*element*/ ctx[0].widget_name && /*$metadata*/ ctx[5].combo_values[/*element*/ ctx[0].widget_name]) return create_if_block_16$2;
    		if (!/*element*/ ctx[0].widget_name) return create_if_block_17$2;
    		return create_else_block$3;
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
    			attr_dev(label, "class", "svelte-18iagk8");
    			add_location(label, file$7, 119, 4, 5073);
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

    			if (dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
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
    		id: create_if_block_15$2.name,
    		type: "if",
    		source: "(119:53) ",
    		ctx
    	});

    	return block;
    }

    // (112:42) 
    function create_if_block_14$2(ctx) {
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
    			attr_dev(label, "class", "svelte-18iagk8");
    			add_location(label, file$7, 112, 4, 4656);
    			attr_dev(select, "name", select_name_value = /*element*/ ctx[0].name);
    			attr_dev(select, "class", "dropdown svelte-18iagk8");
    			attr_dev(select, "readonly", /*readonly*/ ctx[4]);
    			add_location(select, file$7, 113, 8, 4716);
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
    				dispose = listen_dev(select, "change", /*change_handler_4*/ ctx[21], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
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

    			if (dirty[0] & /*element, $metadata*/ 33 && select_name_value !== (select_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(select, "name", select_name_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				attr_dev(select, "readonly", /*readonly*/ ctx[4]);
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
    		id: create_if_block_14$2.name,
    		type: "if",
    		source: "(112:42) ",
    		ctx
    	});

    	return block;
    }

    // (102:43) 
    function create_if_block_13$2(ctx) {
    	let label0;
    	let t0_value = /*element*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let label0_for_value;
    	let t2;
    	let div;
    	let input;
    	let input_id_value;
    	let t3;
    	let label1;
    	let span;
    	let label1_for_value;
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
    			attr_dev(label0, "class", "checkboxLabel svelte-18iagk8");
    			add_location(label0, file$7, 102, 8, 4146);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", input_id_value = /*element*/ ctx[0].name);
    			input.readOnly = /*readonly*/ ctx[4];
    			input.checked = /*value*/ ctx[1];
    			attr_dev(input, "class", "svelte-18iagk8");
    			add_location(input, file$7, 107, 8, 4396);
    			attr_dev(span, "class", "svelte-18iagk8");
    			add_location(span, file$7, 108, 49, 4567);
    			attr_dev(label1, "for", label1_for_value = /*element*/ ctx[0].name);
    			attr_dev(label1, "class", "toggle svelte-18iagk8");
    			add_location(label1, file$7, 108, 8, 4526);
    			attr_dev(div, "class", "checkbox-wrapper-3 svelte-18iagk8");
    			add_location(div, file$7, 106, 8, 4354);
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
    				dispose = listen_dev(input, "change", /*change_handler_3*/ ctx[20], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 33 && label0_for_value !== (label0_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label0, "for", label0_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_id_value !== (input_id_value = /*element*/ ctx[0].name)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty[0] & /*value*/ 2) {
    				prop_dev(input, "checked", /*value*/ ctx[1]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && label1_for_value !== (label1_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label1, "for", label1_for_value);
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
    		id: create_if_block_13$2.name,
    		type: "if",
    		source: "(102:43) ",
    		ctx
    	});

    	return block;
    }

    // (99:42) 
    function create_if_block_12$2(ctx) {
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
    			attr_dev(label, "class", "textarea_label svelte-18iagk8");
    			add_location(label, file$7, 99, 8, 3846);
    			attr_dev(textarea, "class", "textarea svelte-18iagk8");
    			attr_dev(textarea, "placeholder", textarea_placeholder_value = /*element*/ ctx[0].placeholder);
    			textarea.readOnly = /*readonly*/ ctx[4];
    			attr_dev(textarea, "name", textarea_name_value = /*element*/ ctx[0].name);
    			textarea.value = /*value*/ ctx[1];
    			add_location(textarea, file$7, 100, 8, 3929);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, textarea, anchor);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "change", /*change_handler_2*/ ctx[19], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && textarea_placeholder_value !== (textarea_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(textarea, "placeholder", textarea_placeholder_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				prop_dev(textarea, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && textarea_name_value !== (textarea_name_value = /*element*/ ctx[0].name)) {
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
    		id: create_if_block_12$2.name,
    		type: "if",
    		source: "(99:42) ",
    		ctx
    	});

    	return block;
    }

    // (96:4) {#if element.type === 'text'}
    function create_if_block_11$2(ctx) {
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
    			attr_dev(label, "class", "svelte-18iagk8");
    			add_location(label, file$7, 96, 8, 3591);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "textInput svelte-18iagk8");
    			attr_dev(input, "placeholder", input_placeholder_value = /*element*/ ctx[0].placeholder);
    			input.readOnly = /*readonly*/ ctx[4];
    			input.value = /*value*/ ctx[1];
    			add_location(input, file$7, 97, 8, 3651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler_1*/ ctx[18], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*element*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 33 && label_for_value !== (label_for_value = /*element*/ ctx[0].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input_placeholder_value !== (input_placeholder_value = /*element*/ ctx[0].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
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
    		id: create_if_block_11$2.name,
    		type: "if",
    		source: "(96:4) {#if element.type === 'text'}",
    		ctx
    	});

    	return block;
    }

    // (129:8) {:else}
    function create_else_block$3(ctx) {
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(129:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (127:39) 
    function create_if_block_17$2(ctx) {
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
    		id: create_if_block_17$2.name,
    		type: "if",
    		source: "(127:39) ",
    		ctx
    	});

    	return block;
    }

    // (121:8) {#if element.widget_name && $metadata.combo_values[element.widget_name] }
    function create_if_block_16$2(ctx) {
    	let select;
    	let select_name_value;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*$metadata*/ ctx[5].combo_values[/*element*/ ctx[0].widget_name];
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
    			attr_dev(select, "class", "dropdown svelte-18iagk8");
    			attr_dev(select, "readonly", /*readonly*/ ctx[4]);
    			add_location(select, file$7, 121, 8, 5216);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*change_handler_5*/ ctx[22], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata, element, value*/ 35) {
    				each_value_3 = /*$metadata*/ ctx[5].combo_values[/*element*/ ctx[0].widget_name];
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

    			if (dirty[0] & /*element, $metadata*/ 33 && select_name_value !== (select_name_value = /*element*/ ctx[0].name)) {
    				attr_dev(select, "name", select_name_value);
    			}

    			if (dirty[0] & /*readonly*/ 16) {
    				attr_dev(select, "readonly", /*readonly*/ ctx[4]);
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
    		id: create_if_block_16$2.name,
    		type: "if",
    		source: "(121:8) {#if element.widget_name && $metadata.combo_values[element.widget_name] }",
    		ctx
    	});

    	return block;
    }

    // (123:10) {#each $metadata.combo_values[element.widget_name] as v}
    function create_each_block_3$3(ctx) {
    	let option;
    	let t0_value = /*v*/ ctx[55] + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*v*/ ctx[55];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*value*/ ctx[1] === /*v*/ ctx[55];
    			attr_dev(option, "class", "svelte-18iagk8");
    			add_location(option, file$7, 123, 16, 5408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata, element*/ 33 && t0_value !== (t0_value = /*v*/ ctx[55] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$metadata, element*/ 33 && option_value_value !== (option_value_value = /*v*/ ctx[55])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*value, $metadata, element*/ 35 && option_selected_value !== (option_selected_value = /*value*/ ctx[1] === /*v*/ ctx[55])) {
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
    		source: "(123:10) {#each $metadata.combo_values[element.widget_name] as v}",
    		ctx
    	});

    	return block;
    }

    // (115:12) {#each element.options as option}
    function create_each_block_2$3(ctx) {
    	let option;
    	let t0_value = /*option*/ ctx[50].text + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*option*/ ctx[50].value;
    			option.value = option.__value;
    			option.selected = option_selected_value = /*value*/ ctx[1] === /*option*/ ctx[50].value;
    			attr_dev(option, "class", "svelte-18iagk8");
    			add_location(option, file$7, 115, 16, 4888);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element*/ 1 && t0_value !== (t0_value = /*option*/ ctx[50].text + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*element, $metadata*/ 33 && option_value_value !== (option_value_value = /*option*/ ctx[50].value)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*value, element, $metadata*/ 35 && option_selected_value !== (option_selected_value = /*value*/ ctx[1] === /*option*/ ctx[50].value)) {
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
    		source: "(115:12) {#each element.options as option}",
    		ctx
    	});

    	return block;
    }

    // (140:0) {#if showProperties}
    function create_if_block$6(ctx) {
    	let div2;
    	let div0;
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
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let if_block0 = /*element*/ ctx[0].type !== 'layer_image' && /*element*/ ctx[0].type !== "advanced_options" && /*element*/ ctx[0].type !== "drop_layers" && create_if_block_10$2(ctx);
    	let if_block1 = (/*element*/ ctx[0].type === 'text' || /*element*/ ctx[0].type === 'textarea' || /*element*/ ctx[0].type === 'number' || /*element*/ ctx[0].type === 'color_picker') && create_if_block_9$2(ctx);
    	let if_block2 = /*element*/ ctx[0].type === 'layer_image' && create_if_block_8$2(ctx);
    	let if_block3 = /*element*/ ctx[0].type === 'drop_layers' && create_if_block_7$2(ctx);
    	let if_block4 = /*element*/ ctx[0].type === 'dropdown' && create_if_block_6$2(ctx);
    	let if_block5 = /*element*/ ctx[0].type === 'pre_filled_dropdown' && create_if_block_4$2(ctx);
    	let if_block6 = (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') && create_if_block_3$2(ctx);
    	let if_block7 = /*element*/ ctx[0].type === 'number' && create_if_block_2$3(ctx);
    	let if_block8 = /*element*/ ctx[0].type === 'slider' && create_if_block_1$5(ctx);

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
    			if (if_block6) if_block6.c();
    			t8 = space();
    			if (if_block7) if_block7.c();
    			t9 = space();
    			if (if_block8) if_block8.c();
    			t10 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(div0, "class", "formClose svelte-18iagk8");
    			add_location(div0, file$7, 142, 4, 6429);
    			attr_dev(button, "class", "delete svelte-18iagk8");
    			add_location(button, file$7, 236, 9, 11564);
    			attr_dev(div1, "class", "svelte-18iagk8");
    			add_location(div1, file$7, 236, 4, 11559);
    			attr_dev(div2, "class", "element-properties svelte-18iagk8");
    			add_location(div2, file$7, 140, 0, 6328);
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
    			if (if_block6) if_block6.m(div2, null);
    			append_dev(div2, t8);
    			if (if_block7) if_block7.m(div2, null);
    			append_dev(div2, t9);
    			if (if_block8) if_block8.m(div2, null);
    			append_dev(div2, t10);
    			append_dev(div2, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*closeProperties*/ ctx[13], false, false, false, false),
    					listen_dev(button, "click", /*click_handler_4*/ ctx[45], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*element*/ ctx[0].type !== 'layer_image' && /*element*/ ctx[0].type !== "advanced_options" && /*element*/ ctx[0].type !== "drop_layers") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_10$2(ctx);
    					if_block0.c();
    					if_block0.m(div2, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*element*/ ctx[0].type === 'text' || /*element*/ ctx[0].type === 'textarea' || /*element*/ ctx[0].type === 'number' || /*element*/ ctx[0].type === 'color_picker') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_9$2(ctx);
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
    					if_block2 = create_if_block_8$2(ctx);
    					if_block2.c();
    					if_block2.m(div2, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*element*/ ctx[0].type === 'drop_layers') {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_7$2(ctx);
    					if_block3.c();
    					if_block3.m(div2, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*element*/ ctx[0].type === 'dropdown') {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_6$2(ctx);
    					if_block4.c();
    					if_block4.m(div2, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*element*/ ctx[0].type === 'pre_filled_dropdown') {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_4$2(ctx);
    					if_block5.c();
    					if_block5.m(div2, t7);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*element*/ ctx[0].type === 'slider' || /*element*/ ctx[0].type === 'number') {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_3$2(ctx);
    					if_block6.c();
    					if_block6.m(div2, t8);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*element*/ ctx[0].type === 'number') {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_2$3(ctx);
    					if_block7.c();
    					if_block7.m(div2, t9);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*element*/ ctx[0].type === 'slider') {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_1$5(ctx);
    					if_block8.c();
    					if_block8.m(div2, t10);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
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
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(140:0) {#if showProperties}",
    		ctx
    	});

    	return block;
    }

    // (144:4) {#if element.type !== 'layer_image' &&  element.type!=="advanced_options"  &&  element.type!=="drop_layers"}
    function create_if_block_10$2(ctx) {
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
    			attr_dev(label0, "class", "svelte-18iagk8");
    			add_location(label0, file$7, 145, 12, 6648);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "label");
    			input0.value = input0_value_value = /*element*/ ctx[0].label;
    			attr_dev(input0, "class", "svelte-18iagk8");
    			add_location(input0, file$7, 146, 12, 6695);
    			attr_dev(div0, "class", "formLine svelte-18iagk8");
    			add_location(div0, file$7, 144, 8, 6611);
    			attr_dev(label1, "for", "name");
    			attr_dev(label1, "class", "svelte-18iagk8");
    			add_location(label1, file$7, 149, 12, 6872);
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*element*/ ctx[0].name;
    			attr_dev(input1, "class", "svelte-18iagk8");
    			add_location(input1, file$7, 150, 8, 6916);
    			attr_dev(div1, "class", "formLine svelte-18iagk8");
    			add_location(div1, file$7, 148, 8, 6836);
    			attr_dev(label2, "for", "default");
    			attr_dev(label2, "class", "svelte-18iagk8");
    			add_location(label2, file$7, 153, 12, 7081);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "default");
    			input2.value = input2_value_value = /*element*/ ctx[0].default;
    			attr_dev(input2, "class", "svelte-18iagk8");
    			add_location(input2, file$7, 154, 8, 7137);
    			attr_dev(div2, "class", "formLine svelte-18iagk8");
    			add_location(div2, file$7, 152, 8, 7045);
    			attr_dev(label3, "for", "hidden");
    			attr_dev(label3, "class", "svelte-18iagk8");
    			add_location(label3, file$7, 157, 12, 7324);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "name", "hidden");
    			attr_dev(input3, "class", "svelte-18iagk8");
    			add_location(input3, file$7, 158, 12, 7375);
    			attr_dev(div3, "class", "formLine svelte-18iagk8");
    			add_location(div3, file$7, 156, 8, 7288);
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
    					listen_dev(input0, "input", /*input_handler*/ ctx[25], false, false, false, false),
    					listen_dev(input1, "change", /*change_handler_8*/ ctx[26], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_1*/ ctx[27], false, false, false, false),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 33 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].label) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].name) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].default) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33) {
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
    		id: create_if_block_10$2.name,
    		type: "if",
    		source: "(144:4) {#if element.type !== 'layer_image' &&  element.type!==\\\"advanced_options\\\"  &&  element.type!==\\\"drop_layers\\\"}",
    		ctx
    	});

    	return block;
    }

    // (162:4) {#if element.type === 'text' || element.type === 'textarea' || element.type === 'number'  || element.type === 'color_picker'}}
    function create_if_block_9$2(ctx) {
    	let t0;
    	let div;
    	let label;
    	let t2;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("}\r\n        ");
    			div = element("div");
    			label = element("label");
    			label.textContent = "Placeholder:";
    			t2 = space();
    			input = element("input");
    			attr_dev(label, "for", "placeholder");
    			attr_dev(label, "class", "svelte-18iagk8");
    			add_location(label, file$7, 163, 12, 7676);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "placeholder");
    			input.value = input_value_value = /*element*/ ctx[0].placeholder;
    			attr_dev(input, "class", "svelte-18iagk8");
    			add_location(input, file$7, 164, 8, 7734);
    			attr_dev(div, "class", "formLine svelte-18iagk8");
    			add_location(div, file$7, 162, 8, 7640);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t2);
    			append_dev(div, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler_2*/ ctx[29], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 33 && input_value_value !== (input_value_value = /*element*/ ctx[0].placeholder) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$2.name,
    		type: "if",
    		source: "(162:4) {#if element.type === 'text' || element.type === 'textarea' || element.type === 'number'  || element.type === 'color_picker'}}",
    		ctx
    	});

    	return block;
    }

    // (168:4) {#if element.type === 'layer_image' }
    function create_if_block_8$2(ctx) {
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
    			attr_dev(label0, "class", "svelte-18iagk8");
    			add_location(label0, file$7, 169, 12, 7985);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			input0.value = input0_value_value = /*element*/ ctx[0].name;
    			attr_dev(input0, "class", "svelte-18iagk8");
    			add_location(input0, file$7, 170, 12, 8033);
    			attr_dev(div0, "class", "formLine svelte-18iagk8");
    			add_location(div0, file$7, 168, 8, 7949);
    			attr_dev(label1, "for", "from_selection");
    			attr_dev(label1, "class", "svelte-18iagk8");
    			add_location(label1, file$7, 173, 12, 8208);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "from_selection");
    			attr_dev(input1, "class", "svelte-18iagk8");
    			add_location(input1, file$7, 174, 12, 8271);
    			attr_dev(div1, "class", "formLine svelte-18iagk8");
    			add_location(div1, file$7, 172, 8, 8172);
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
    					listen_dev(input0, "change", /*change_handler_9*/ ctx[30], false, false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[31])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 33 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].name) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33) {
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
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(168:4) {#if element.type === 'layer_image' }",
    		ctx
    	});

    	return block;
    }

    // (178:4) {#if element.type === 'drop_layers' }
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
    			label1.textContent = "Label:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Number:";
    			t7 = space();
    			input2 = element("input");
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-18iagk8");
    			add_location(label0, file$7, 179, 12, 8494);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			input0.value = input0_value_value = /*element*/ ctx[0].name;
    			attr_dev(input0, "class", "svelte-18iagk8");
    			add_location(input0, file$7, 180, 12, 8542);
    			attr_dev(div0, "class", "formLine svelte-18iagk8");
    			add_location(div0, file$7, 178, 8, 8458);
    			attr_dev(label1, "for", "name");
    			attr_dev(label1, "class", "svelte-18iagk8");
    			add_location(label1, file$7, 183, 12, 8717);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "name");
    			input1.value = input1_value_value = /*element*/ ctx[0].label;
    			attr_dev(input1, "class", "svelte-18iagk8");
    			add_location(input1, file$7, 184, 12, 8766);
    			attr_dev(div1, "class", "formLine svelte-18iagk8");
    			add_location(div1, file$7, 182, 8, 8681);
    			attr_dev(label2, "for", "name");
    			attr_dev(label2, "class", "svelte-18iagk8");
    			add_location(label2, file$7, 187, 12, 8947);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "name");
    			input2.value = input2_value_value = /*element*/ ctx[0].num_layers;
    			attr_dev(input2, "class", "svelte-18iagk8");
    			add_location(input2, file$7, 188, 12, 8997);
    			attr_dev(div2, "class", "formLine svelte-18iagk8");
    			add_location(div2, file$7, 186, 8, 8911);
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
    					listen_dev(input0, "change", /*change_handler_10*/ ctx[32], false, false, false, false),
    					listen_dev(input1, "change", /*change_handler_11*/ ctx[33], false, false, false, false),
    					listen_dev(input2, "change", /*change_handler_12*/ ctx[34], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 33 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].name) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].label) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].num_layers) && input2.value !== input2_value_value) {
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
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(178:4) {#if element.type === 'drop_layers' }",
    		ctx
    	});

    	return block;
    }

    // (192:4) {#if element.type === 'dropdown'}
    function create_if_block_6$2(ctx) {
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
    			attr_dev(button, "class", "svelte-18iagk8");
    			add_location(button, file$7, 201, 8, 9821);
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
    				dispose = listen_dev(button, "click", /*addOption*/ ctx[10], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*removeOption, element, handleOptionChange*/ 2561) {
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
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(192:4) {#if element.type === 'dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (193:8) {#each element.options as option, index}
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
    		return /*input_handler_3*/ ctx[35](/*index*/ ctx[52], ...args);
    	}

    	function input_handler_4(...args) {
    		return /*input_handler_4*/ ctx[36](/*index*/ ctx[52], ...args);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[37](/*index*/ ctx[52]);
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
    			attr_dev(label0, "class", "svelte-18iagk8");
    			add_location(label0, file$7, 194, 16, 9318);
    			attr_dev(input0, "name", "text");
    			attr_dev(input0, "type", "text");
    			input0.value = input0_value_value = /*option*/ ctx[50].text;
    			attr_dev(input0, "class", "svelte-18iagk8");
    			add_location(input0, file$7, 194, 55, 9357);
    			attr_dev(div0, "class", "formLine svelte-18iagk8");
    			add_location(div0, file$7, 193, 12, 9278);
    			attr_dev(label1, "for", "key");
    			attr_dev(label1, "class", "svelte-18iagk8");
    			add_location(label1, file$7, 197, 16, 9539);
    			attr_dev(input1, "name", "value");
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = /*option*/ ctx[50].value;
    			attr_dev(input1, "class", "svelte-18iagk8");
    			add_location(input1, file$7, 197, 55, 9578);
    			attr_dev(button, "class", "svelte-18iagk8");
    			add_location(button, file$7, 198, 16, 9707);
    			attr_dev(div1, "class", "formLine svelte-18iagk8");
    			add_location(div1, file$7, 196, 12, 9499);
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

    			if (dirty[0] & /*element, $metadata*/ 33 && input0_value_value !== (input0_value_value = /*option*/ ctx[50].text) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input1_value_value !== (input1_value_value = /*option*/ ctx[50].value) && input1.value !== input1_value_value) {
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
    		source: "(193:8) {#each element.options as option, index}",
    		ctx
    	});

    	return block;
    }

    // (204:4) {#if element.type === 'pre_filled_dropdown'}
    function create_if_block_4$2(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let option;
    	let mounted;
    	let dispose;
    	let if_block = /*$metadata*/ ctx[5].combo_values && create_if_block_5$2(ctx);

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
    			attr_dev(label, "class", "svelte-18iagk8");
    			add_location(label, file$7, 205, 12, 9976);
    			option.__value = "Select...";
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-18iagk8");
    			add_location(option, file$7, 207, 16, 10187);
    			attr_dev(select, "name", "widget_name");
    			attr_dev(select, "class", "svelte-18iagk8");
    			if (/*element*/ ctx[0].widget_name === void 0) add_render_callback(() => /*select_change_handler*/ ctx[39].call(select));
    			add_location(select, file$7, 206, 12, 10039);
    			attr_dev(div, "class", "formLine svelte-18iagk8");
    			add_location(div, file$7, 204, 8, 9940);
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
    					listen_dev(select, "change", /*change_handler_13*/ ctx[38], false, false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[39])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*$metadata*/ ctx[5].combo_values) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$2(ctx);
    					if_block.c();
    					if_block.m(select, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*element, $metadata*/ 33) {
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
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(204:4) {#if element.type === 'pre_filled_dropdown'}",
    		ctx
    	});

    	return block;
    }

    // (209:16) {#if $metadata.combo_values}
    function create_if_block_5$2(ctx) {
    	let each_1_anchor;
    	let each_value = Object.entries(/*$metadata*/ ctx[5].combo_values);
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
    			if (dirty[0] & /*$metadata*/ 32) {
    				each_value = Object.entries(/*$metadata*/ ctx[5].combo_values);
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
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(209:16) {#if $metadata.combo_values}",
    		ctx
    	});

    	return block;
    }

    // (210:20) {#each Object.entries($metadata.combo_values) as [widget_name,values]}
    function create_each_block$5(ctx) {
    	let option;
    	let t_value = /*widget_name*/ ctx[46] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*widget_name*/ ctx[46];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-18iagk8");
    			add_location(option, file$7, 210, 24, 10377);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$metadata*/ 32 && t_value !== (t_value = /*widget_name*/ ctx[46] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*$metadata*/ 32 && option_value_value !== (option_value_value = /*widget_name*/ ctx[46])) {
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
    		source: "(210:20) {#each Object.entries($metadata.combo_values) as [widget_name,values]}",
    		ctx
    	});

    	return block;
    }

    // (217:4) {#if element.type === 'slider' || element.type === 'number'}
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
    			attr_dev(label0, "class", "svelte-18iagk8");
    			add_location(label0, file$7, 218, 12, 10637);
    			attr_dev(input0, "name", "min");
    			attr_dev(input0, "type", "number");
    			input0.value = input0_value_value = /*element*/ ctx[0].min;
    			attr_dev(input0, "class", "svelte-18iagk8");
    			add_location(input0, file$7, 219, 12, 10682);
    			attr_dev(div0, "class", "formLine svelte-18iagk8");
    			add_location(div0, file$7, 217, 8, 10601);
    			attr_dev(label1, "for", "max");
    			attr_dev(label1, "class", "svelte-18iagk8");
    			add_location(label1, file$7, 222, 12, 10857);
    			attr_dev(input1, "name", "max");
    			attr_dev(input1, "type", "number");
    			input1.value = input1_value_value = /*element*/ ctx[0].max;
    			attr_dev(input1, "class", "svelte-18iagk8");
    			add_location(input1, file$7, 223, 12, 10902);
    			attr_dev(div1, "class", "formLine svelte-18iagk8");
    			add_location(div1, file$7, 221, 8, 10821);
    			attr_dev(label2, "for", "step");
    			attr_dev(label2, "class", "svelte-18iagk8");
    			add_location(label2, file$7, 226, 12, 11076);
    			attr_dev(input2, "name", "step");
    			attr_dev(input2, "type", "number");
    			input2.value = input2_value_value = /*element*/ ctx[0].step;
    			attr_dev(input2, "class", "svelte-18iagk8");
    			add_location(input2, file$7, 227, 12, 11123);
    			attr_dev(div2, "class", "formLine svelte-18iagk8");
    			add_location(div2, file$7, 225, 8, 11040);
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
    					listen_dev(input0, "input", /*input_handler_5*/ ctx[40], false, false, false, false),
    					listen_dev(input1, "input", /*input_handler_6*/ ctx[41], false, false, false, false),
    					listen_dev(input2, "input", /*input_handler_7*/ ctx[42], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*element, $metadata*/ 33 && input0_value_value !== (input0_value_value = /*element*/ ctx[0].min) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input1_value_value !== (input1_value_value = /*element*/ ctx[0].max) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty[0] & /*element, $metadata*/ 33 && input2_value_value !== (input2_value_value = /*element*/ ctx[0].step) && input2.value !== input2_value_value) {
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
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(217:4) {#if element.type === 'slider' || element.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    // (231:4) {#if element.type === 'number'}
    function create_if_block_2$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Convert to Slider";
    			attr_dev(button, "class", "svelte-18iagk8");
    			add_location(button, file$7, 231, 7, 11309);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[43], false, false, false, false);
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
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(231:4) {#if element.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    // (234:4) {#if element.type === 'slider'}
    function create_if_block_1$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Convert to Number";
    			attr_dev(button, "class", "svelte-18iagk8");
    			add_location(button, file$7, 234, 7, 11454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[44], false, false, false, false);
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(234:4) {#if element.type === 'slider'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let if_block7_anchor;
    	let current;
    	let if_block0 = /*readonly*/ ctx[4] !== "readonly" && create_if_block_25$1(ctx);
    	let if_block1 = /*element*/ ctx[0].type === "advanced_options" && create_if_block_24$1(ctx);
    	let if_block2 = /*element*/ ctx[0].type === "layer_image" && create_if_block_23$1(ctx);
    	let if_block3 = /*element*/ ctx[0].type === "drop_layers" && create_if_block_22$1(ctx);
    	let if_block4 = /*element*/ ctx[0].type === "layer_image_ids" && create_if_block_21$1(ctx);
    	let if_block5 = /*element*/ ctx[0].type === 'color_picker' && create_if_block_20$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*element*/ ctx[0].type === 'text') return create_if_block_11$2;
    		if (/*element*/ ctx[0].type === 'textarea') return create_if_block_12$2;
    		if (/*element*/ ctx[0].type === 'checkbox') return create_if_block_13$2;
    		if (/*element*/ ctx[0].type === 'dropdown') return create_if_block_14$2;
    		if (/*element*/ ctx[0].type === 'pre_filled_dropdown') return create_if_block_15$2;
    		if (/*element*/ ctx[0].type === 'slider') return create_if_block_18$2;
    		if (/*element*/ ctx[0].type === 'number') return create_if_block_19$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block6 = current_block_type && current_block_type(ctx);
    	let if_block7 = /*showProperties*/ ctx[3] && create_if_block$6(ctx);

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
    			if_block7_anchor = empty();
    			attr_dev(div, "class", "element-preview svelte-18iagk8");
    			toggle_class(div, "showHidden", /*element*/ ctx[0].hidden);
    			add_location(div, file$7, 63, 0, 2004);
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
    			insert_dev(target, t6, anchor);
    			if (if_block7) if_block7.m(target, anchor);
    			insert_dev(target, if_block7_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*readonly*/ ctx[4] !== "readonly") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_25$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*element*/ ctx[0].type === "advanced_options") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_24$1(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*element*/ ctx[0].type === "layer_image") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_23$1(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*element*/ ctx[0].type === "drop_layers") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*element*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_22$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*element*/ ctx[0].type === "layer_image_ids") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*element*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_21$1(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*element*/ ctx[0].type === 'color_picker') {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_20$1(ctx);
    					if_block5.c();
    					if_block5.m(div, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block6) {
    				if_block6.p(ctx, dirty);
    			} else {
    				if (if_block6) if_block6.d(1);
    				if_block6 = current_block_type && current_block_type(ctx);

    				if (if_block6) {
    					if_block6.c();
    					if_block6.m(div, null);
    				}
    			}

    			if (!current || dirty[0] & /*element*/ 1) {
    				toggle_class(div, "showHidden", /*element*/ ctx[0].hidden);
    			}

    			if (/*showProperties*/ ctx[3]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block$6(ctx);
    					if_block7.c();
    					if_block7.m(if_block7_anchor.parentNode, if_block7_anchor);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block3);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block3);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();

    			if (if_block6) {
    				if_block6.d();
    			}

    			if (detaching) detach_dev(t6);
    			if (if_block7) if_block7.d(detaching);
    			if (detaching) detach_dev(if_block7_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(5, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormElement', slots, []);
    	let { element } = $$props;
    	let { showProperties = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let { value } = $$props;
    	let { readonly = "" } = $$props;
    	let layers = [];

    	if (element.type === "slider") {
    		if (!value) value = element.min;
    	}

    	// Function to immediately update the parent component
    	function updateElement(updatedProps) {
    		$$invalidate(0, element = { ...element, ...updatedProps });

    		if (element.type === "slider" || element.type === "number") {
    			$$invalidate(1, value = element.default);
    			$$invalidate(0, element.min = parseFloat(element.min), element);
    			$$invalidate(0, element.max = parseFloat(element.max), element);
    			$$invalidate(0, element.default = parseFloat(element.default), element);
    		}

    		dispatch('update', element);
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

    	const writable_props = ['element', 'showProperties', 'value', 'readonly', 'advancedOptions'];

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

    	const change_handler_7 = e => {
    		changeValue(e.target.value);
    	};

    	const input_handler = e => updateElement({ label: e.target.value });
    	const change_handler_8 = e => updateElement({ name: e.target.value });
    	const input_handler_1 = e => updateElement({ default: e.target.value });

    	function input3_change_handler() {
    		element.hidden = this.checked;
    		$$invalidate(0, element);
    	}

    	const input_handler_2 = e => updateElement({ placeholder: e.target.value });
    	const change_handler_9 = e => updateElement({ name: e.target.value });

    	function input1_change_handler() {
    		element.from_selection = this.checked;
    		$$invalidate(0, element);
    	}

    	const change_handler_10 = e => updateElement({ name: e.target.value });
    	const change_handler_11 = e => updateElement({ label: e.target.value });
    	const change_handler_12 = e => updateElement({ num_layers: parseInt(e.target.value) });
    	const input_handler_3 = (index, e) => handleOptionChange(e, index, 'text');
    	const input_handler_4 = (index, e) => handleOptionChange(e, index, 'value');
    	const click_handler_1 = index => removeOption(index);
    	const change_handler_13 = e => updateElement({ widget_name: e.target.value });

    	function select_change_handler() {
    		element.widget_name = select_value(this);
    		$$invalidate(0, element);
    	}

    	const input_handler_5 = e => updateElement({ min: e.target.value });
    	const input_handler_6 = e => updateElement({ max: e.target.value });
    	const input_handler_7 = e => updateElement({ step: e.target.value });

    	const click_handler_2 = () => {
    		updateElement({ type: "slider" });
    	};

    	const click_handler_3 = () => {
    		updateElement({ type: "number" });
    	};

    	const click_handler_4 = () => deleteElement();

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('showProperties' in $$props) $$invalidate(3, showProperties = $$props.showProperties);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('readonly' in $$props) $$invalidate(4, readonly = $$props.readonly);
    		if ('advancedOptions' in $$props) $$invalidate(2, advancedOptions = $$props.advancedOptions);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		element,
    		showProperties,
    		layer_image_preview,
    		metadata,
    		LayerStack3D,
    		dispatch,
    		value,
    		readonly,
    		layers,
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
    		if ('readonly' in $$props) $$invalidate(4, readonly = $$props.readonly);
    		if ('layers' in $$props) $$invalidate(7, layers = $$props.layers);
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
    		readonly,
    		$metadata,
    		dispatch,
    		layers,
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
    		change_handler_7,
    		input_handler,
    		change_handler_8,
    		input_handler_1,
    		input3_change_handler,
    		input_handler_2,
    		change_handler_9,
    		input1_change_handler,
    		change_handler_10,
    		change_handler_11,
    		change_handler_12,
    		input_handler_3,
    		input_handler_4,
    		click_handler_1,
    		change_handler_13,
    		select_change_handler,
    		input_handler_5,
    		input_handler_6,
    		input_handler_7,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class FormElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				element: 0,
    				showProperties: 3,
    				value: 1,
    				readonly: 4,
    				advancedOptions: 2
    			},
    			add_css$8,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormElement",
    			options,
    			id: create_fragment$8.name
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

    	get readonly() {
    		throw new Error("<FormElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
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
            let res= {fields:JSON.parse(JSON.stringify(fields)),defaultFields,outputFields};
            for(let i=0;i<fields.length;i++) {
                let field=fields[i];
                if (field.type==="drop_layers") {
                    if (field.num_layers===1) continue  // only one image
                    for(let k=0;k<field.num_layers;k++) {
                        let newField={name:field.name+"_"+k,type:field.type,originalName:field.name,index:k};    // add new fields with underscore
                        res.fields.push(newField);
                    }
                }
            }


            return res
        }

        getNodeByType(workflow,type) {
            return workflow.nodes.find(node => node.type === type)
          }
        addMapping(metadata,nodeId,fromField,toField) {
            if (!toField || !fromField) return
            if (!nodeId) return
            if (!metadata.mappings) metadata.mappings={};
            let mappings=metadata.mappings[nodeId];
            if (!mappings) mappings=[];
            mappings.push({ fromField,toField  });
            mappings=mappings;
            metadata.mappings[nodeId] = mappings;
        }    

        cleanUpMappings(metadata) {
            let fieldNames={};
            let allFields=this.getMappingFields(metadata);
            for(let i=0;i<allFields.fields.length;i++) {
                let field=allFields.fields[i];
                fieldNames[field.name]=true;
            }
            for(let i=0;i<allFields.defaultFields.length;i++) {
                let field=allFields.defaultFields[i];
                fieldNames[field.name]=true;
            }        
            for(let i=0;i<allFields.outputFields.length;i++) {
                let field=allFields.outputFields[i];
                fieldNames[field.name]=true;
            }                
            for (let nodeId in metadata.mappings) {
                let mappings=metadata.mappings[nodeId];
                let filteredArray=[];
                for(let i=0;i<mappings.length;i++) {
                    let m=mappings[i];
                    if (fieldNames[m.fromField]) filteredArray.push(m);
                }
                metadata.mappings[nodeId]=filteredArray;            
            }
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
            if (!field) return ""
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
             //   console.log("executed:",leftValue,rule.condition,rightValue,res)
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

    var formTemplate_Txt2Image = {"default":{elements:[{name:"number_images",type:"slider",label:"Number images",options:[],"default":1,min:1,max:4,step:1},{name:"advanced_options",type:"advanced_options",label:"",options:[],"default":""},{name:"seed",type:"text",label:"Seed",options:[],"default":"",placeholder:"Empty = Random"}]}};

    var formTemplate_LayerMenu = {"default":{elements:[{name:"currentLayer",type:"layer_image",label:"Value_6y0om",options:[],"default":""},{name:"advanced_options",type:"advanced_options",label:"",options:[],"default":""},{name:"preview",type:"checkbox",label:"Preview",options:[],"default":"true",hidden:true}]}};

    /* src\Icon.svelte generated by Svelte v3.59.2 */
    const file$6 = "src\\Icon.svelte";

    function add_css$7(target) {
    	append_styles(target, "svelte-e4n68z", ".default.svelte-e4n68z.svelte-e4n68z{fill:white;display:inline-block;cursor:pointer;width:30px;text-align:center}.default.svelte-e4n68z.svelte-e4n68z:hover,.active.svelte-e4n68z.svelte-e4n68z{fill:black;background-color:#ddb74f;border-radius:5px}.deactivate.svelte-e4n68z.svelte-e4n68z{fill:grey;cursor:default}.deactivate.svelte-e4n68z.svelte-e4n68z:hover{fill:grey;background:transparent}.default.svelte-e4n68z svg.svelte-e4n68z{display:inline-block}.leftMenuIcon.svelte-e4n68z.svelte-e4n68z{padding-top:8px;height:30px}.leftMenuIcon2.svelte-e4n68z.svelte-e4n68z{padding-top:4px;height:30px}.leftMenuTopMargin.svelte-e4n68z.svelte-e4n68z{margin-top:20px}.outer.svelte-e4n68z.svelte-e4n68z{display:inline-block;cursor:pointer}.arrowRight.svelte-e4n68z.svelte-e4n68z{fill:white;display:inline-block;width:30px;text-align:center;vertical-align:-5px}.comboList.svelte-e4n68z.svelte-e4n68z{vertical-align:-4px;margin-left:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5zdmVsdGUiLCJzb3VyY2VzIjpbIkljb24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBcdGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZXhwb3J0IGxldCBuYW1lPVwiXCJcclxuICAgICAgICBleHBvcnQgbGV0IHN0YXRlPVwiXCJcclxuICAgICAgICBleHBvcnQgbGV0IGRlYWN0aXZhdGU9XCJcIlxyXG4gICAgICAgIGxldCBhY3RpdmVDbGFzcz1cIlwiXHJcbiAgICAgICAgaWYgKHN0YXRlPT09bmFtZSkgYWN0aXZlQ2xhc3M9XCIgYWN0aXZlXCJcclxuICAgICAgICBpZiAoZGVhY3RpdmF0ZT09PVwiZGVhY3RpdmF0ZVwiKSBhY3RpdmVDbGFzcz1cIiBkZWFjdGl2YXRlXCJcclxuXHJcbiAgICAgICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcclxuICAgICAgICBsZXQgaWNvbnNJbmZvPXtcclxuICAgICAgICAgICAgXCJkb3duXCI6e2NsYXNzOlwiZGVmYXVsdFwifSwgXHJcbiAgICAgICAgICAgIFwidXBcIjp7Y2xhc3M6XCJkZWZhdWx0XCJ9LFxyXG4gICAgICAgICAgICBcImNsb3NlXCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb25cIn0sXHJcbiAgICAgICAgICAgIFwibGlzdFwiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uXCJ9LFxyXG4gICAgICAgICAgICBcImFycm93UmlnaHRcIjp7Y2xhc3M6XCIgYXJyb3dSaWdodCBcIn0sXHJcbiAgICAgICAgICAgIFwiY29tYm9MaXN0XCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb24yIGNvbWJvTGlzdFwifSxcclxuICAgICAgICAgICAgXCJyZW1vdmVGcm9tTGlzdFwiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uXCJ9LFxyXG4gICAgICAgICAgICBcInByb3BlcnRpZXNcIjp7Y2xhc3M6XCJkZWZhdWx0IGxlZnRNZW51SWNvbjIgbGVmdE1lbnVUb3BNYXJnaW5cIn0sXHJcbiAgICAgICAgICAgIFwiZWRpdEZvcm1cIjp7Y2xhc3M6XCJkZWZhdWx0IGxlZnRNZW51SWNvbjIgbGVmdE1lbnVUb3BNYXJnaW5cIn0sXHJcbiAgICAgICAgICAgIFwiZWRpdFJ1bGVzXCI6e2NsYXNzOlwiZGVmYXVsdCBsZWZ0TWVudUljb24yIGxlZnRNZW51VG9wTWFyZ2luXCJ9LFxyXG4gICAgICAgICAgICBcImVycm9ybG9nc1wiOntjbGFzczpcImRlZmF1bHQgbGVmdE1lbnVJY29uMiBsZWZ0TWVudVRvcE1hcmdpblwifSxcclxuICAgICAgICAgICAgXCJmb3JtX3RleHRcIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fdGV4dGFyZWFcIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fY2hlY2tib3hcIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fZHJvcGRvd25cIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fc2xpZGVyXCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuICAgICAgICAgICAgXCJmb3JtX2xheWVyc1wiOntjbGFzczpcImRlZmF1bHQgZGVhY3RpdmF0ZVwifSwgXHJcbiAgICAgICAgICAgIFwiZm9ybV9sYXllcnMyXCI6e2NsYXNzOlwiZGVmYXVsdCBkZWFjdGl2YXRlXCJ9LCBcclxuICAgICAgICAgICAgXCJmb3JtX2xheWVyczNcIjp7Y2xhc3M6XCJkZWZhdWx0IGRlYWN0aXZhdGVcIn0sIFxyXG4gICAgICAgICAgICBcImZvcm1fcHJldmlld1wiOntjbGFzczpcImRlZmF1bHQgZGVhY3RpdmF0ZVwifSwgXHJcbiAgICAgICAgICAgIFwiZm9ybV9hZHZhbmNlZFwiOntjbGFzczpcImRlZmF1bHQgZGVhY3RpdmF0ZVwifSwgXHJcbiAgICAgICAgICAgIFwiZm9ybV9jb2xvcnBpY2tlclwiOntjbGFzczpcImRlZmF1bHQgZGVhY3RpdmF0ZVwifSwgXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGluZm89aWNvbnNJbmZvW25hbWVdXHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZT1cIm91dGVyXCJcclxuICAgICAgICBpZiAoaW5mbykgY2xhc3NOYW1lPWluZm8uY2xhc3NcclxuICAgICAgICBjbGFzc05hbWUrPWFjdGl2ZUNsYXNzXHJcbjwvc2NyaXB0PlxyXG48IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG48ZGl2IGNsYXNzPXtjbGFzc05hbWV9ICBvbjptb3VzZWRvd249eyhlKSA9PiB7IGRpc3BhdGNoKFwibW91c2Vkb3duXCIsZSkgfX0gIG9uOmNsaWNrPXsoZSkgPT4geyBkaXNwYXRjaChcImNsaWNrXCIsZSkgfX0gICAgPlxyXG4gICAgeyNpZiBuYW1lPT09XCJtb3ZlXCJ9XHJcbiAgICAgICAgPHN2ZyAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjRkZGXCJcclxuICAgICAgICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCJcclxuICAgICAgICBpZD1cImRyYWdNb2RlbE1hbmFnZXJUb3BCYXJJY29uXCIgY3Vyc29yPVwibW92ZVwiPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNOSA1bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTkgMTJtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwXCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNOSAxOW0tMSAwYTEgMSAwIDEgMCAyIDBhMSAxIDAgMSAwIC0yIDBcIj48L3BhdGg+XHJcbiAgICAgICAgPHBhdGggZD1cIk0xNSA1bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTE1IDEybS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCBkPVwiTTE1IDE5bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMFwiPjwvcGF0aD5cclxuICAgICAgICA8L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImRvd25cIn1cclxuICAgICAgICA8c3ZnICB2aWV3Qm94PVwiMCAwIDMyMCA1MTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiPjxwYXRoIGQ9XCJNMzEwLjYgMjQ2LjZsLTEyNy4xIDEyOEMxNzYuNCAzODAuOSAxNjguMiAzODQgMTYwIDM4NHMtMTYuMzgtMy4xMjUtMjIuNjMtOS4zNzVsLTEyNy4xLTEyOEMuMjI0NCAyMzcuNS0yLjUxNiAyMjMuNyAyLjQzOCAyMTEuOFMxOS4wNyAxOTIgMzIgMTkyaDI1NS4xYzEyLjk0IDAgMjQuNjIgNy43ODEgMjkuNTggMTkuNzVTMzE5LjggMjM3LjUgMzEwLjYgMjQ2LjZ6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwidXBcIn1cclxuICAgICAgICA8c3ZnICB2aWV3Qm94PVwiMCAwIDMyMCA1MTJcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiPjxwYXRoIGQ9XCJNOS4zOSAyNjUuNGwxMjcuMS0xMjhDMTQzLjYgMTMxLjEgMTUxLjggMTI4IDE2MCAxMjhzMTYuMzggMy4xMjUgMjIuNjMgOS4zNzVsMTI3LjEgMTI4YzkuMTU2IDkuMTU2IDExLjkgMjIuOTEgNi45NDMgMzQuODhTMzAwLjkgMzIwIDI4Ny4xIDMyMEgzMi4wMWMtMTIuOTQgMC0yNC42Mi03Ljc4MS0yOS41OC0xOS43NVMuMjMzMyAyNzQuNSA5LjM5IDI2NS40elwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cInNhdmVcIn1cclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIzXCIgaGVpZ2h0PVwiMjNcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ3aGl0ZVwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cInRhYmxlci1pY29uIHRhYmxlci1pY29uLWRldmljZS1mbG9wcHlcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiPjxwYXRoIGQ9XCJNNiA0aDEwbDQgNHYxMGEyIDIgMCAwIDEgLTIgMmgtMTJhMiAyIDAgMCAxIC0yIC0ydi0xMmEyIDIgMCAwIDEgMiAtMlwiPjwvcGF0aD48cGF0aCBkPVwiTTEyIDE0bS0yIDBhMiAyIDAgMSAwIDQgMGEyIDIgMCAxIDAgLTQgMFwiPjwvcGF0aD48cGF0aCBkPVwiTTE0IDRsMCA0bC02IDBsMCAtNFwiPjwvcGF0aD48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cIkd5cmVcIn1cclxuICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1taXNzaW5nLWF0dHJpYnV0ZSAtLT5cclxuICAgICAgICA8aW1nIHNyYz1cImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjRBQUFBZENBTUFBQUNLZWl3K0FBQUMvVkJNVkVVQUFBQWZRMUZKTkVRNFRWRWZQRmNzZDVNZ1NHRWVTbHB6ZjVjK3NNZ1hpYThYVDIwdmdwY21PRkVkTlUwWVlvV2pRMnBNVDJvZ2FuSmVMVXhaTjBCT1NsQWNrL2gxaHFjazVQWlFYbjBiTEVRb3RkY1VHeTFIKy84VWZLaEFnZDNxaUxjODF1Z3Z5TjRqZDhycFdvc25NMDFFb0xGSndjM1djYU5ZWDJJbXQ4aDZlNFpEZXJlM3ZjMnNzYjhmZ3A2WkhWaHVjNEFsaTZKUmRwMm9XRUNKa0prSlJtdENTVkFvUUZsNGUzOG1kbjFsWjJJa1BscWtWUDhIa3Y4R0JSQUFoLzg4WVdvTkR4MUsvdjg3K2Y4QnhmOEpmZi9oa1BvTlIrLy9jNU1zVUZvZk5rY1RHQ2dCQUFWbi8vOVgvLzh4L1A4Yjd2OWEzLzhhenY4RHAvL1RnUCthVFArNVJmK3dRUDhOenY0ZjJ2Mi9hUDNrbVB3NzR2dkplZnMxMnZtNDJma0JidTd5ak9pdXRkWUZROVRvbjlNQ004N3NXTXZ1YU1yamJzWUNKTE5VTXBFS0czLzdWM0FmUUc4dFVXeDBBR1VuUzJNMFJsVW5RVlJ2QUZNbk5GQWNMRWovbmo0V0tEb1RIRGdXSWpVVUlTeit3dzE3Ly84MjhQOHo3UDhNNS8vUTV2OXEzUC8xMVA4QXZQOEFzZi9sb3YvL25mOUFtdi8vYlArNlR2Ly9SditpUmY4TlZ2NUg2djFZei8zU2lQMkk0ZnhtdGZ6WXQvdnF5dmdhbS9jQWd2ZWVkdmU0WVBhUjB2VnAwUFJaeFBSQnhmS3lTdkdoelBCQXIvRC9jK3dIdU9zRFUrcmtsT25YYXVuS1dlbkNoZVRSUnVPVG4rSThpT0NVemQzbFVkei9sTnYvdHRyYWN0cTFxTmtabHRjQlpkUVhoTkkvdWRHTXh0QnBxcy9TZXMzdWhNY0NZTWYvNHNMTFk4RWtZc0VHUGIwU2U3cGxTYmptVmJlMmM3YmlsclVmaTdQMWFiRC9TNi9yU3ExdFhLd29RNnoxc0tTZFRLVDBzNkZ2ZjZCTGRaN1daNTVwWjU0dWhKc0dIcGY0VXBYYW9wTXNncExMQUpMNlk0K2lBSTdqUll2a0FJbkZKb2MwZW9iOGFJTWNPWUo0SW9KRFZvRDB3WDlXSkg0UkxIanpQbmZKUG5Ub1hYQk5BSENiRTJ3VEoybGhqbU54b0dJZ09XR3RJMkJoaWwyYUVWU2ZKRktSQzFIL3RVeVpBRXYvZzBwbmQwaG5BRVBNbnpyL3RpZi9weWIvaVNDWWlCVC9wQURtbmdEU213REZrUUQvalFETk4zTjdBQUFBUFhSU1RsTUFHUkFLazN3M0tkcS9sWldOZTNGblgwaERReHNWL2YzNit2cjI5dkx0NStIZzJkSFB5OG5FdzcycG1waVRqSXlLZlhoeWNXMWpZRnBYTlNRZDBsUzJ2UUFBQWNoSlJFRlVLTTlpb0NJd1V1UFJzc0lwcSs4WDJ5Q2h4SWhMbXRNdktwQ1ZnUm03SkJ1N3V2T3NKalljV2htTmVUaGRaamF6WXBjVlpkU1JYemsvUHFGUmlJRUppelEvbDNKSC82VHBTeGNzRThRaXl5NjlkNDVMUUcxQzB1TDJ0U2Jva3N5TVFuS2JYYUxtbmJ6N0lQdlkrcDBxQXVqbWN4OXlkazErOXVYdHUvY2xUL2RONmRSQTg1MVpyR3ZRMlkrNVZ6MXZQM2xka2oyNVcwRVUxV1gxclJPdlA4cVk2NTZVNGZtNDRGemI2alhDeU5Lc2RhNWJjdmVIQVJZOUljNTJpZWZOZ2xWQm1TSklzaUpiZ3lOZi9saHVHNU42SXNaMjNjVnJCNXhYQ0NCa3JiWFBUQTI4L0N2ZE52Umd6YWxRMjhOWGR2blBOa0M0M3BTamFMZWR3ODl2NGJidWwxTGRiVE52Yk91TFI3SmI5M1JwZnByZHhqOGZ3bnVpNDJhRUhUMlN2RkFXeVdvOThjcWlPeDUyTy83V2JPK0tpRWovZEg5RGdDS1N0Q1ZIV1pWampvZGQ0dWZmMzh2TC8zM2RGT25QaFJ5b2h2ZWNpb0h5Ymc2SnQ5NjhPRCt0SlZnTUpjMHdTVmJhZXprK3orcDFjM0N3Q3dseFc0U1dLc3hMblh5TEhmTWZYc2hLUzBuWmN4d2pVbmtyN0gyckM3MjhDdlB5WG5scllzYTRSWm1QdmE5VGhiZDN0WThxdHVURXhDSlY1V1J2N3lQRGl5TTFzdk94Y0xQdzJSQ2ZiUUJ1TzUzMGJPOGNHd0FBQUFCSlJVNUVya0pnZ2c9PVwiPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwibGlzdFwifVxyXG4gICAgICAgIDxzdmcgIHZpZXdCb3g9XCIwIDAgMTQgMTRcIiAgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtMSA5LjYyNjI3MTVoMTJ2Mi42ODM3MTk1aC0xMnptMC0zLjkwOTg0NGgxMnYyLjY4Mjg4aC0xMnptMC00LjAyNjQxOGgxMnYyLjY4NDU1OGgtMTJ6XCIvPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwicHJvcGVydGllc1wifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTMuNjU4MDcwMyAxMC44MTYxNDJxMC0uMTg5Nzc5LS4xMzg4MjgzLS4zMjg2MDctLjEzODgyODMtLjEzODgyOC0uMzI4NjA3LS4xMzg4MjgtLjE4OTc3ODggMC0uMzI4NjA3MS4xMzg4MjgtLjEzODgyODMuMTM4ODI4LS4xMzg4MjgzLjMyODYwNyAwIC4xODk3NzkuMTM4ODI4My4zMjg2MDcuMTM4ODI4My4xMzg4MjguMzI4NjA3MS4xMzg4MjguMTg5Nzc4NyAwIC4zMjg2MDctLjEzODgyOC4xMzg4MjgzLS4xMzg4MjguMTM4ODI4My0uMzI4NjA3em00LjcwMzgwMTgtMy4wNjczMTA2LTQuOTgwOTkxIDQuOTgwOTkwNnEtLjI3MDE3NzYuMjcwMTc4LS42NTcyMTQuMjcwMTc4LS4zNzk1NTc1IDAtLjY2NDY5MzEtLjI3MDE3OGwtLjc3NDA3MjktLjc4ODU2M3EtLjI3NzY1NjYtLjI2MjY5OS0uMjc3NjU2Ni0uNjU3MjE0IDAtLjM4NzAzNy4yNzc2NTY2LS42NjQ2OTNsNC45NzM5Nzk0LTQuOTczOTc5NnEuMjg0NjY4MS43MTU2NDM1LjgzNjI0MTggMS4yNjcyMTcyLjU1MTU3MzcuNTUxNTczNyAxLjI2NzIxNzIuODM2MjQxOHptNC42MzA0MTM5LTMuMTc3MTU4cTAgLjI4NDY2ODEtLjE2NzgwOC43NzQwNzI5LS4zNDMwOTkuOTc4ODA5Ni0xLjIwMTMxIDEuNTg4MzQ1My0uODU4MjExLjYwOTUzNTctMS44ODc5NzA5LjYxMDAwMzEtMS4zNTEzNTU1IDAtMi4zMTE0Njc3LS45NjA1Nzk2LS45NjAxMTIyLS45NjA1Nzk2LS45NjA1Nzk2LTIuMzExNDY3Ny0uMDAwNDY3NS0xLjM1MDg4ODIuOTYwNTc5Ni0yLjMxMTQ2NzguOTYxMDQ3LS45NjA1Nzk2IDIuMzExNDY3Ny0uOTYwNTc5Ni40MjM0OTU5IDAgLjg4NzE5MTkuMTIwNTk4My40NjM2OTYuMTIwNTk4My43ODUyOTIuMzM5ODI1NS4xMTY4NTkuMDgwMzk5LjExNjg1OS4yMDQ3MzY3IDAgLjEyNDMzNzgtLjExNjg1OS4yMDQ3MzY3bC0yLjEzOTkxOTIgMS4yMzQ0OTY3djEuNjM2MDIzN2wxLjQwOTc4NTIuNzgxNTUxOXEuMDM2NDYtLjAyMTk2OS41NzY4MTQtLjM1NDMxNi41NDAzNTYtLjMzMjM0NjYuOTg5NTYyLS41OTE3NzMyLjQ0OTIwNC0uMjU5NDI2Ni41MTUxMTQtLjI1OTQyNjYuMTA5Mzc5IDAgLjE3MTU0OC4wNzI5Mi4wNjIxNy4wNzI5Mi4wNjIxNy4xODI3NjczelwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImVkaXRGb3JtXCJ9XHJcbiAgICAgICAgPHN2ZyAgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMTQgMTRcIj48cGF0aCBkPVwibSAxLjE5OTc5OTUsMTIuOTkzOTE2IGMgLTAuMDc5MDM0LC0wLjAyMyAtMC4xNjQwNzEsLTAuMTA5MyAtMC4xODc5ODEzLC0wLjE5MTQgLTAuMDEyMDA1LC0wLjA0MiAtMC4wMTMwMDYsLTAuNjg5NSAtMC4wMTEwMDUsLTUuODIxMDAwMyBsIDAsLTUuNzc0IDAuMDIyMDEsLTAuMDQ1IGMgMC4wMjgwMTIsLTAuMDU3IDAuMDgzMDM2LC0wLjExMTcgMC4xNDAxNjA2LC0wLjE0MDEgbCAwLjA0NTAxOSwtMC4wMjIgNS43OTIyMDQxLDAgNS43OTIzMDQxLDAgMC4wNTEwMiwwLjAyNSBjIDAuMDU2MDIsMC4wMjcgMC4xMDM2NDUsMC4wNzUgMC4xMzU0NTksMC4xMzQ1IGwgMC4wMjEwMSwwLjAzOSAwLDUuNzgzMiBjIDAsNS4zNzY1MDAzIDAsNS43ODY2MDAzIC0wLjAxMzAxLDUuODMxMTAwMyAtMC4wMTkwMSwwLjA2IC0wLjA3OTAzLDAuMTI5MSAtMC4xNDE3NjEsMC4xNjIxIGwgLTAuMDQ2MDIsMC4wMjQgLTUuNzg3NzAyMywwIGMgLTMuNDU2Mjk0Miw5ZS00IC01Ljc5OTIwNywwIC01LjgxNjAxNDMsLTAuMDEgeiBtIDExLjIzNjY1NzUsLTUuOTkxOTAwMyAwLC01LjQzNDIgLTUuNDMxOTQ4MSwwIC01LjQzMTg0ODIsMCAwLDUuNDIyOSBjIDAsMi45ODI2IC00LjAwMmUtNCw1LjQyODAwMDMgMCw1LjQzNDIwMDMgMCwwLjAxIDEuMDk5MDc1MSwwLjAxMSA1LjQzNjU1MDIsMC4wMTEgbCA1LjQzMjE0ODEsMCAwLC01LjQzNDIwMDMgeiBtIC02Ljg2MTk2NjMsMy43MTgxMDAzIDAsLTAuODYwMzAwMyAwLjg1NTc2OTksMCAwLjg1NTc3LDAgMCwwLjg2MDMwMDMgMCwwLjg2MDMgLTAuODU1NzcsMCAtMC44NTU3Njk5LDAgMCwtMC44NjAzIHogbSAxLjE0Mzk5NDUsMCAwLC0wLjI4MzggLTAuMjg4MjI0NiwwIC0wLjI4ODMyNDYsMCAwLDAuMjgzOCAwLDAuMjgzNyAwLjI4ODMyNDYsMCAwLjI4ODIyNDYsMCAwLC0wLjI4MzcgeiBtIDEuMTQ0MDk0NywwIDAsLTAuMjgzOCAxLjcxNjA0MTgsMCAxLjcxNjA0MTMsMCAwLDAuMjgzOCAwLDAuMjgzNyAtMS43MTYwNDEzLDAgLTEuNzE2MDQxOCwwIDAsLTAuMjgzNyB6IG0gLTIuMjg4MDg5MiwtMy4xNDgzMDAzIDAsLTEuMTQ0MSAyLjg2MDAzNjQsMCAyLjg2MDEzNTksMCAwLDEuMTQ0MSAwLDEuMTQzOSAtMi44NjAxMzU5LDAgLTIuODYwMDM2NCwwIDAsLTEuMTQzOSB6IG0gNS4xNDM2MjMzLDAgMCwtMC41NzIxIC0yLjI4ODA4ODgsMCAtMi4yODgwODkyLDAgMCwwLjU2NjEgYyAwLDAuMzExMyAwLDAuNTY4NyAwLjAxMDAwNCwwLjU3MiAwLDAgMS4wMzI5NDY2LDAuMDEgMi4yODgwODkyLDAuMDEgbCAyLjI4MjA4NjgsMCAwLC0wLjU3MiB6IG0gLTcuOTk5MjU3OCwwIDAsLTAuMjg4NCAxLjEzOTU5MjcsMCAxLjEzOTQ5MjUsMCAwLDAuMjg4NCAwLDAuMjg4MiAtMS4xMzk0OTI1LDAgLTEuMTM5NTkyNywwIDAsLTAuMjg4MiB6IG0gMi44NTU2MzQ1LC0zLjQzMjEgMCwtMS4xNDQxIDIuODYwMDM2NCwwIDIuODYwMTM1OSwwIDAsMS4xNDQxIDAsMS4xNDQgLTIuODYwMTM1OSwwIC0yLjg2MDAzNjQsMCAwLC0xLjE0NCB6IG0gNS4xNDM2MjMzLDAgMCwtMC41NzIxIC0yLjI4ODA4ODgsMCAtMi4yODgwODkyLDAgMCwwLjU2NjEgYyAwLDAuMzExMiAwLDAuNTY4NiAwLjAxMDAwNCwwLjU3MTkgMCwwIDEuMDMyOTQ2NiwwLjAxIDIuMjg4MDg5MiwwLjAxIGwgMi4yODIwODY4LDAgMCwtMC41NzE5IHogbSAtNy45OTkyNTc4LDAgMCwtMC4yODM5IDEuMTM5NTkyNywwIDEuMTM5NDkyNSwwIDAsMC4yODM5IDAsMC4yODM3IC0xLjEzOTQ5MjUsMCAtMS4xMzk1OTI3LDAgMCwtMC4yODM3IHpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfSAgICBcclxuICAgIHsjaWYgbmFtZT09PVwiZWRpdFJ1bGVzXCJ9XHJcbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDE0IDE0XCIgIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTYuNiA2Ljk5NjkyNXEwLS42NjI1LS40Njg3NS0xLjEzMTI1LS40Njg3NS0uNDY4NzUtMS4xMzEyNS0uNDY4NzUtLjY2MjUgMC0xLjEzMTI1LjQ2ODc1LS40Njg3NS40Njg3NS0uNDY4NzUgMS4xMzEyNSAwIC42NjI1LjQ2ODc1IDEuMTMxMjUuNDY4NzUuNDY4NzUgMS4xMzEyNS40Njg3NS42NjI1IDAgMS4xMzEyNS0uNDY4NzUuNDY4NzUtLjQ2ODc1LjQ2ODc1LTEuMTMxMjV6bTQuOCAzLjJxMC0uMzI1LS4yMzc1LS41NjI1LS4yMzc1LS4yMzc1LS41NjI1LS4yMzc1LS4zMjUgMC0uNTYyNS4yMzc1LS4yMzc1LjIzNzUtLjIzNzUuNTYyNSAwIC4zMzEyNS4yMzQzOC41NjU2Mi4yMzQzNy4yMzQzOC41NjU2Mi4yMzQzOC4zMzEyNSAwIC41NjU2Mi0uMjM0MzguMjM0MzgtLjIzNDM3LjIzNDM4LS41NjU2MnptMC02LjRxMC0uMzI1LS4yMzc1LS41NjI1LS4yMzc1LS4yMzc1LS41NjI1LS4yMzc1LS4zMjUgMC0uNTYyNS4yMzc1LS4yMzc1LjIzNzUtLjIzNzUuNTYyNSAwIC4zMzEyNS4yMzQzOC41NjU2My4yMzQzNy4yMzQzNy41NjU2Mi4yMzQzNy4zMzEyNSAwIC41NjU2Mi0uMjM0MzcuMjM0MzgtLjIzNDM4LjIzNDM4LS41NjU2M3ptLTIuNCAyLjYzMTI1djEuMTU2MjVxMCAuMDYyNS0uMDQzOC4xMjE4OC0uMDQzOC4wNTk0LS4xLjA2NTZsLS45Njg3NS4xNXEtLjA2ODguMjE4NzUtLjIuNDc1LjIxMjUuMy41NjI1LjcxODc1LjA0MzguMDYyNS4wNDM4LjEyNSAwIC4wNzUtLjA0MzguMTE4NzUtLjE0Mzc1LjE4NzUtLjUxNTYzLjU1OTM3LS4zNzE4Ny4zNzE4OC0uNDkwNjIuMzcxODgtLjA2ODggMC0uMTMxMjUtLjA0MzhsLS43MTg3NS0uNTYyNXEtLjIzMTI1LjExODc1LS40ODEyNS4xOTM3NS0uMDY4Ny42NzUtLjE0Mzc1Ljk2ODc1LS4wNDM4LjE1LS4xODc1LjE1aC0xLjE2MjVxLS4wNjg4IDAtLjEyNS0uMDQ2OS0uMDU2My0uMDQ2OS0uMDYyNS0uMTA5MzhsLS4xNDM3NS0uOTU2MjVxLS4yMTI1LS4wNjI1LS40Njg3NS0uMTkzNzVsLS43Mzc1LjU1NjI1cS0uMDQzNy4wNDM4LS4xMjUuMDQzOC0uMDY4NyAwLS4xMzEyNS0uMDUtLjktLjgzMTI1LS45LTEgMC0uMDU2My4wNDM3NS0uMTE4NzUuMDYyNS0uMDg3NS4yNTYyNS0uMzMxMjUuMTkzNzUtLjI0Mzc1LjI5Mzc1LS4zODEyNS0uMTQzNzUtLjI3NS0uMjE4NzUtLjUxMjVsLS45NS0uMTVxLS4wNjI1LS4wMDYtLjEwNjI1LS4wNTk0LS4wNDM3LS4wNTMwNS0uMDQzNy0uMTIxOHYtMS4xNTYyNXEwLS4wNjI1LjA0Mzc1LS4xMjE4OC4wNDM3NS0uMDU5NC4xLS4wNjU2bC45Njg3NS0uMTVxLjA2ODgtLjIxODc1LjItLjQ3NS0uMjEyNS0uMy0uNTYyNS0uNzE4NzUtLjA0Mzc1LS4wNjg4LS4wNDM3NS0uMTI1IDAtLjA3NS4wNDM3NS0uMTI1LjEzNzUtLjE4NzUuNTEyNS0uNTU2MjUuMzc1LS4zNjg3NS40OTM3NS0uMzY4NzUuMDY4OCAwIC4xMzEyNS4wNDM3bC43MTg3NS41NjI1cS4yMTI1LS4xMTI1LjQ4MTI1LS4yLjA2ODctLjY3NS4xNDM3NS0uOTYyNS4wNDM4LS4xNS4xODc1LS4xNWgxLjE2MjVxLjA2ODggMCAuMTI1LjA0NjkuMDU2My4wNDY5LjA2MjUuMTA5MzdsLjE0Mzc1Ljk1NjI1cS4yMTI1LjA2MjUuNDY4NzUuMTkzNzVsLjczNzUtLjU1NjI1cS4wNS0uMDQzNy4xMjUtLjA0MzcuMDY4NyAwIC4xMzEyNS4wNS45LjgzMTI1LjkgMSAwIC4wNTYyLS4wNDM4LjExODc1LS4wNzUuMS0uMjYyNS4zMzc1LS4xODc1LjIzNzUtLjI4MTI1LjM3NS4xNDM3NS4zLjIxMjUuNTEyNWwuOTUuMTQzNzVxLjA2MjUuMDEyNS4xMDYyNS4wNjU2LjA0MzguMDUzMS4wNDM4LjEyMTg3em00IDMuMzMxMjV2Ljg3NXEwIC4xLS45MzEyNS4xOTM3NS0uMDc1LjE2ODc1LS4xODc1LjMyNS4zMTg3NS43MDYyNS4zMTg3NS44NjI1IDAgLjAyNS0uMDI1LjA0MzctLjc2MjUuNDQzNzUtLjc3NS40NDM3NS0uMDUgMC0uMjg3NS0uMjkzNzUtLjIzNzUtLjI5Mzc1LS4zMjUtLjQyNS0uMTI1LjAxMjUtLjE4NzUuMDEyNS0uMDYyNSAwLS4xODc1LS4wMTI1LS4wODc1LjEzMTI1LS4zMjUuNDI1LS4yMzc1LjI5Mzc1LS4yODc1LjI5Mzc1LS4wMTI1IDAtLjc3NS0uNDQzNzUtLjAyNS0uMDE4Ny0uMDI1LS4wNDM3IDAtLjE1NjI1LjMxODc1LS44NjI1LS4xMTI1LS4xNTYyNS0uMTg3NS0uMzI1LS45MzEyNS0uMDkzNy0uOTMxMjUtLjE5Mzc1di0uODc1cTAtLjEuOTMxMjUtLjE5Mzc1LjA4MTMtLjE4MTI1LjE4NzUtLjMyNS0uMzE4NzUtLjcwNjI1LS4zMTg3NS0uODYyNSAwLS4wMjUuMDI1LS4wNDM4LjAyNS0uMDEyNS4yMTg3NS0uMTI1LjE5Mzc1LS4xMTI1LjM2ODc1LS4yMTI1LjE3NS0uMS4xODc1LS4xLjA1IDAgLjI4NzUuMjkwNjMuMjM3NS4yOTA2Mi4zMjUuNDIxODcuMTI1LS4wMTI1LjE4NzUtLjAxMjUuMDYyNSAwIC4xODc1LjAxMjUuMzE4NzUtLjQ0Mzc1LjU3NS0uN2wuMDM3NS0uMDEyNXEuMDI1IDAgLjc3NS40Mzc1LjAyNS4wMTg4LjAyNS4wNDM4IDAgLjE1NjI1LS4zMTg3NS44NjI1LjEwNjI1LjE0Mzc1LjE4NzUuMzI1LjkzMTI1LjA5MzcuOTMxMjUuMTkzNzV6bTAtNi40di44NzVxMCAuMS0uOTMxMjUuMTkzNzUtLjA3NS4xNjg3NS0uMTg3NS4zMjUuMzE4NzUuNzA2MjUuMzE4NzUuODYyNSAwIC4wMjUtLjAyNS4wNDM4LS43NjI1LjQ0Mzc1LS43NzUuNDQzNzUtLjA1IDAtLjI4NzUtLjI5Mzc1LS4yMzc1LS4yOTM3NS0uMzI1LS40MjUtLjEyNS4wMTI1LS4xODc1LjAxMjUtLjA2MjUgMC0uMTg3NS0uMDEyNS0uMDg3NS4xMzEyNS0uMzI1LjQyNS0uMjM3NS4yOTM3NS0uMjg3NS4yOTM3NS0uMDEyNSAwLS43NzUtLjQ0Mzc1LS4wMjUtLjAxODgtLjAyNS0uMDQzOCAwLS4xNTYyNS4zMTg3NS0uODYyNS0uMTEyNS0uMTU2MjUtLjE4NzUtLjMyNS0uOTMxMjUtLjA5MzctLjkzMTI1LS4xOTM3NXYtLjg3NXEwLS4xLjkzMTI1LS4xOTM3NS4wODEzLS4xODEyNS4xODc1LS4zMjUtLjMxODc1LS43MDYyNS0uMzE4NzUtLjg2MjUgMC0uMDI1LjAyNS0uMDQzOC4wMjUtLjAxMjUuMjE4NzUtLjEyNS4xOTM3NS0uMTEyNS4zNjg3NS0uMjEyNS4xNzUtLjEuMTg3NS0uMS4wNSAwIC4yODc1LjI5MDYyLjIzNzUuMjkwNjMuMzI1LjQyMTg4LjEyNS0uMDEyNS4xODc1LS4wMTI1LjA2MjUgMCAuMTg3NS4wMTI1LjMxODc1LS40NDM3NS41NzUtLjdsLjAzNzUtLjAxMjVxLjAyNSAwIC43NzUuNDM3NS4wMjUuMDE4OC4wMjUuMDQzOCAwIC4xNTYyNS0uMzE4NzUuODYyNS4xMDYyNS4xNDM3NS4xODc1LjMyNS45MzEyNS4wOTM3LjkzMTI1LjE5Mzc1elwiLz48L3N2Zz5cclxuICAgIHsvaWZ9ICAgIFxyXG4gICAgeyNpZiBuYW1lPT09XCJjbG9zZVwifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwibTEyIDEwLjA0NzE0MnEwIC4zMzY3LS4yMzU2OTIuNTcyMzgzbC0xLjE0NDc4MyAxLjE0NDc4M3EtLjIzNTY4My4yMzU2OTItLjU3MjM4My4yMzU2OTItLjMzNjcwMDMgMC0uNTcyMzkyLS4yMzU2OTJsLTIuNDc0NzUtMi40NzQ3NS0yLjQ3NDc1IDIuNDc0NzVxLS4yMzU2OTE3LjIzNTY5Mi0uNTcyMzkxNy4yMzU2OTItLjMzNjcgMC0uNTcyMzgzMy0uMjM1NjkybC0xLjE0NDc4MzMtMS4xNDQ3ODNxLS4yMzU2OTE3LS4yMzU2ODMtLjIzNTY5MTctLjU3MjM4MyAwLS4zMzY3LjIzNTY5MTctLjU3MjM5MmwyLjQ3NDc1LTIuNDc0NzUtMi40NzQ3NS0yLjQ3NDc1cS0uMjM1NjkxNy0uMjM1NjkxNy0uMjM1NjkxNy0uNTcyMzkxNyAwLS4zMzY3LjIzNTY5MTctLjU3MjM4MzNsMS4xNDQ3ODMzLTEuMTQ0NzgzM3EuMjM1NjgzMy0uMjM1NjkxNy41NzIzODMzLS4yMzU2OTE3LjMzNjcgMCAuNTcyMzkxNy4yMzU2OTE3bDIuNDc0NzUgMi40NzQ3NSAyLjQ3NDc1LTIuNDc0NzVxLjIzNTY5MTctLjIzNTY5MTcuNTcyMzkyLS4yMzU2OTE3LjMzNjcgMCAuNTcyMzgzLjIzNTY5MTdsMS4xNDQ3ODMgMS4xNDQ3ODMzcS4yMzU2OTIuMjM1NjgzMy4yMzU2OTIuNTcyMzgzMyAwIC4zMzY3LS4yMzU2OTIuNTcyMzkxN2wtMi40NzQ3NDk3IDIuNDc0NzUgMi40NzQ3NDk3IDIuNDc0NzVxLjIzNTY5Mi4yMzU2OTIuMjM1NjkyLjU3MjM5MnpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJkZWxldGVcIn1cclxuICAgICAgICA8c3ZnIHdpZHRoPVwiMjRweFwiIGhlaWdodD1cIjI0cHhcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3Ryb2tlPVwiI2ZmZmZmZlwiPjxnIGlkPVwiU1ZHUmVwb19iZ0NhcnJpZXJcIiBzdHJva2Utd2lkdGg9XCIwXCI+PC9nPjxnIGlkPVwiU1ZHUmVwb190cmFjZXJDYXJyaWVyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9nPjxnIGlkPVwiU1ZHUmVwb19pY29uQ2FycmllclwiPiA8cGF0aCBkPVwiTTE4IDZWMTYuMkMxOCAxNy44ODAyIDE4IDE4LjcyMDIgMTcuNjczIDE5LjM2MkMxNy4zODU0IDE5LjkyNjUgMTYuOTI2NSAyMC4zODU0IDE2LjM2MiAyMC42NzNDMTUuNzIwMiAyMSAxNC44ODAyIDIxIDEzLjIgMjFIMTAuOEM5LjExOTg0IDIxIDguMjc5NzYgMjEgNy42MzgwMyAyMC42NzNDNy4wNzM1NCAyMC4zODU0IDYuNjE0NiAxOS45MjY1IDYuMzI2OTggMTkuMzYyQzYgMTguNzIwMiA2IDE3Ljg4MDIgNiAxNi4yVjZNNCA2SDIwTTE2IDZMMTUuNzI5NCA1LjE4ODA3QzE1LjQ2NzEgNC40MDEyNSAxNS4zMzU5IDQuMDA3ODQgMTUuMDkyNyAzLjcxNjk4QzE0Ljg3NzkgMy40NjAxMyAxNC42MDIxIDMuMjYxMzIgMTQuMjkwNSAzLjEzODc4QzEzLjkzNzYgMyAxMy41MjMgMyAxMi42OTM2IDNIMTEuMzA2NEMxMC40NzcgMyAxMC4wNjI0IDMgOS43MDk1MSAzLjEzODc4QzkuMzk3OTIgMy4yNjEzMiA5LjEyMjA4IDMuNDYwMTMgOC45MDcyOSAzLjcxNjk4QzguNjY0MDUgNC4wMDc4NCA4LjUzMjkyIDQuNDAxMjUgOC4yNzA2NCA1LjE4ODA3TDggNlwiIHN0cm9rZT1cIiNmZmZmZmZmZlwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+IDwvZz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImVycm9ybG9nc1wifVxyXG4gICAgICAgIDxzdmcgd2lkdGg9XCIyNHB4XCIgaGVpZ2h0PVwiMjRweFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48ZyBpZD1cIlNWR1JlcG9fYmdDYXJyaWVyXCIgc3Ryb2tlLXdpZHRoPVwiMFwiPjwvZz48ZyBpZD1cIlNWR1JlcG9fdHJhY2VyQ2FycmllclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvZz48ZyBpZD1cIlNWR1JlcG9faWNvbkNhcnJpZXJcIj4gPGcgaWQ9XCJXYXJuaW5nIC8gV2FybmluZ1wiPiA8cGF0aCBpZD1cIlZlY3RvclwiIGQ9XCJNMTIgNlYxNE0xMi4wNDk4IDE4VjE4LjFMMTEuOTUwMiAxOC4xMDAyVjE4SDEyLjA0OThaXCIgc3Ryb2tlPVwiI2ZmZmZmZlwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+IDwvZz4gPC9nPjwvc3ZnPlxyXG4gICAgey9pZn1cclxuXHJcbiAgICB7I2lmIG5hbWU9PT1cImFycm93UmlnaHRcIn1cclxuICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMTQgMTRcIiAgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJtOC41Nzg5NDcgMy4zMDU1MXYyLjQzMTMzMmgtNy41Nzg5NDd2Mi41MjYzMTZoNy41Nzg5NDd2Mi40MzEzMzJsNC40MjEwNTMtMy42OTQ0OXpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJyZW1vdmVGcm9tTGlzdFwifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgc3R5bGU9XCJmaWxsOnJlZFwiPjxwYXRoIGQ9XCJtNS40OTk5Mzc3IDUuNzUwMTk3OXY0LjUwMDE4NzFxMCAuMTA5NTA1LS4wNzA1MDMuMTc5NTA4LS4wNzA1MDMuMDctLjE3OTUwNzQuMDcwNWgtLjUwMDAyMDlxLS4xMDk1MDQ1IDAtLjE3OTUwNzUtLjA3MDUtLjA3MDAwMy0uMDcwNS0uMDcwNTAzLS4xNzk1MDh2LTQuNTAwMTg3MXEwLS4xMDk1MDQ1LjA3MDUwMy0uMTc5NTA3NS4wNzA1MDMtLjA3MDAwMy4xNzk1MDc1LS4wNzA1MDNoLjUwMDAyMDlxLjEwOTUwNDUgMCAuMTc5NTA3NC4wNzA1MDMuMDcwMDAzLjA3MDUwMy4wNzA1MDMuMTc5NTA3NXptMi4wMDAwODMzIDB2NC41MDAxODcxcTAgLjEwOTUwNS0uMDcwNTAzLjE3OTUwOC0uMDcwNTAzLjA3LS4xNzk1MDc1LjA3MDVoLS41MDAwMjA3cS0uMTA5NTA0NiAwLS4xNzk1MDc1LS4wNzA1LS4wNzAwMDMtLjA3MDUtLjA3MDUwMy0uMTc5NTA4di00LjUwMDE4NzFxMC0uMTA5NTA0NS4wNzA1MDMtLjE3OTUwNzUuMDcwNTAzLS4wNzAwMDMuMTc5NTA3NS0uMDcwNTAzaC41MDAwMjA4cS4xMDk1MDQ2IDAgLjE3OTUwNzUuMDcwNTAzLjA3MDAwMy4wNzA1MDMuMDcwNTAzLjE3OTUwNzV6bTIuMDAwMDgzMyAwdjQuNTAwMTg3MXEwIC4xMDk1MDUtLjA3MDUwMy4xNzk1MDgtLjA3MDUwMy4wNy0uMTc5NTA3NS4wNzA1aC0uNTAwMDIwN3EtLjEwOTUwNDYgMC0uMTc5NTA3NS0uMDcwNS0uMDcwMDAzLS4wNzA1LS4wNzA1MDMtLjE3OTUwOHYtNC41MDAxODcxcTAtLjEwOTUwNDUuMDcwNTAzLS4xNzk1MDc1LjA3MDUwMy0uMDcwMDAzLjE3OTUwNzUtLjA3MDUwM2guNTAwMDIwOXEuMTA5NTA0NiAwIC4xNzk1MDc1LjA3MDUwMy4wNzAwMDMuMDcwNTAzLjA3MDUwMy4xNzk1MDc1em0xLjAwMDA0MTcgNS42NTY3MzYxdi03LjQwNjMwOWgtNy4wMDAyOTE3djcuNDA2MzA5cTAgLjE3MjAwNy4wNTQ1MDIuMzE2NTEzLjA1NDUwMi4xNDQ1MDYuMTEzNTA0Ny4yMTEwMDkuMDU5MDAzLjA2NjUuMDgyMDA0LjA2NjVoNi41MDAyNzFxLjAyMzUgMCAuMDgyLS4wNjY1LjA1ODUtLjA2NjUuMTEzNTA0LS4yMTEwMDkuMDU1LS4xNDQ1MDYuMDU0NS0uMzE2NTEzem0tNS4yNTAyMTg3LTguNDA2ODUwN2gzLjUwMDE0NThsLS4zNzUwMTU2LS45MTQwMzhxLS4wNTQ1MDIzLS4wNzA1MDMtLjEzMzAwNTYtLjA4NjAwMzZoLTIuNDc2NjAzMnEtLjA3ODAwMy4wMTU1MDEtLjEzMzAwNTUuMDg2MDA0em03LjI1MDMwMTcuMjUwMDEwNXYuNTAwMDIwOHEwIC4xMDk1MDQ2LS4wNzA1LjE3OTUwNzUtLjA3MDUuMDcwMDAzLS4xNzk1MDcuMDcwNTAzaC0uNzUwMDMxdjcuNDA2MzA4OXEwIC42NDg1MjctLjM2NzAxNiAxLjEyMTA0Ni0uMzY3MDE4LjQ3MjUyLS44ODMwMzkuNDcyNTJoLTYuNTAwMjcxMnEtLjUxNTUyMTUgMC0uODgzMDM2OC0uNDU3MDE5LS4zNjc1MTU0LS40NTcwMTktLjM2NzAxNTMtMS4xMDU1NDZ2LTcuNDM3ODFoLS43NTAwMzEzcS0uMTA5NTA0NiAwLS4xNzk1MDc1LS4wNzA1MDMtLjA3MDAwMjktLjA3MDUwMjktLjA3MDUwMjktLjE3OTUwNzR2LS41MDAwMjA5cTAtLjEwOTUwNDUuMDcwNTAzLS4xNzk1MDc0LjA3MDUwMy0uMDcwMDAzLjE3OTUwNzUtLjA3MDUwM2gyLjQxNDEwMDVsLjU0NzAyMjgtMS4zMDQ1NTQzcS4xMTcwMDQ5LS4yODkwMTIxLjQyMjAxNzYtLjQ5MjAyMDUuMzA1MDEyNy0uMjAzMDA4NS42MTcwMjU3LS4yMDMwMDg1aDIuNTAwMTA0MnEuMzEyNTEzIDAgLjYxNzAyNTcuMjAzMDA4NS4zMDQ1MTI3LjIwMzAwODQuNDIyMDE3Ni40OTIwMjA1bC41NDcwMjI3IDEuMzA0NTU0M2gyLjQxNDEwMDdxLjEwOTUwNCAwIC4xNzk1MDcuMDcwNTAzLjA3LjA3MDUwMy4wNzA1LjE3OTUwNzR6XCIvPjwvc3ZnPiAgICBcclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImNvbWJvTGlzdFwifVxyXG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxNCAxNFwiICB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIm0xIDIuOGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyem0wIDIuNGgxMnYxLjJoLTEyelwiLz48L3N2Zz5cclxuICAgIHsvaWZ9XHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fdGV4dFwifVxyXG4gICAgPHN2ZyAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICB2aWV3Qm94PVwiMCAwIDE2IDE2XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiID5cclxuICAgICAgICA8cGF0aCB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZD1cIk0xMCA1aDRhMSAxIDAgMCAxIDEgMXY0YTEgMSAwIDAgMS0xIDFoLTR2MWg0YTIgMiAwIDAgMCAyLTJWNmEyIDIgMCAwIDAtMi0yaC00djF6TTYgNVY0SDJhMiAyIDAgMCAwLTIgMnY0YTIgMiAwIDAgMCAyIDJoNHYtMUgyYTEgMSAwIDAgMS0xLTFWNmExIDEgMCAwIDEgMS0xaDR6XCI+PC9wYXRoPlxyXG4gICAgICAgIDxwYXRoIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk04IDFhLjUuNSAwIDAgMSAuNS41djEzYS41LjUgMCAwIDEtMSAwdi0xM0EuNS41IDAgMCAxIDggMXpcIj48L3BhdGg+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgey9pZn1cclxuICAgIHsjaWYgbmFtZT09PVwiZm9ybV90ZXh0YXJlYVwifVxyXG4gICAgICAgIDxzdmcgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiAgdmlld0JveD1cIjAgMCAxNiAxNlwiICBmaWxsPVwiY3VycmVudENvbG9yXCIgPjxwYXRoIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBkPVwiTTAgNC41QTIuNSAyLjUgMCAwIDEgMi41IDJoMTFBMi41IDIuNSAwIDAgMSAxNiA0LjV2N2EyLjUgMi41IDAgMCAxLTIuNSAyLjVoLTExQTIuNSAyLjUgMCAwIDEgMCAxMS41di03ek0yLjUgM0ExLjUgMS41IDAgMCAwIDEgNC41djdBMS41IDEuNSAwIDAgMCAyLjUgMTNoMTFhMS41IDEuNSAwIDAgMCAxLjUtMS41di03QTEuNSAxLjUgMCAwIDAgMTMuNSAzaC0xMXptMTAuODU0IDQuNjQ2YS41LjUgMCAwIDEgMCAuNzA4bC0zIDNhLjUuNSAwIDAgMS0uNzA4LS43MDhsMy0zYS41LjUgMCAwIDEgLjcwOCAwem0wIDIuNWEuNS41IDAgMCAxIDAgLjcwOGwtLjUuNWEuNS41IDAgMCAxLS43MDgtLjcwOGwuNS0uNWEuNS41IDAgMCAxIC43MDggMHpcIj48L3BhdGg+PC9zdmc+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBuYW1lPT09XCJmb3JtX2NoZWNrYm94XCJ9XHJcbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj48cGF0aCBkPVwiTTUgM2E1IDUgMCAwIDAgMCAxMGg2YTUgNSAwIDAgMCAwLTEwem02IDlhNCA0IDAgMSAxIDAtOCA0IDQgMCAwIDEgMCA4XCIvPjwvc3ZnPlxyXG4gICAgey9pZn0gICAgXHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fZHJvcGRvd25cIn1cclxuICAgIDxzdmcgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiAgZmlsbD1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIiAgPlxyXG4gICAgICAgIDxwYXRoIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBkPVwiTTAgMS41QTEuNSAxLjUgMCAwIDEgMS41IDBoOEExLjUgMS41IDAgMCAxIDExIDEuNXYyQTEuNSAxLjUgMCAwIDEgOS41IDVoLThBMS41IDEuNSAwIDAgMSAwIDMuNXYtMnpNMS41IDFhLjUuNSAwIDAgMC0uNS41djJhLjUuNSAwIDAgMCAuNS41aDhhLjUuNSAwIDAgMCAuNS0uNXYtMmEuNS41IDAgMCAwLS41LS41aC04elwiPjwvcGF0aD5cclxuICAgICAgICA8cGF0aCB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZD1cIm03LjgyMyAyLjgyMy0uMzk2LS4zOTZBLjI1LjI1IDAgMCAxIDcuNjA0IDJoLjc5MmEuMjUuMjUgMCAwIDEgLjE3Ny40MjdsLS4zOTYuMzk2YS4yNS4yNSAwIDAgMS0uMzU0IDB6TTAgOGEyIDIgMCAwIDEgMi0yaDEyYTIgMiAwIDAgMSAyIDJ2NWEyIDIgMCAwIDEtMiAySDJhMiAyIDAgMCAxLTItMlY4em0xIDN2MmExIDEgMCAwIDAgMSAxaDEyYTEgMSAwIDAgMCAxLTF2LTJIMXptMTQtMVY4YTEgMSAwIDAgMC0xLTFIMmExIDEgMCAwIDAtMSAxdjJoMTR6TTIgOC41YS41LjUgMCAwIDEgLjUtLjVoOWEuNS41IDAgMCAxIDAgMWgtOWEuNS41IDAgMCAxLS41LS41em0wIDRhLjUuNSAwIDAgMSAuNS0uNWg2YS41LjUgMCAwIDEgMCAxaC02YS41LjUgMCAwIDEtLjUtLjV6XCI+PC9wYXRoPlxyXG4gICAgICA8L3N2Zz5cclxuICAgIHsvaWZ9ICAgICAgXHJcbiAgICB7I2lmIG5hbWU9PT1cImZvcm1fc2xpZGVyXCJ9XHJcbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj4gICAgICAgPHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNMTEuNSAyYTEuNSAxLjUgMCAxIDAgMCAzIDEuNSAxLjUgMCAwIDAgMC0zTTkuMDUgM2EyLjUgMi41IDAgMCAxIDQuOSAwSDE2djFoLTIuMDVhMi41IDIuNSAwIDAgMS00LjkgMEgwVjN6TTQuNSA3YTEuNSAxLjUgMCAxIDAgMCAzIDEuNSAxLjUgMCAwIDAgMC0zTTIuMDUgOGEyLjUgMi41IDAgMCAxIDQuOSAwSDE2djFINi45NWEyLjUgMi41IDAgMCAxLTQuOSAwSDBWOHptOS40NSA0YTEuNSAxLjUgMCAxIDAgMCAzIDEuNSAxLjUgMCAwIDAgMC0zbS0yLjQ1IDFhMi41IDIuNSAwIDAgMSA0LjkgMEgxNnYxaC0yLjA1YTIuNSAyLjUgMCAwIDEtNC45IDBIMHYtMXpcIi8+ICAgICAgPC9zdmc+XHJcbiAgICB7L2lmfSAgICAgIFxyXG4gICAgeyNpZiBuYW1lPT09XCJmb3JtX2xheWVyc1wifVxyXG4gICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+PHBhdGggZD1cIk04LjIzNSAxLjU1OWEuNS41IDAgMCAwLS40NyAwbC03LjUgNGEuNS41IDAgMCAwIDAgLjg4MkwzLjE4OCA4IC4yNjQgOS41NTlhLjUuNSAwIDAgMCAwIC44ODJsNy41IDRhLjUuNSAwIDAgMCAuNDcgMGw3LjUtNGEuNS41IDAgMCAwIDAtLjg4MkwxMi44MTMgOGwyLjkyMi0xLjU1OWEuNS41IDAgMCAwIDAtLjg4MnptMy41MTUgNy4wMDhMMTQuNDM4IDEwIDggMTMuNDMzIDEuNTYyIDEwIDQuMjUgOC41NjdsMy41MTUgMS44NzRhLjUuNSAwIDAgMCAuNDcgMHpNOCA5LjQzMyAxLjU2MiA2IDggMi41NjcgMTQuNDM4IDZ6XCIvPiAgICAgICAgPC9zdmc+XHJcbiAgICB7L2lmfSAgICAgIFxyXG4gICAgeyNpZiBuYW1lPT09XCJmb3JtX2xheWVyczJcIn1cclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj48cGF0aCBkPVwiTTguMjM1IDEuNTU5YS41LjUgMCAwIDAtLjQ3IDBsLTcuNSA0YS41LjUgMCAwIDAgMCAuODgyTDMuMTg4IDggLjI2NCA5LjU1OWEuNS41IDAgMCAwIDAgLjg4Mmw3LjUgNGEuNS41IDAgMCAwIC40NyAwbDcuNS00YS41LjUgMCAwIDAgMC0uODgyTDEyLjgxMyA4bDIuOTIyLTEuNTU5YS41LjUgMCAwIDAgMC0uODgyek04IDkuNDMzIDEuNTYyIDYgOCAyLjU2NyAxNC40MzggNnpcIi8+PC9zdmc+XHJcbiAgICB7L2lmfSAgICAgIFxyXG4gICAgeyNpZiBuYW1lPT09XCJmb3JtX3ByZXZpZXdcIn1cclxuICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiAgdmlld0JveD1cIjAgMCAxNiAxNlwiPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNNi41IDQuNDgyYzEuNjY0LTEuNjczIDUuODI1IDEuMjU0IDAgNS4wMTgtNS44MjUtMy43NjQtMS42NjQtNi42OSAwLTUuMDE4XCIvPlxyXG4gICAgICAgIDxwYXRoIGQ9XCJNMTMgNi41YTYuNDcgNi40NyAwIDAgMS0xLjI1OCAzLjg0NHEuMDYuMDQ0LjExNS4wOThsMy44NSAzLjg1YTEgMSAwIDAgMS0xLjQxNCAxLjQxNWwtMy44NS0zLjg1YTEgMSAwIDAgMS0uMS0uMTE1aC4wMDJBNi41IDYuNSAwIDEgMSAxMyA2LjVNNi41IDEyYTUuNSA1LjUgMCAxIDAgMC0xMSA1LjUgNS41IDAgMCAwIDAgMTFcIi8+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgey9pZn0gICBcclxuICAgIHsjaWYgbmFtZT09PVwiZm9ybV9sYXllcnMzXCJ9XHJcbiAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiAgZmlsbD1cImN1cnJlbnRDb2xvclwiICB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XHJcbiAgICAgICAgPHBhdGggZD1cIk03Ljc2NSAxLjU1OWEuNS41IDAgMCAxIC40NyAwbDcuNSA0YS41LjUgMCAwIDEgMCAuODgybC03LjUgNGEuNS41IDAgMCAxLS40NyAwbC03LjUtNGEuNS41IDAgMCAxIDAtLjg4MnpcIi8+XHJcbiAgICAgICAgPHBhdGggZD1cIm0yLjEyNSA4LjU2Ny0xLjg2Ljk5MmEuNS41IDAgMCAwIDAgLjg4Mmw3LjUgNGEuNS41IDAgMCAwIC40NyAwbDcuNS00YS41LjUgMCAwIDAgMC0uODgybC0xLjg2LS45OTItNS4xNyAyLjc1NmExLjUgMS41IDAgMCAxLTEuNDEgMHpcIi8+XHJcbiAgICAgIDwvc3ZnPiAgIFxyXG4gICAgICB7L2lmfVxyXG4gICAgICB7I2lmIG5hbWU9PVwiZm9ybV9hZHZhbmNlZFwifVxyXG4gICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiAgZmlsbD1cImN1cnJlbnRDb2xvclwiICB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XHJcbiAgICAgICAgPHBhdGggZD1cIk04IDQuNzU0YTMuMjQ2IDMuMjQ2IDAgMSAwIDAgNi40OTIgMy4yNDYgMy4yNDYgMCAwIDAgMC02LjQ5Mk01Ljc1NCA4YTIuMjQ2IDIuMjQ2IDAgMSAxIDQuNDkyIDAgMi4yNDYgMi4yNDYgMCAwIDEtNC40OTIgMFwiLz5cclxuICAgICAgICA8cGF0aCBkPVwiTTkuNzk2IDEuMzQzYy0uNTI3LTEuNzktMy4wNjUtMS43OS0zLjU5MiAwbC0uMDk0LjMxOWEuODczLjg3MyAwIDAgMS0xLjI1NS41MmwtLjI5Mi0uMTZjLTEuNjQtLjg5Mi0zLjQzMy45MDItMi41NCAyLjU0MWwuMTU5LjI5MmEuODczLjg3MyAwIDAgMS0uNTIgMS4yNTVsLS4zMTkuMDk0Yy0xLjc5LjUyNy0xLjc5IDMuMDY1IDAgMy41OTJsLjMxOS4wOTRhLjg3My44NzMgMCAwIDEgLjUyIDEuMjU1bC0uMTYuMjkyYy0uODkyIDEuNjQuOTAxIDMuNDM0IDIuNTQxIDIuNTRsLjI5Mi0uMTU5YS44NzMuODczIDAgMCAxIDEuMjU1LjUybC4wOTQuMzE5Yy41MjcgMS43OSAzLjA2NSAxLjc5IDMuNTkyIDBsLjA5NC0uMzE5YS44NzMuODczIDAgMCAxIDEuMjU1LS41MmwuMjkyLjE2YzEuNjQuODkzIDMuNDM0LS45MDIgMi41NC0yLjU0MWwtLjE1OS0uMjkyYS44NzMuODczIDAgMCAxIC41Mi0xLjI1NWwuMzE5LS4wOTRjMS43OS0uNTI3IDEuNzktMy4wNjUgMC0zLjU5MmwtLjMxOS0uMDk0YS44NzMuODczIDAgMCAxLS41Mi0xLjI1NWwuMTYtLjI5MmMuODkzLTEuNjQtLjkwMi0zLjQzMy0yLjU0MS0yLjU0bC0uMjkyLjE1OWEuODczLjg3MyAwIDAgMS0xLjI1NS0uNTJ6bS0yLjYzMy4yODNjLjI0Ni0uODM1IDEuNDI4LS44MzUgMS42NzQgMGwuMDk0LjMxOWExLjg3MyAxLjg3MyAwIDAgMCAyLjY5MyAxLjExNWwuMjkxLS4xNmMuNzY0LS40MTUgMS42LjQyIDEuMTg0IDEuMTg1bC0uMTU5LjI5MmExLjg3MyAxLjg3MyAwIDAgMCAxLjExNiAyLjY5MmwuMzE4LjA5NGMuODM1LjI0Ni44MzUgMS40MjggMCAxLjY3NGwtLjMxOS4wOTRhMS44NzMgMS44NzMgMCAwIDAtMS4xMTUgMi42OTNsLjE2LjI5MWMuNDE1Ljc2NC0uNDIgMS42LTEuMTg1IDEuMTg0bC0uMjkxLS4xNTlhMS44NzMgMS44NzMgMCAwIDAtMi42OTMgMS4xMTZsLS4wOTQuMzE4Yy0uMjQ2LjgzNS0xLjQyOC44MzUtMS42NzQgMGwtLjA5NC0uMzE5YTEuODczIDEuODczIDAgMCAwLTIuNjkyLTEuMTE1bC0uMjkyLjE2Yy0uNzY0LjQxNS0xLjYtLjQyLTEuMTg0LTEuMTg1bC4xNTktLjI5MUExLjg3MyAxLjg3MyAwIDAgMCAxLjk0NSA4LjkzbC0uMzE5LS4wOTRjLS44MzUtLjI0Ni0uODM1LTEuNDI4IDAtMS42NzRsLjMxOS0uMDk0QTEuODczIDEuODczIDAgMCAwIDMuMDYgNC4zNzdsLS4xNi0uMjkyYy0uNDE1LS43NjQuNDItMS42IDEuMTg1LTEuMTg0bC4yOTIuMTU5YTEuODczIDEuODczIDAgMCAwIDIuNjkyLTEuMTE1elwiLz5cclxuICAgICAgPC9zdmc+XHJcbiAgICAgIHsvaWZ9XHJcbiAgICAgIHsjaWYgbmFtZT09XCJmb3JtX2NvbG9ycGlja2VyXCJ9XHJcbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMTYgMTZcIj5cclxuICAgICAgICAgICAgPHBhdGggZD1cIk0xMy4zNTQuNjQ2YTEuMjA3IDEuMjA3IDAgMCAwLTEuNzA4IDBMOC41IDMuNzkzbC0uNjQ2LS42NDdhLjUuNSAwIDEgMC0uNzA4LjcwOEw4LjI5MyA1bC03LjE0NyA3LjE0NkEuNS41IDAgMCAwIDEgMTIuNXYxLjc5M2wtLjg1NC44NTNhLjUuNSAwIDEgMCAuNzA4LjcwN0wxLjcwNyAxNUgzLjVhLjUuNSAwIDAgMCAuMzU0LS4xNDZMMTEgNy43MDdsMS4xNDYgMS4xNDdhLjUuNSAwIDAgMCAuNzA4LS43MDhsLS42NDctLjY0NiAzLjE0Ny0zLjE0NmExLjIwNyAxLjIwNyAwIDAgMCAwLTEuNzA4ek0yIDEyLjcwN2w3LTdMMTAuMjkzIDdsLTcgN0gyelwiLz5cclxuICAgICAgICA8L3N2Zz5cclxuICAgICAgIHsvaWZ9XHJcblxyXG48L2Rpdj5cclxuXHJcbjxzdHlsZT5cclxuICAgIC5kZWZhdWx0IHtcclxuICAgICAgICBmaWxsOiB3aGl0ZTtcclxuICAgICAgICBkaXNwbGF5OmlubGluZS1ibG9jaztcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7ICAgICAgICBcclxuICAgICAgICB3aWR0aDogMzBweDtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICB9XHJcbiAgICAuZGVmYXVsdDpob3ZlciwgLmFjdGl2ZSB7XHJcbiAgICAgICAgZmlsbDogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2RkYjc0ZjtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICB9ICBcclxuICAgIC5kZWFjdGl2YXRlIHtcclxuICAgICAgICBmaWxsOiBncmV5O1xyXG4gICAgICAgIGN1cnNvcjogZGVmYXVsdDtcclxuICAgIH1cclxuXHJcbiAgICAuZGVhY3RpdmF0ZTpob3ZlciB7XHJcbiAgICAgICAgZmlsbDogZ3JleTtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgIH1cclxuXHJcbiAgICAuZGVmYXVsdCBzdmcge1xyXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIH0gIFxyXG4gICAgLmxlZnRNZW51SWNvbiB7XHJcbiAgICAgICAgcGFkZGluZy10b3A6IDhweDtcclxuICAgICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICB9XHJcbiAgICAubGVmdE1lbnVJY29uMiB7XHJcbiAgICAgICAgcGFkZGluZy10b3A6IDRweDtcclxuICAgICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIC5sZWZ0TWVudVRvcE1hcmdpbiB7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogMjBweDtcclxuICAgIH1cclxuICAgIC5vdXRlciB7XHJcbiAgICAgICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgfVxyXG4gICAgLmFycm93UmlnaHQge1xyXG4gICAgICAgIGZpbGw6IHdoaXRlO1xyXG4gICAgICAgIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xyXG4gICAgICAgIHdpZHRoOiAzMHB4O1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogLTVweDtcclxuICAgIH1cclxuICAgIC5jb21ib0xpc3Qge1xyXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiAtNHB4O1xyXG4gICAgICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xyXG4gICAgfVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEwSkksb0NBQVMsQ0FDTCxJQUFJLENBQUUsS0FBSyxDQUNYLFFBQVEsWUFBWSxDQUNwQixNQUFNLENBQUUsT0FBTyxDQUNmLEtBQUssQ0FBRSxJQUFJLENBQ1gsVUFBVSxDQUFFLE1BQ2hCLENBQ0Esb0NBQVEsTUFBTSxDQUFFLG1DQUFRLENBQ3BCLElBQUksQ0FBRSxLQUFLLENBQ1gsZ0JBQWdCLENBQUUsT0FBTyxDQUN6QixhQUFhLENBQUUsR0FDbkIsQ0FDQSx1Q0FBWSxDQUNSLElBQUksQ0FBRSxJQUFJLENBQ1YsTUFBTSxDQUFFLE9BQ1osQ0FFQSx1Q0FBVyxNQUFPLENBQ2QsSUFBSSxDQUFFLElBQUksQ0FDVixVQUFVLENBQUUsV0FDaEIsQ0FFQSxzQkFBUSxDQUFDLGlCQUFJLENBQ1QsT0FBTyxDQUFFLFlBQ2IsQ0FDQSx5Q0FBYyxDQUNWLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLE1BQU0sQ0FBRSxJQUNaLENBQ0EsMENBQWUsQ0FDWCxXQUFXLENBQUUsR0FBRyxDQUNoQixNQUFNLENBQUUsSUFDWixDQUVBLDhDQUFtQixDQUNmLFVBQVUsQ0FBRSxJQUNoQixDQUNBLGtDQUFPLENBQ0gsUUFBUSxZQUFZLENBQ3BCLE1BQU0sQ0FBRSxPQUNaLENBQ0EsdUNBQVksQ0FDUixJQUFJLENBQUUsS0FBSyxDQUNYLFFBQVEsWUFBWSxDQUNwQixLQUFLLENBQUUsSUFBSSxDQUNYLFVBQVUsQ0FBRSxNQUFNLENBQ2xCLGNBQWMsQ0FBRSxJQUNwQixDQUNBLHNDQUFXLENBQ1AsY0FBYyxDQUFFLElBQUksQ0FDcEIsV0FBVyxDQUFFLElBQ2pCIn0= */");
    }

    // (45:4) {#if name==="move"}
    function create_if_block_25(ctx) {
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
    			add_location(path0, file$6, 48, 8, 2330);
    			attr_dev(path1, "d", "M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path1, file$6, 49, 8, 2396);
    			attr_dev(path2, "d", "M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path2, file$6, 50, 8, 2463);
    			attr_dev(path3, "d", "M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path3, file$6, 51, 8, 2530);
    			attr_dev(path4, "d", "M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path4, file$6, 52, 8, 2597);
    			attr_dev(path5, "d", "M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0");
    			add_location(path5, file$6, 53, 8, 2665);
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
    			add_location(svg, file$6, 45, 8, 2081);
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
    		id: create_if_block_25.name,
    		type: "if",
    		source: "(45:4) {#if name===\\\"move\\\"}",
    		ctx
    	});

    	return block;
    }

    // (57:4) {#if name==="down"}
    function create_if_block_24(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z");
    			add_location(path, file$6, 57, 95, 2872);
    			attr_dev(svg, "viewBox", "0 0 320 512");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 57, 8, 2785);
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
    		id: create_if_block_24.name,
    		type: "if",
    		source: "(57:4) {#if name===\\\"down\\\"}",
    		ctx
    	});

    	return block;
    }

    // (60:4) {#if name==="up"}
    function create_if_block_23(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z");
    			add_location(path, file$6, 60, 95, 3226);
    			attr_dev(svg, "viewBox", "0 0 320 512");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 60, 8, 3139);
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
    		id: create_if_block_23.name,
    		type: "if",
    		source: "(60:4) {#if name===\\\"up\\\"}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if name==="save"}
    function create_if_block_22(ctx) {
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
    			add_location(path0, file$6, 63, 265, 3750);
    			attr_dev(path1, "d", "M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0");
    			add_location(path1, file$6, 63, 351, 3836);
    			attr_dev(path2, "d", "M14 4l0 4l-6 0l0 -4");
    			add_location(path2, file$6, 63, 409, 3894);
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
    			add_location(svg, file$6, 63, 8, 3493);
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
    		id: create_if_block_22.name,
    		type: "if",
    		source: "(63:4) {#if name===\\\"save\\\"}",
    		ctx
    	});

    	return block;
    }

    // (66:4) {#if name==="Gyre"}
    function create_if_block_21(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAMAAACKeiw+AAAC/VBMVEUAAAAfQ1FJNEQ4TVEfPFcsd5MgSGEeSlpzf5c+sMgXia8XT20vgpcmOFEdNU0YYoWjQ2pMT2oganJeLUxZN0BOSlAck/h1hqck5PZQXn0bLEQotdcUGy1H+/8UfKhAgd3qiLc81ugvyN4jd8rpWosnM01EoLFJwc3WcaNYX2Imt8h6e4ZDere3vc2ssb8fgp6ZHVhuc4Ali6JRdp2oWECJkJkJRmtCSVAoQFl4e38mdn1lZ2IkPlqkVP8Hkv8GBRAAh/88YWoNDx1K/v87+f8Bxf8Jff/hkPoNR+//c5MsUFofNkcTGCgBAAVn//9X//8x/P8b7v9a3/8azv8Dp//TgP+aTP+5Rf+wQP8Nzv4f2v2/aP3kmPw74vvJefs12vm42fkBbu7yjOiutdYFQ9Ton9MCM87sWMvuaMrjbsYCJLNUMpEKG3/7V3AfQG8tUWx0AGUnS2M0RlUnQVRvAFMnNFAcLEj/nj4WKDoTHDgWIjUUISz+ww17//828P8z7P8M5//Q5v9q3P/11P8AvP8Asf/lov//nf9Amv//bP+6Tv//Rv+iRf8NVv5H6v1Yz/3SiP2I4fxmtfzYt/vqyvgam/cAgveedve4YPaR0vVp0PRZxPRBxfKySvGhzPBAr/D/c+wHuOsDU+rklOnXaunKWenCheTRRuOTn+I8iOCUzd3lUdz/lNv/ttractq1qNkZltcBZdQXhNI/udGMxtBpqs/Ses3uhMcCYMf/4sLLY8EkYsEGPb0Se7plSbjmVbe2c7bilrUfi7P1abD/S6/rSq1tXKwoQ6z1sKSdTKT0s6Fvf6BLdZ7WZ55pZ54uhJsGHpf4UpXaopMsgpLLAJL6Y4+iAI7jRYvkAInFJoc0eob8aIMcOYJ4IoJDVoD0wX9WJH4RLHjzPnfJPnToXXBNAHCbE2wTJ2lhjmNxoGIgOWGtI2Bhil2aEVSfJFKRC1H/tUyZAEv/g0pnd0hnAEPMnzr/tif/pyb/iSCYiBT/pADmngDSmwDFkQD/jQDNN3N7AAAAPXRSTlMAGRAKk3w3Kdq/lZWNe3FnX0hDQxsV/f36+vr29vLt5+Hg2dHPy8nEw72pmpiTjIyKfXhycW1jYFpXNSQd0lS2vQAAAchJREFUKM9ioCIwUuPRssIpq+8X2yChxIhLmtMvKpCVgRm7JBu7uvOsJjYcWhmNeThdZjazYpcVZdSRXzk/PqFRiIEJizQ/l3JH/6TpSxcsE8Qiyy69d45LQG1C0uL2tSboksyMQnKbXaLmnbz7IPvY+p0qAujmcx9ydk1+9uXtu/clT/dN6dRA851ZrGvQ2Y+5Vz1vP3ldkj25W0EU1WX1rROvP8qY656U4fm44Fzb6jXCyNKsda5bcveHARY9Ic52iefNglVBmSJIsiJbgyNf/lhuG5N6IsZ23cVrB5xXCCBkrbXPTA28/CvdNvRgzalQ28NXdvnPNkC43pSjaLedw89v4bbul1LdbTNvbOuLR7Jb93Rpfprdxj8fwnui42aEHT2SvFAWyWo98cqiOx52O/7WbO+KiEj/dH9DgCKStCVHWZVjjodd4uff38vL/33dFOnPhRyohvecioHybg6Jt968OD+tJVgMJc0wSVbaezk+z+p1c3CwCwlxW4SWKsxLnXyLHfMfXshKS0nZcxwjUnkr7H2rC728CvPyXnlrYsa4RZmPva9Thbd3tY8qtuTExCJV5WRv7yPDiyM1svOxcLPw2RCfbQBuO530bO8cGwAAAABJRU5ErkJggg==")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$6, 67, 8, 4038);
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
    		id: create_if_block_21.name,
    		type: "if",
    		source: "(66:4) {#if name===\\\"Gyre\\\"}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#if name==="list"}
    function create_if_block_20(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m1 9.6262715h12v2.6837195h-12zm0-3.909844h12v2.68288h-12zm0-4.026418h12v2.684558h-12z");
    			add_location(path, file$6, 70, 93, 6023);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 70, 8, 5938);
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
    		id: create_if_block_20.name,
    		type: "if",
    		source: "(70:4) {#if name===\\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (73:4) {#if name==="properties"}
    function create_if_block_19(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m3.6580703 10.816142q0-.189779-.1388283-.328607-.1388283-.138828-.328607-.138828-.1897788 0-.3286071.138828-.1388283.138828-.1388283.328607 0 .189779.1388283.328607.1388283.138828.3286071.138828.1897787 0 .328607-.138828.1388283-.138828.1388283-.328607zm4.7038018-3.0673106-4.980991 4.9809906q-.2701776.270178-.657214.270178-.3795575 0-.6646931-.270178l-.7740729-.788563q-.2776566-.262699-.2776566-.657214 0-.387037.2776566-.664693l4.9739794-4.9739796q.2846681.7156435.8362418 1.2672172.5515737.5515737 1.2672172.8362418zm4.6304139-3.177158q0 .2846681-.167808.7740729-.343099.9788096-1.20131 1.5883453-.858211.6095357-1.8879709.6100031-1.3513555 0-2.3114677-.9605796-.9601122-.9605796-.9605796-2.3114677-.0004675-1.3508882.9605796-2.3114678.961047-.9605796 2.3114677-.9605796.4234959 0 .8871919.1205983.463696.1205983.785292.3398255.116859.080399.116859.2047367 0 .1243378-.116859.2047367l-2.1399192 1.2344967v1.6360237l1.4097852.7815519q.03646-.021969.576814-.354316.540356-.3323466.989562-.5917732.449204-.2594266.515114-.2594266.109379 0 .171548.07292.06217.07292.06217.1827673z");
    			add_location(path, file$6, 73, 91, 6261);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 73, 8, 6178);
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
    		id: create_if_block_19.name,
    		type: "if",
    		source: "(73:4) {#if name===\\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#if name==="editForm"}
    function create_if_block_18$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m 1.1997995,12.993916 c -0.079034,-0.023 -0.164071,-0.1093 -0.1879813,-0.1914 -0.012005,-0.042 -0.013006,-0.6895 -0.011005,-5.8210003 l 0,-5.774 0.02201,-0.045 c 0.028012,-0.057 0.083036,-0.1117 0.1401606,-0.1401 l 0.045019,-0.022 5.7922041,0 5.7923041,0 0.05102,0.025 c 0.05602,0.027 0.103645,0.075 0.135459,0.1345 l 0.02101,0.039 0,5.7832 c 0,5.3765003 0,5.7866003 -0.01301,5.8311003 -0.01901,0.06 -0.07903,0.1291 -0.141761,0.1621 l -0.04602,0.024 -5.7877023,0 c -3.4562942,9e-4 -5.799207,0 -5.8160143,-0.01 z m 11.2366575,-5.9919003 0,-5.4342 -5.4319481,0 -5.4318482,0 0,5.4229 c 0,2.9826 -4.002e-4,5.4280003 0,5.4342003 0,0.01 1.0990751,0.011 5.4365502,0.011 l 5.4321481,0 0,-5.4342003 z m -6.8619663,3.7181003 0,-0.8603003 0.8557699,0 0.85577,0 0,0.8603003 0,0.8603 -0.85577,0 -0.8557699,0 0,-0.8603 z m 1.1439945,0 0,-0.2838 -0.2882246,0 -0.2883246,0 0,0.2838 0,0.2837 0.2883246,0 0.2882246,0 0,-0.2837 z m 1.1440947,0 0,-0.2838 1.7160418,0 1.7160413,0 0,0.2838 0,0.2837 -1.7160413,0 -1.7160418,0 0,-0.2837 z m -2.2880892,-3.1483003 0,-1.1441 2.8600364,0 2.8601359,0 0,1.1441 0,1.1439 -2.8601359,0 -2.8600364,0 0,-1.1439 z m 5.1436233,0 0,-0.5721 -2.2880888,0 -2.2880892,0 0,0.5661 c 0,0.3113 0,0.5687 0.010004,0.572 0,0 1.0329466,0.01 2.2880892,0.01 l 2.2820868,0 0,-0.572 z m -7.9992578,0 0,-0.2884 1.1395927,0 1.1394925,0 0,0.2884 0,0.2882 -1.1394925,0 -1.1395927,0 0,-0.2882 z m 2.8556345,-3.4321 0,-1.1441 2.8600364,0 2.8601359,0 0,1.1441 0,1.144 -2.8601359,0 -2.8600364,0 0,-1.144 z m 5.1436233,0 0,-0.5721 -2.2880888,0 -2.2880892,0 0,0.5661 c 0,0.3112 0,0.5686 0.010004,0.5719 0,0 1.0329466,0.01 2.2880892,0.01 l 2.2820868,0 0,-0.5719 z m -7.9992578,0 0,-0.2839 1.1395927,0 1.1394925,0 0,0.2839 0,0.2837 -1.1394925,0 -1.1395927,0 0,-0.2837 z");
    			add_location(path, file$6, 76, 111, 7513);
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 76, 8, 7410);
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
    		id: create_if_block_18$1.name,
    		type: "if",
    		source: "(76:4) {#if name===\\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (79:4) {#if name==="editRules"}
    function create_if_block_17$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m6.6 6.996925q0-.6625-.46875-1.13125-.46875-.46875-1.13125-.46875-.6625 0-1.13125.46875-.46875.46875-.46875 1.13125 0 .6625.46875 1.13125.46875.46875 1.13125.46875.6625 0 1.13125-.46875.46875-.46875.46875-1.13125zm4.8 3.2q0-.325-.2375-.5625-.2375-.2375-.5625-.2375-.325 0-.5625.2375-.2375.2375-.2375.5625 0 .33125.23438.56562.23437.23438.56562.23438.33125 0 .56562-.23438.23438-.23437.23438-.56562zm0-6.4q0-.325-.2375-.5625-.2375-.2375-.5625-.2375-.325 0-.5625.2375-.2375.2375-.2375.5625 0 .33125.23438.56563.23437.23437.56562.23437.33125 0 .56562-.23437.23438-.23438.23438-.56563zm-2.4 2.63125v1.15625q0 .0625-.0438.12188-.0438.0594-.1.0656l-.96875.15q-.0688.21875-.2.475.2125.3.5625.71875.0438.0625.0438.125 0 .075-.0438.11875-.14375.1875-.51563.55937-.37187.37188-.49062.37188-.0688 0-.13125-.0438l-.71875-.5625q-.23125.11875-.48125.19375-.0687.675-.14375.96875-.0438.15-.1875.15h-1.1625q-.0688 0-.125-.0469-.0563-.0469-.0625-.10938l-.14375-.95625q-.2125-.0625-.46875-.19375l-.7375.55625q-.0437.0438-.125.0438-.0687 0-.13125-.05-.9-.83125-.9-1 0-.0563.04375-.11875.0625-.0875.25625-.33125.19375-.24375.29375-.38125-.14375-.275-.21875-.5125l-.95-.15q-.0625-.006-.10625-.0594-.0437-.05305-.0437-.1218v-1.15625q0-.0625.04375-.12188.04375-.0594.1-.0656l.96875-.15q.0688-.21875.2-.475-.2125-.3-.5625-.71875-.04375-.0688-.04375-.125 0-.075.04375-.125.1375-.1875.5125-.55625.375-.36875.49375-.36875.0688 0 .13125.0437l.71875.5625q.2125-.1125.48125-.2.0687-.675.14375-.9625.0438-.15.1875-.15h1.1625q.0688 0 .125.0469.0563.0469.0625.10937l.14375.95625q.2125.0625.46875.19375l.7375-.55625q.05-.0437.125-.0437.0687 0 .13125.05.9.83125.9 1 0 .0562-.0438.11875-.075.1-.2625.3375-.1875.2375-.28125.375.14375.3.2125.5125l.95.14375q.0625.0125.10625.0656.0438.0531.0438.12187zm4 3.33125v.875q0 .1-.93125.19375-.075.16875-.1875.325.31875.70625.31875.8625 0 .025-.025.0437-.7625.44375-.775.44375-.05 0-.2875-.29375-.2375-.29375-.325-.425-.125.0125-.1875.0125-.0625 0-.1875-.0125-.0875.13125-.325.425-.2375.29375-.2875.29375-.0125 0-.775-.44375-.025-.0187-.025-.0437 0-.15625.31875-.8625-.1125-.15625-.1875-.325-.93125-.0937-.93125-.19375v-.875q0-.1.93125-.19375.0813-.18125.1875-.325-.31875-.70625-.31875-.8625 0-.025.025-.0438.025-.0125.21875-.125.19375-.1125.36875-.2125.175-.1.1875-.1.05 0 .2875.29063.2375.29062.325.42187.125-.0125.1875-.0125.0625 0 .1875.0125.31875-.44375.575-.7l.0375-.0125q.025 0 .775.4375.025.0188.025.0438 0 .15625-.31875.8625.10625.14375.1875.325.93125.0937.93125.19375zm0-6.4v.875q0 .1-.93125.19375-.075.16875-.1875.325.31875.70625.31875.8625 0 .025-.025.0438-.7625.44375-.775.44375-.05 0-.2875-.29375-.2375-.29375-.325-.425-.125.0125-.1875.0125-.0625 0-.1875-.0125-.0875.13125-.325.425-.2375.29375-.2875.29375-.0125 0-.775-.44375-.025-.0188-.025-.0438 0-.15625.31875-.8625-.1125-.15625-.1875-.325-.93125-.0937-.93125-.19375v-.875q0-.1.93125-.19375.0813-.18125.1875-.325-.31875-.70625-.31875-.8625 0-.025.025-.0438.025-.0125.21875-.125.19375-.1125.36875-.2125.175-.1.1875-.1.05 0 .2875.29062.2375.29063.325.42188.125-.0125.1875-.0125.0625 0 .1875.0125.31875-.44375.575-.7l.0375-.0125q.025 0 .775.4375.025.0188.025.0438 0 .15625-.31875.8625.10625.14375.1875.325.93125.0937.93125.19375z");
    			add_location(path, file$6, 79, 92, 9424);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 79, 8, 9340);
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
    		id: create_if_block_17$1.name,
    		type: "if",
    		source: "(79:4) {#if name===\\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    // (82:4) {#if name==="close"}
    function create_if_block_16$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m12 10.047142q0 .3367-.235692.572383l-1.144783 1.144783q-.235683.235692-.572383.235692-.3367003 0-.572392-.235692l-2.47475-2.47475-2.47475 2.47475q-.2356917.235692-.5723917.235692-.3367 0-.5723833-.235692l-1.1447833-1.144783q-.2356917-.235683-.2356917-.572383 0-.3367.2356917-.572392l2.47475-2.47475-2.47475-2.47475q-.2356917-.2356917-.2356917-.5723917 0-.3367.2356917-.5723833l1.1447833-1.1447833q.2356833-.2356917.5723833-.2356917.3367 0 .5723917.2356917l2.47475 2.47475 2.47475-2.47475q.2356917-.2356917.572392-.2356917.3367 0 .572383.2356917l1.144783 1.1447833q.235692.2356833.235692.5723833 0 .3367-.235692.5723917l-2.4747497 2.47475 2.4747497 2.47475q.235692.235692.235692.572392z");
    			add_location(path, file$6, 82, 91, 12772);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 82, 8, 12689);
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
    		id: create_if_block_16$1.name,
    		type: "if",
    		source: "(82:4) {#if name===\\\"close\\\"}",
    		ctx
    	});

    	return block;
    }

    // (85:4) {#if name==="delete"}
    function create_if_block_15$1(ctx) {
    	let svg;
    	let g0;
    	let g1;
    	let g2;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			path = svg_element("path");
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$6, 85, 124, 13640);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$6, 85, 171, 13687);
    			attr_dev(path, "d", "M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6");
    			attr_dev(path, "stroke", "#ffffffff");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$6, 85, 281, 13797);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$6, 85, 252, 13768);
    			attr_dev(svg, "width", "24px");
    			attr_dev(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "stroke", "#ffffff");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 85, 8, 13524);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g0);
    			append_dev(svg, g1);
    			append_dev(svg, g2);
    			append_dev(g2, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15$1.name,
    		type: "if",
    		source: "(85:4) {#if name===\\\"delete\\\"}",
    		ctx
    	});

    	return block;
    }

    // (88:4) {#if name==="errorlogs"}
    function create_if_block_14$1(ctx) {
    	let svg;
    	let g0;
    	let g1;
    	let g3;
    	let g2;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			path = svg_element("path");
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$6, 88, 107, 14594);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$6, 88, 154, 14641);
    			attr_dev(path, "id", "Vector");
    			attr_dev(path, "d", "M12 6V14M12.0498 18V18.1L11.9502 18.1002V18H12.0498Z");
    			attr_dev(path, "stroke", "#ffffff");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$6, 88, 291, 14778);
    			attr_dev(g2, "id", "Warning / Warning");
    			add_location(g2, file$6, 88, 264, 14751);
    			attr_dev(g3, "id", "SVGRepo_iconCarrier");
    			add_location(g3, file$6, 88, 235, 14722);
    			attr_dev(svg, "width", "24px");
    			attr_dev(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 88, 8, 14495);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g0);
    			append_dev(svg, g1);
    			append_dev(svg, g3);
    			append_dev(g3, g2);
    			append_dev(g2, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14$1.name,
    		type: "if",
    		source: "(88:4) {#if name===\\\"errorlogs\\\"}",
    		ctx
    	});

    	return block;
    }

    // (92:4) {#if name==="arrowRight"}
    function create_if_block_13$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m8.578947 3.30551v2.431332h-7.578947v2.526316h7.578947v2.431332l4.421053-3.69449z");
    			add_location(path, file$6, 92, 92, 15095);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 92, 8, 15011);
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
    		id: create_if_block_13$1.name,
    		type: "if",
    		source: "(92:4) {#if name===\\\"arrowRight\\\"}",
    		ctx
    	});

    	return block;
    }

    // (95:4) {#if name==="removeFromList"}
    function create_if_block_12$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m5.4999377 5.7501979v4.5001871q0 .109505-.070503.179508-.070503.07-.1795074.0705h-.5000209q-.1095045 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000209q.1095045 0 .1795074.070503.070003.070503.070503.1795075zm2.0000833 0v4.5001871q0 .109505-.070503.179508-.070503.07-.1795075.0705h-.5000207q-.1095046 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000208q.1095046 0 .1795075.070503.070003.070503.070503.1795075zm2.0000833 0v4.5001871q0 .109505-.070503.179508-.070503.07-.1795075.0705h-.5000207q-.1095046 0-.1795075-.0705-.070003-.0705-.070503-.179508v-4.5001871q0-.1095045.070503-.1795075.070503-.070003.1795075-.070503h.5000209q.1095046 0 .1795075.070503.070003.070503.070503.1795075zm1.0000417 5.6567361v-7.406309h-7.0002917v7.406309q0 .172007.054502.316513.054502.144506.1135047.211009.059003.0665.082004.0665h6.500271q.0235 0 .082-.0665.0585-.0665.113504-.211009.055-.144506.0545-.316513zm-5.2502187-8.4068507h3.5001458l-.3750156-.914038q-.0545023-.070503-.1330056-.0860036h-2.4766032q-.078003.015501-.1330055.086004zm7.2503017.2500105v.5000208q0 .1095046-.0705.1795075-.0705.070003-.179507.070503h-.750031v7.4063089q0 .648527-.367016 1.121046-.367018.47252-.883039.47252h-6.5002712q-.5155215 0-.8830368-.457019-.3675154-.457019-.3670153-1.105546v-7.43781h-.7500313q-.1095046 0-.1795075-.070503-.0700029-.0705029-.0705029-.1795074v-.5000209q0-.1095045.070503-.1795074.070503-.070003.1795075-.070503h2.4141005l.5470228-1.3045543q.1170049-.2890121.4220176-.4920205.3050127-.2030085.6170257-.2030085h2.5001042q.312513 0 .6170257.2030085.3045127.2030084.4220176.4920205l.5470227 1.3045543h2.4141007q.109504 0 .179507.070503.07.070503.0705.1795074z");
    			add_location(path, file$6, 95, 109, 15351);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "15");
    			attr_dev(svg, "height", "15");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			set_style(svg, "fill", "red");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 95, 8, 15250);
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
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(95:4) {#if name===\\\"removeFromList\\\"}",
    		ctx
    	});

    	return block;
    }

    // (98:4) {#if name==="comboList"}
    function create_if_block_11$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "m1 2.8h12v1.2h-12zm0 2.4h12v1.2h-12zm0 2.4h12v1.2h-12zm0 2.4h12v1.2h-12z");
    			add_location(path, file$6, 98, 92, 17300);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 98, 8, 17216);
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
    		source: "(98:4) {#if name===\\\"comboList\\\"}",
    		ctx
    	});

    	return block;
    }

    // (101:4) {#if name==="form_text"}
    function create_if_block_10$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path0, "d", "M10 5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v1zM6 5V4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4z");
    			add_location(path0, file$6, 102, 8, 17530);
    			attr_dev(path1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path1, "fill-rule", "evenodd");
    			attr_dev(path1, "d", "M8 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13A.5.5 0 0 1 8 1z");
    			add_location(path1, file$6, 103, 8, 17751);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 101, 4, 17437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(101:4) {#if name===\\\"form_text\\\"}",
    		ctx
    	});

    	return block;
    }

    // (107:4) {#if name==="form_textarea"}
    function create_if_block_9$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path, "d", "M0 4.5A2.5 2.5 0 0 1 2.5 2h11A2.5 2.5 0 0 1 16 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 11.5v-7zM2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11zm10.854 4.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0zm0 2.5a.5.5 0 0 1 0 .708l-.5.5a.5.5 0 0 1-.708-.708l.5-.5a.5.5 0 0 1 .708 0z");
    			add_location(path, file$6, 107, 92, 18035);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 107, 8, 17951);
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
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(107:4) {#if name===\\\"form_textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (110:4) {#if name==="form_checkbox"}
    function create_if_block_8$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8");
    			add_location(path, file$6, 110, 88, 18591);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 110, 8, 18511);
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
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(110:4) {#if name===\\\"form_checkbox\\\"}",
    		ctx
    	});

    	return block;
    }

    // (113:4) {#if name==="form_dropdown"}
    function create_if_block_7$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path0, "d", "M0 1.5A1.5 1.5 0 0 1 1.5 0h8A1.5 1.5 0 0 1 11 1.5v2A1.5 1.5 0 0 1 9.5 5h-8A1.5 1.5 0 0 1 0 3.5v-2zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-8z");
    			add_location(path0, file$6, 114, 8, 18827);
    			attr_dev(path1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(path1, "d", "m7.823 2.823-.396-.396A.25.25 0 0 1 7.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z");
    			add_location(path1, file$6, 115, 8, 19071);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 113, 4, 18733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(113:4) {#if name===\\\"form_dropdown\\\"}",
    		ctx
    	});

    	return block;
    }

    // (119:4) {#if name==="form_slider"}
    function create_if_block_6$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z");
    			add_location(path, file$6, 119, 95, 19661);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 119, 8, 19574);
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
    		source: "(119:4) {#if name===\\\"form_slider\\\"}",
    		ctx
    	});

    	return block;
    }

    // (122:4) {#if name==="form_layers"}
    function create_if_block_5$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0zM8 9.433 1.562 6 8 2.567 14.438 6z");
    			add_location(path, file$6, 122, 88, 20162);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 122, 8, 20082);
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
    		source: "(122:4) {#if name===\\\"form_layers\\\"}",
    		ctx
    	});

    	return block;
    }

    // (125:4) {#if name==="form_layers2"}
    function create_if_block_4$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882zM8 9.433 1.562 6 8 2.567 14.438 6z");
    			add_location(path, file$6, 125, 89, 20622);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 125, 8, 20541);
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
    		source: "(125:4) {#if name===\\\"form_layers2\\\"}",
    		ctx
    	});

    	return block;
    }

    // (128:4) {#if name==="form_preview"}
    function create_if_block_3$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018");
    			add_location(path0, file$6, 129, 8, 20999);
    			attr_dev(path1, "d", "M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11");
    			add_location(path1, file$6, 130, 8, 21094);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 128, 4, 20908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(128:4) {#if name===\\\"form_preview\\\"}",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#if name==="form_layers3"}
    function create_if_block_2$2(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M7.765 1.559a.5.5 0 0 1 .47 0l7.5 4a.5.5 0 0 1 0 .882l-7.5 4a.5.5 0 0 1-.47 0l-7.5-4a.5.5 0 0 1 0-.882z");
    			add_location(path0, file$6, 135, 8, 21448);
    			attr_dev(path1, "d", "m2.125 8.567-1.86.992a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882l-1.86-.992-5.17 2.756a1.5 1.5 0 0 1-1.41 0z");
    			add_location(path1, file$6, 136, 8, 21573);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 134, 4, 21356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(134:4) {#if name===\\\"form_layers3\\\"}",
    		ctx
    	});

    	return block;
    }

    // (140:6) {#if name=="form_advanced"}
    function create_if_block_1$4(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0");
    			add_location(path0, file$6, 141, 8, 21880);
    			attr_dev(path1, "d", "M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z");
    			add_location(path1, file$6, 142, 8, 22022);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 140, 6, 21788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(140:6) {#if name==\\\"form_advanced\\\"}",
    		ctx
    	});

    	return block;
    }

    // (146:6) {#if name=="form_colorpicker"}
    function create_if_block$5(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708zM2 12.707l7-7L10.293 7l-7 7H2z");
    			add_location(path, file$6, 147, 12, 23431);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "class", "svelte-e4n68z");
    			add_location(svg, file$6, 146, 8, 23337);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(146:6) {#if name==\\\"form_colorpicker\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
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
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let t24;
    	let div_class_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*name*/ ctx[0] === "move" && create_if_block_25(ctx);
    	let if_block1 = /*name*/ ctx[0] === "down" && create_if_block_24(ctx);
    	let if_block2 = /*name*/ ctx[0] === "up" && create_if_block_23(ctx);
    	let if_block3 = /*name*/ ctx[0] === "save" && create_if_block_22(ctx);
    	let if_block4 = /*name*/ ctx[0] === "Gyre" && create_if_block_21(ctx);
    	let if_block5 = /*name*/ ctx[0] === "list" && create_if_block_20(ctx);
    	let if_block6 = /*name*/ ctx[0] === "properties" && create_if_block_19(ctx);
    	let if_block7 = /*name*/ ctx[0] === "editForm" && create_if_block_18$1(ctx);
    	let if_block8 = /*name*/ ctx[0] === "editRules" && create_if_block_17$1(ctx);
    	let if_block9 = /*name*/ ctx[0] === "close" && create_if_block_16$1(ctx);
    	let if_block10 = /*name*/ ctx[0] === "delete" && create_if_block_15$1(ctx);
    	let if_block11 = /*name*/ ctx[0] === "errorlogs" && create_if_block_14$1(ctx);
    	let if_block12 = /*name*/ ctx[0] === "arrowRight" && create_if_block_13$1(ctx);
    	let if_block13 = /*name*/ ctx[0] === "removeFromList" && create_if_block_12$1(ctx);
    	let if_block14 = /*name*/ ctx[0] === "comboList" && create_if_block_11$1(ctx);
    	let if_block15 = /*name*/ ctx[0] === "form_text" && create_if_block_10$1(ctx);
    	let if_block16 = /*name*/ ctx[0] === "form_textarea" && create_if_block_9$1(ctx);
    	let if_block17 = /*name*/ ctx[0] === "form_checkbox" && create_if_block_8$1(ctx);
    	let if_block18 = /*name*/ ctx[0] === "form_dropdown" && create_if_block_7$1(ctx);
    	let if_block19 = /*name*/ ctx[0] === "form_slider" && create_if_block_6$1(ctx);
    	let if_block20 = /*name*/ ctx[0] === "form_layers" && create_if_block_5$1(ctx);
    	let if_block21 = /*name*/ ctx[0] === "form_layers2" && create_if_block_4$1(ctx);
    	let if_block22 = /*name*/ ctx[0] === "form_preview" && create_if_block_3$1(ctx);
    	let if_block23 = /*name*/ ctx[0] === "form_layers3" && create_if_block_2$2(ctx);
    	let if_block24 = /*name*/ ctx[0] == "form_advanced" && create_if_block_1$4(ctx);
    	let if_block25 = /*name*/ ctx[0] == "form_colorpicker" && create_if_block$5(ctx);

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
    			t12 = space();
    			if (if_block13) if_block13.c();
    			t13 = space();
    			if (if_block14) if_block14.c();
    			t14 = space();
    			if (if_block15) if_block15.c();
    			t15 = space();
    			if (if_block16) if_block16.c();
    			t16 = space();
    			if (if_block17) if_block17.c();
    			t17 = space();
    			if (if_block18) if_block18.c();
    			t18 = space();
    			if (if_block19) if_block19.c();
    			t19 = space();
    			if (if_block20) if_block20.c();
    			t20 = space();
    			if (if_block21) if_block21.c();
    			t21 = space();
    			if (if_block22) if_block22.c();
    			t22 = space();
    			if (if_block23) if_block23.c();
    			t23 = space();
    			if (if_block24) if_block24.c();
    			t24 = space();
    			if (if_block25) if_block25.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-e4n68z"));
    			add_location(div, file$6, 43, 0, 1925);
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
    			append_dev(div, t12);
    			if (if_block13) if_block13.m(div, null);
    			append_dev(div, t13);
    			if (if_block14) if_block14.m(div, null);
    			append_dev(div, t14);
    			if (if_block15) if_block15.m(div, null);
    			append_dev(div, t15);
    			if (if_block16) if_block16.m(div, null);
    			append_dev(div, t16);
    			if (if_block17) if_block17.m(div, null);
    			append_dev(div, t17);
    			if (if_block18) if_block18.m(div, null);
    			append_dev(div, t18);
    			if (if_block19) if_block19.m(div, null);
    			append_dev(div, t19);
    			if (if_block20) if_block20.m(div, null);
    			append_dev(div, t20);
    			if (if_block21) if_block21.m(div, null);
    			append_dev(div, t21);
    			if (if_block22) if_block22.m(div, null);
    			append_dev(div, t22);
    			if (if_block23) if_block23.m(div, null);
    			append_dev(div, t23);
    			if (if_block24) if_block24.m(div, null);
    			append_dev(div, t24);
    			if (if_block25) if_block25.m(div, null);

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
    					if_block0 = create_if_block_25(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*name*/ ctx[0] === "down") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_24(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*name*/ ctx[0] === "up") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_23(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*name*/ ctx[0] === "save") {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_22(ctx);
    					if_block3.c();
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*name*/ ctx[0] === "Gyre") {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_21(ctx);
    					if_block4.c();
    					if_block4.m(div, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*name*/ ctx[0] === "list") {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_20(ctx);
    					if_block5.c();
    					if_block5.m(div, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*name*/ ctx[0] === "properties") {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_19(ctx);
    					if_block6.c();
    					if_block6.m(div, t6);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*name*/ ctx[0] === "editForm") {
    				if (if_block7) ; else {
    					if_block7 = create_if_block_18$1(ctx);
    					if_block7.c();
    					if_block7.m(div, t7);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*name*/ ctx[0] === "editRules") {
    				if (if_block8) ; else {
    					if_block8 = create_if_block_17$1(ctx);
    					if_block8.c();
    					if_block8.m(div, t8);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*name*/ ctx[0] === "close") {
    				if (if_block9) ; else {
    					if_block9 = create_if_block_16$1(ctx);
    					if_block9.c();
    					if_block9.m(div, t9);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*name*/ ctx[0] === "delete") {
    				if (if_block10) ; else {
    					if_block10 = create_if_block_15$1(ctx);
    					if_block10.c();
    					if_block10.m(div, t10);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (/*name*/ ctx[0] === "errorlogs") {
    				if (if_block11) ; else {
    					if_block11 = create_if_block_14$1(ctx);
    					if_block11.c();
    					if_block11.m(div, t11);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}

    			if (/*name*/ ctx[0] === "arrowRight") {
    				if (if_block12) ; else {
    					if_block12 = create_if_block_13$1(ctx);
    					if_block12.c();
    					if_block12.m(div, t12);
    				}
    			} else if (if_block12) {
    				if_block12.d(1);
    				if_block12 = null;
    			}

    			if (/*name*/ ctx[0] === "removeFromList") {
    				if (if_block13) ; else {
    					if_block13 = create_if_block_12$1(ctx);
    					if_block13.c();
    					if_block13.m(div, t13);
    				}
    			} else if (if_block13) {
    				if_block13.d(1);
    				if_block13 = null;
    			}

    			if (/*name*/ ctx[0] === "comboList") {
    				if (if_block14) ; else {
    					if_block14 = create_if_block_11$1(ctx);
    					if_block14.c();
    					if_block14.m(div, t14);
    				}
    			} else if (if_block14) {
    				if_block14.d(1);
    				if_block14 = null;
    			}

    			if (/*name*/ ctx[0] === "form_text") {
    				if (if_block15) ; else {
    					if_block15 = create_if_block_10$1(ctx);
    					if_block15.c();
    					if_block15.m(div, t15);
    				}
    			} else if (if_block15) {
    				if_block15.d(1);
    				if_block15 = null;
    			}

    			if (/*name*/ ctx[0] === "form_textarea") {
    				if (if_block16) ; else {
    					if_block16 = create_if_block_9$1(ctx);
    					if_block16.c();
    					if_block16.m(div, t16);
    				}
    			} else if (if_block16) {
    				if_block16.d(1);
    				if_block16 = null;
    			}

    			if (/*name*/ ctx[0] === "form_checkbox") {
    				if (if_block17) ; else {
    					if_block17 = create_if_block_8$1(ctx);
    					if_block17.c();
    					if_block17.m(div, t17);
    				}
    			} else if (if_block17) {
    				if_block17.d(1);
    				if_block17 = null;
    			}

    			if (/*name*/ ctx[0] === "form_dropdown") {
    				if (if_block18) ; else {
    					if_block18 = create_if_block_7$1(ctx);
    					if_block18.c();
    					if_block18.m(div, t18);
    				}
    			} else if (if_block18) {
    				if_block18.d(1);
    				if_block18 = null;
    			}

    			if (/*name*/ ctx[0] === "form_slider") {
    				if (if_block19) ; else {
    					if_block19 = create_if_block_6$1(ctx);
    					if_block19.c();
    					if_block19.m(div, t19);
    				}
    			} else if (if_block19) {
    				if_block19.d(1);
    				if_block19 = null;
    			}

    			if (/*name*/ ctx[0] === "form_layers") {
    				if (if_block20) ; else {
    					if_block20 = create_if_block_5$1(ctx);
    					if_block20.c();
    					if_block20.m(div, t20);
    				}
    			} else if (if_block20) {
    				if_block20.d(1);
    				if_block20 = null;
    			}

    			if (/*name*/ ctx[0] === "form_layers2") {
    				if (if_block21) ; else {
    					if_block21 = create_if_block_4$1(ctx);
    					if_block21.c();
    					if_block21.m(div, t21);
    				}
    			} else if (if_block21) {
    				if_block21.d(1);
    				if_block21 = null;
    			}

    			if (/*name*/ ctx[0] === "form_preview") {
    				if (if_block22) ; else {
    					if_block22 = create_if_block_3$1(ctx);
    					if_block22.c();
    					if_block22.m(div, t22);
    				}
    			} else if (if_block22) {
    				if_block22.d(1);
    				if_block22 = null;
    			}

    			if (/*name*/ ctx[0] === "form_layers3") {
    				if (if_block23) ; else {
    					if_block23 = create_if_block_2$2(ctx);
    					if_block23.c();
    					if_block23.m(div, t23);
    				}
    			} else if (if_block23) {
    				if_block23.d(1);
    				if_block23 = null;
    			}

    			if (/*name*/ ctx[0] == "form_advanced") {
    				if (if_block24) ; else {
    					if_block24 = create_if_block_1$4(ctx);
    					if_block24.c();
    					if_block24.m(div, t24);
    				}
    			} else if (if_block24) {
    				if_block24.d(1);
    				if_block24 = null;
    			}

    			if (/*name*/ ctx[0] == "form_colorpicker") {
    				if (if_block25) ; else {
    					if_block25 = create_if_block$5(ctx);
    					if_block25.c();
    					if_block25.m(div, null);
    				}
    			} else if (if_block25) {
    				if_block25.d(1);
    				if_block25 = null;
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
    			if (if_block13) if_block13.d();
    			if (if_block14) if_block14.d();
    			if (if_block15) if_block15.d();
    			if (if_block16) if_block16.d();
    			if (if_block17) if_block17.d();
    			if (if_block18) if_block18.d();
    			if (if_block19) if_block19.d();
    			if (if_block20) if_block20.d();
    			if (if_block21) if_block21.d();
    			if (if_block22) if_block22.d();
    			if (if_block23) if_block23.d();
    			if (if_block24) if_block24.d();
    			if (if_block25) if_block25.d();
    			mounted = false;
    			run_all(dispose);
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
    		},
    		"errorlogs": {
    			class: "default leftMenuIcon2 leftMenuTopMargin"
    		},
    		"form_text": { class: "default deactivate" },
    		"form_textarea": { class: "default deactivate" },
    		"form_checkbox": { class: "default deactivate" },
    		"form_dropdown": { class: "default deactivate" },
    		"form_slider": { class: "default deactivate" },
    		"form_layers": { class: "default deactivate" },
    		"form_layers2": { class: "default deactivate" },
    		"form_layers3": { class: "default deactivate" },
    		"form_preview": { class: "default deactivate" },
    		"form_advanced": { class: "default deactivate" },
    		"form_colorpicker": { class: "default deactivate" }
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { name: 0, state: 3, deactivate: 4 }, add_css$7);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$7.name
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

    var fieldTypes = [{name:"text",type:"text",label:"Text","default":"",placeholder:"one line text"},{name:"color",type:"color_picker",label:"Color","default":"",placeholder:"Select Color"},{name:"textarea",type:"textarea",label:"Textarea","default":"",placeholder:"multiple line text input"},{name:"checkbox",type:"checkbox",label:"Checkbox Switch","default":false},{name:"dropdown",type:"dropdown",label:"Dropdown",options:[{text:"Option 1",key:"1"}],"default":""},{name:"model",type:"pre_filled_dropdown",label:"Model","default":""},{name:"slider",type:"slider",label:"Slider",options:[],"default":1,min:1,max:20,step:1},{name:"number",type:"number",label:"Number",options:[],"default":1,min:1,max:20,step:1},{name:"my_layer",type:"layer_image"},{name:"currentLayer",type:"layer_image",menu_type:"currentLayer"},{name:"dropLayer",label:"Drop Layer",num_layers:1,type:"drop_layers",menu_type:"currentLayer"},{name:"preview",type:"checkbox",label:"Preview","default":"true",hidden:"true",menu_type:"Preview"},{name:"newLayer",type:"checkbox",label:"New Layer","default":"true",hidden:"true",menu_type:"addLayer"},{name:"advanced_options",type:"advanced_options"},{name:"num_images",type:"slider",label:"Number Images",options:[],"default":1,min:1,max:4,step:1,menu_type:"numberImages"},{name:"seed",type:"text",label:"Seed","default":"",placeholder:"Random if empty",menu_type:"Seed"}];

    /* src\fieldSelector.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\fieldSelector.svelte";

    function add_css$6(target) {
    	append_styles(target, "svelte-1y27qf1", "#fieldSelector.svelte-1y27qf1.svelte-1y27qf1{z-index:200;position:fixed;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:10px;background-color:black;backdrop-filter:blur(20px) brightness(80%);box-shadow:0 0 1rem 0 rgba(255, 255, 255, 0.2);color:white;display:block;border-radius:10px;font-size:14px;display:none;width:460px;padding-left:20px}#fieldSelector.svelte-1y27qf1 h1.svelte-1y27qf1{font-size:16px;margin-top:5px;margin-bottom:30px}.field.svelte-1y27qf1.svelte-1y27qf1{cursor:pointer;padding:5px;background-color:rgb(60, 60, 60);width:200px;display:inline-block;margin-right:10px;margin-bottom:10px}.field.svelte-1y27qf1.svelte-1y27qf1:hover{background-color:rgb(227, 206, 116);color:black;fill:black}.field.svelte-1y27qf1 span.svelte-1y27qf1{font-size:16px;margin-left:20px;vertical-align:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRTZWxlY3Rvci5zdmVsdGUiLCJzb3VyY2VzIjpbImZpZWxkU2VsZWN0b3Iuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG48c2NyaXB0PlxyXG4gICAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJ1xyXG4gICAgaW1wb3J0IEljb24gZnJvbSAnLi9JY29uLnN2ZWx0ZSdcclxuICAgIGltcG9ydCBmaWVsZFR5cGVzICBmcm9tICcuL2Zvcm1fdGVtcGxhdGVzL2ZpZWxkVHlwZXMuanNvbidcclxuXHJcblxyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxyXG4gICAgbGV0IHNob3dGaWVsZFNlbGVjdG9yPVwibm9uZVwiXHJcbiAgICBcclxuICAgIGxldCBsZWZ0PVwiMTAwcHhcIlxyXG4gICAgbGV0IHRvcD1cIjEwMHB4XCJcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBvcGVuRGlhbG9nKGUscG9zWCxwb3NZKSB7XHJcbiAgICAgICAgc2hvd0ZpZWxkU2VsZWN0b3I9XCJibG9ja1wiXHJcbiAgICAgICAgbGV0IHg9ZS5jbGllbnRYLTQ2MC8yLXBvc1hcclxuICAgICAgICBsZXQgeT1lLmNsaWVudFktNTYwLXBvc1lcclxuICAgICAgICBpZiAoeDwwKSB4PTBcclxuICAgICAgICBpZiAoeTwwKSB5PTBcclxuICAgICAgICBpZiAoeCs0NjA+d2luZG93LmlubmVyV2lkdGgpIHg9d2luZG93LmlubmVyV2lkdGgtNDYwXHJcbiAgICAgICAgaWYgKHkrNTYwPndpbmRvdy5pbm5lckhlaWdodCkgeT13aW5kb3cuaW5uZXJIZWlnaHQtNTYwXHJcbiAgICAgICAgbGVmdD14K1wicHhcIlxyXG4gICAgICAgIHRvcD15K1wicHhcIiAgICBcclxuICAgIH1cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBoaWRlRGlhbG9nKCkge1xyXG4gICAgICAgIHNob3dGaWVsZFNlbGVjdG9yPVwibm9uZVwiXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBmaW5kRmllbGRCeVR5cGUodHlwZSkge1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8ZmllbGRUeXBlcy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZD1maWVsZFR5cGVzW2ldXHJcbiAgICAgICAgICAgIGlmIChmaWVsZC5tZW51X3R5cGU9PT10eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5tZW51X3R5cGU9bnVsbFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpZWxkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGU9PT10eXBlKSByZXR1cm4gZmllbGRcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBzZWxlY3RFbGVtZW50KHR5cGUpIHtcclxuICAgICAgICBsZXQgZmllbGQ9ZmluZEZpZWxkQnlUeXBlKHR5cGUpXHJcbiAgICAgICAgaWYgKCFmaWVsZCkge1xyXG4gICAgICAgICAgICBhbGVydChcImZpZWxkIHR5cGUgXCIrdHlwZStcIiBub3QgZm91bmRcIilcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpc3BhdGNoKCdzZWxlY3QnLCBmaWVsZClcclxuICAgIH0gICBcclxuICAgIDwvc2NyaXB0PlxyXG4gICAgPHN0eWxlPlxyXG4gICAgICAgICNmaWVsZFNlbGVjdG9yIHtcclxuICAgICAgICAgICAgei1pbmRleDogMjAwO1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDIwcHgpIGJyaWdodG5lc3MoODAlKTtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDFyZW0gMCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7XHJcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgICAgZGlzcGxheTpub25lO1xyXG4gICAgICAgICAgICB3aWR0aDo0NjBweDtcclxuICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAyMHB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICAjZmllbGRTZWxlY3RvciBoMSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICAuZmllbGQge1xyXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDVweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIHJnYig2MCwgNjAsIDYwKTtcclxuICAgICAgICAgICAgd2lkdGg6IDIwMHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLmZpZWxkOmhvdmVyIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgICAgIGZpbGw6IGJsYWNrO1xyXG4gICAgICAgIH1cclxuICAgICAgICAuZmllbGQgc3BhbiB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDIwcHg7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiAxMHB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICA8L3N0eWxlPlxyXG5cclxuXHJcbjxkaXYgaWQ9XCJmaWVsZFNlbGVjdG9yXCIgc3R5bGU9XCJkaXNwbGF5OntzaG93RmllbGRTZWxlY3Rvcn07bGVmdDp7bGVmdH07dG9wOnt0b3B9XCIgPlxyXG4gICAgPGgxPkFkZCBGb3JtIEZpZWxkPC9oMT5cclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHsgc2VsZWN0RWxlbWVudChcInRleHRcIil9fT5cclxuICAgICAgICA8SWNvbiBuYW1lPVwiZm9ybV90ZXh0XCIgPjwvSWNvbj48c3Bhbj5UZXh0PC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQoXCJ0ZXh0YXJlYVwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX3RleHRhcmVhXCIgPjwvSWNvbj48c3Bhbj5UZXh0YXJlYTwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwiY2hlY2tib3hcIil9fT5cclxuICAgICAgICA8SWNvbiBuYW1lPVwiZm9ybV9jaGVja2JveFwiID48L0ljb24+PHNwYW4+U3dpdGNoPC9zcGFuPlxyXG4gICAgPC9kaXY+ICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcImRyb3Bkb3duXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fZHJvcGRvd25cIiA+PC9JY29uPjxzcGFuPlNlbGVjdDwvc3Bhbj5cclxuICAgIDwvZGl2PiAgXHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQoXCJwcmVfZmlsbGVkX2Ryb3Bkb3duXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fZHJvcGRvd25cIiA+PC9JY29uPjxzcGFuPkF1dG9maWxsIFNlbGVjdDwvc3Bhbj5cclxuICAgIDwvZGl2PiAgICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwic2xpZGVyXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fc2xpZGVyXCIgPjwvSWNvbj48c3Bhbj5TbGlkZXI8L3NwYW4+XHJcbiAgICA8L2Rpdj4gICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiAgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcIm51bWJlclwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX3RleHRcIj48L0ljb24+PHNwYW4+TnVtYmVyPC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHsgc2VsZWN0RWxlbWVudChcImNvbG9yX3BpY2tlclwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX2NvbG9ycGlja2VyXCIgPjwvSWNvbj48c3Bhbj5Db2xvciBQaWNrZXI8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxoMT5TcGVjaWFsIGZpZWxkczwvaDE+XHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiICBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwibGF5ZXJfaW1hZ2VcIil9fT5cclxuICAgICAgICA8SWNvbiBuYW1lPVwiZm9ybV9sYXllcnNcIj48L0ljb24+PHNwYW4+TGF5ZXIgSW1hZ2U8L3NwYW4+XHJcbiAgICA8L2Rpdj4gICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiAgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcImRyb3BfbGF5ZXJzXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fbGF5ZXJzXCI+PC9JY29uPjxzcGFuPkRyb3AgTGF5ZXJzPC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgICAgICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcImN1cnJlbnRMYXllclwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX2xheWVyczJcIiA+PC9JY29uPjxzcGFuPlNlbGVjdGVkIExheWVyPC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgICAgICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcIlByZXZpZXdcIil9fT5cclxuICAgICAgICA8SWNvbiBuYW1lPVwiZm9ybV9wcmV2aWV3XCIgPjwvSWNvbj48c3Bhbj5QcmV2aWV3PC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgXHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQoXCJhZGRMYXllclwiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX2xheWVyczNcIiA+PC9JY29uPjxzcGFuPkFkZCBMYXllcjwvc3Bhbj5cclxuICAgIDwvZGl2PiAgICAgICAgIFxyXG4gICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT4gICAgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIiBvbjpjbGljaz17KGUpID0+IHtzZWxlY3RFbGVtZW50KFwiYWR2YW5jZWRfb3B0aW9uc1wiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX2FkdmFuY2VkXCIgPjwvSWNvbj48c3Bhbj5BZHZhbmNlZCBPcHRpb25zPC9zcGFuPlxyXG4gICAgPC9kaXY+ICAgICAgICAgICBcclxuICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+ICAgIFxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkXCIgb246Y2xpY2s9eyhlKSA9PiB7c2VsZWN0RWxlbWVudChcIm51bWJlckltYWdlc1wiKX19PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJmb3JtX3NsaWRlclwiID48L0ljb24+PHNwYW4+IyBSZXN1bHQgSW1hZ2VzPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPiAgICBcclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiIG9uOmNsaWNrPXsoZSkgPT4ge3NlbGVjdEVsZW1lbnQoXCJTZWVkXCIpfX0+XHJcbiAgICAgICAgPEljb24gbmFtZT1cImZvcm1fdGV4dFwiID48L0ljb24+PHNwYW4+U2VlZDwvc3Bhbj5cclxuICAgIDwvZGl2PiAgICAgICAgICBcclxuPC9kaXY+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE4Q1EsNENBQWUsQ0FDWCxPQUFPLENBQUUsR0FBRyxDQUNaLFFBQVEsQ0FBRSxLQUFLLENBQ2YsV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksT0FBTyxDQUFFLElBQUksQ0FDYixnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLGVBQWUsQ0FBRSxLQUFLLElBQUksQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQzNDLFVBQVUsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDL0MsS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsS0FBSyxDQUNkLGFBQWEsQ0FBRSxJQUFJLENBQ25CLFNBQVMsQ0FBRSxJQUFJLENBQ2YsUUFBUSxJQUFJLENBQ1osTUFBTSxLQUFLLENBQ1gsWUFBWSxDQUFFLElBQ2xCLENBQ0EsNkJBQWMsQ0FBQyxpQkFBRyxDQUNkLFNBQVMsQ0FBRSxJQUFJLENBQ2YsVUFBVSxDQUFFLEdBQUcsQ0FDZixhQUFhLENBQUUsSUFDbkIsQ0FDQSxvQ0FBTyxDQUNILE1BQU0sQ0FBRSxPQUFPLENBQ2YsT0FBTyxDQUFFLEdBQUcsQ0FDWixnQkFBZ0IsQ0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNsQyxLQUFLLENBQUUsS0FBSyxDQUNaLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLFlBQVksQ0FBRSxJQUFJLENBQ2xCLGFBQWEsQ0FBRSxJQUNuQixDQUNBLG9DQUFNLE1BQU8sQ0FDVCxnQkFBZ0IsQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxLQUFLLENBQUUsS0FBSyxDQUNaLElBQUksQ0FBRSxLQUNWLENBQ0EscUJBQU0sQ0FBQyxtQkFBSyxDQUNSLFNBQVMsQ0FBRSxJQUFJLENBQ2YsV0FBVyxDQUFFLElBQUksQ0FDakIsY0FBYyxDQUFFLElBQ3BCIn0= */");
    }

    function create_fragment$6(ctx) {
    	let div16;
    	let h10;
    	let t1;
    	let div0;
    	let icon0;
    	let span0;
    	let t3;
    	let div1;
    	let icon1;
    	let span1;
    	let t5;
    	let div2;
    	let icon2;
    	let span2;
    	let t7;
    	let div3;
    	let icon3;
    	let span3;
    	let t9;
    	let div4;
    	let icon4;
    	let span4;
    	let t11;
    	let div5;
    	let icon5;
    	let span5;
    	let t13;
    	let div6;
    	let icon6;
    	let span6;
    	let t15;
    	let div7;
    	let icon7;
    	let span7;
    	let t17;
    	let h11;
    	let t19;
    	let div8;
    	let icon8;
    	let span8;
    	let t21;
    	let div9;
    	let icon9;
    	let span9;
    	let t23;
    	let div10;
    	let icon10;
    	let span10;
    	let t25;
    	let div11;
    	let icon11;
    	let span11;
    	let t27;
    	let div12;
    	let icon12;
    	let span12;
    	let t29;
    	let div13;
    	let icon13;
    	let span13;
    	let t31;
    	let div14;
    	let icon14;
    	let span14;
    	let t33;
    	let div15;
    	let icon15;
    	let span15;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { name: "form_text" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { name: "form_textarea" },
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: { name: "form_checkbox" },
    			$$inline: true
    		});

    	icon3 = new Icon({
    			props: { name: "form_dropdown" },
    			$$inline: true
    		});

    	icon4 = new Icon({
    			props: { name: "form_dropdown" },
    			$$inline: true
    		});

    	icon5 = new Icon({
    			props: { name: "form_slider" },
    			$$inline: true
    		});

    	icon6 = new Icon({
    			props: { name: "form_text" },
    			$$inline: true
    		});

    	icon7 = new Icon({
    			props: { name: "form_colorpicker" },
    			$$inline: true
    		});

    	icon8 = new Icon({
    			props: { name: "form_layers" },
    			$$inline: true
    		});

    	icon9 = new Icon({
    			props: { name: "form_layers" },
    			$$inline: true
    		});

    	icon10 = new Icon({
    			props: { name: "form_layers2" },
    			$$inline: true
    		});

    	icon11 = new Icon({
    			props: { name: "form_preview" },
    			$$inline: true
    		});

    	icon12 = new Icon({
    			props: { name: "form_layers3" },
    			$$inline: true
    		});

    	icon13 = new Icon({
    			props: { name: "form_advanced" },
    			$$inline: true
    		});

    	icon14 = new Icon({
    			props: { name: "form_slider" },
    			$$inline: true
    		});

    	icon15 = new Icon({
    			props: { name: "form_text" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Add Form Field";
    			t1 = space();
    			div0 = element("div");
    			create_component(icon0.$$.fragment);
    			span0 = element("span");
    			span0.textContent = "Text";
    			t3 = space();
    			div1 = element("div");
    			create_component(icon1.$$.fragment);
    			span1 = element("span");
    			span1.textContent = "Textarea";
    			t5 = space();
    			div2 = element("div");
    			create_component(icon2.$$.fragment);
    			span2 = element("span");
    			span2.textContent = "Switch";
    			t7 = space();
    			div3 = element("div");
    			create_component(icon3.$$.fragment);
    			span3 = element("span");
    			span3.textContent = "Select";
    			t9 = space();
    			div4 = element("div");
    			create_component(icon4.$$.fragment);
    			span4 = element("span");
    			span4.textContent = "Autofill Select";
    			t11 = space();
    			div5 = element("div");
    			create_component(icon5.$$.fragment);
    			span5 = element("span");
    			span5.textContent = "Slider";
    			t13 = space();
    			div6 = element("div");
    			create_component(icon6.$$.fragment);
    			span6 = element("span");
    			span6.textContent = "Number";
    			t15 = space();
    			div7 = element("div");
    			create_component(icon7.$$.fragment);
    			span7 = element("span");
    			span7.textContent = "Color Picker";
    			t17 = space();
    			h11 = element("h1");
    			h11.textContent = "Special fields";
    			t19 = space();
    			div8 = element("div");
    			create_component(icon8.$$.fragment);
    			span8 = element("span");
    			span8.textContent = "Layer Image";
    			t21 = space();
    			div9 = element("div");
    			create_component(icon9.$$.fragment);
    			span9 = element("span");
    			span9.textContent = "Drop Layers";
    			t23 = space();
    			div10 = element("div");
    			create_component(icon10.$$.fragment);
    			span10 = element("span");
    			span10.textContent = "Selected Layer";
    			t25 = space();
    			div11 = element("div");
    			create_component(icon11.$$.fragment);
    			span11 = element("span");
    			span11.textContent = "Preview";
    			t27 = space();
    			div12 = element("div");
    			create_component(icon12.$$.fragment);
    			span12 = element("span");
    			span12.textContent = "Add Layer";
    			t29 = space();
    			div13 = element("div");
    			create_component(icon13.$$.fragment);
    			span13 = element("span");
    			span13.textContent = "Advanced Options";
    			t31 = space();
    			div14 = element("div");
    			create_component(icon14.$$.fragment);
    			span14 = element("span");
    			span14.textContent = "# Result Images";
    			t33 = space();
    			div15 = element("div");
    			create_component(icon15.$$.fragment);
    			span15 = element("span");
    			span15.textContent = "Seed";
    			attr_dev(h10, "class", "svelte-1y27qf1");
    			add_location(h10, file$5, 90, 4, 2734);
    			attr_dev(span0, "class", "svelte-1y27qf1");
    			add_location(span0, file$5, 93, 39, 2928);
    			attr_dev(div0, "class", "field svelte-1y27qf1");
    			add_location(div0, file$5, 92, 4, 2825);
    			attr_dev(span1, "class", "svelte-1y27qf1");
    			add_location(span1, file$5, 97, 43, 3139);
    			attr_dev(div1, "class", "field svelte-1y27qf1");
    			add_location(div1, file$5, 96, 4, 3029);
    			attr_dev(span2, "class", "svelte-1y27qf1");
    			add_location(span2, file$5, 101, 43, 3354);
    			attr_dev(div2, "class", "field svelte-1y27qf1");
    			add_location(div2, file$5, 100, 4, 3244);
    			attr_dev(span3, "class", "svelte-1y27qf1");
    			add_location(span3, file$5, 105, 43, 3569);
    			attr_dev(div3, "class", "field svelte-1y27qf1");
    			add_location(div3, file$5, 104, 4, 3459);
    			attr_dev(span4, "class", "svelte-1y27qf1");
    			add_location(span4, file$5, 109, 43, 3795);
    			attr_dev(div4, "class", "field svelte-1y27qf1");
    			add_location(div4, file$5, 108, 4, 3674);
    			attr_dev(span5, "class", "svelte-1y27qf1");
    			add_location(span5, file$5, 113, 41, 4019);
    			attr_dev(div5, "class", "field svelte-1y27qf1");
    			add_location(div5, file$5, 112, 4, 3913);
    			attr_dev(span6, "class", "svelte-1y27qf1");
    			add_location(span6, file$5, 117, 38, 4231);
    			attr_dev(div6, "class", "field svelte-1y27qf1");
    			add_location(div6, file$5, 116, 4, 4127);
    			attr_dev(span7, "class", "svelte-1y27qf1");
    			add_location(span7, file$5, 121, 46, 4453);
    			attr_dev(div7, "class", "field svelte-1y27qf1");
    			add_location(div7, file$5, 120, 4, 4335);
    			attr_dev(h11, "class", "svelte-1y27qf1");
    			add_location(h11, file$5, 123, 4, 4496);
    			attr_dev(span8, "class", "svelte-1y27qf1");
    			add_location(span8, file$5, 126, 40, 4702);
    			attr_dev(div8, "class", "field svelte-1y27qf1");
    			add_location(div8, file$5, 125, 4, 4591);
    			attr_dev(span9, "class", "svelte-1y27qf1");
    			add_location(span9, file$5, 130, 40, 4926);
    			attr_dev(div9, "class", "field svelte-1y27qf1");
    			add_location(div9, file$5, 129, 4, 4815);
    			attr_dev(span10, "class", "svelte-1y27qf1");
    			add_location(span10, file$5, 134, 42, 5155);
    			attr_dev(div10, "class", "field svelte-1y27qf1");
    			add_location(div10, file$5, 133, 4, 5042);
    			attr_dev(span11, "class", "svelte-1y27qf1");
    			add_location(span11, file$5, 138, 42, 5382);
    			attr_dev(div11, "class", "field svelte-1y27qf1");
    			add_location(div11, file$5, 137, 4, 5274);
    			attr_dev(span12, "class", "svelte-1y27qf1");
    			add_location(span12, file$5, 142, 42, 5598);
    			attr_dev(div12, "class", "field svelte-1y27qf1");
    			add_location(div12, file$5, 141, 4, 5489);
    			attr_dev(span13, "class", "svelte-1y27qf1");
    			add_location(span13, file$5, 146, 43, 5831);
    			attr_dev(div13, "class", "field svelte-1y27qf1");
    			add_location(div13, file$5, 145, 4, 5713);
    			attr_dev(span14, "class", "svelte-1y27qf1");
    			add_location(span14, file$5, 150, 41, 6067);
    			attr_dev(div14, "class", "field svelte-1y27qf1");
    			add_location(div14, file$5, 149, 4, 5955);
    			attr_dev(span15, "class", "svelte-1y27qf1");
    			add_location(span15, file$5, 154, 39, 6281);
    			attr_dev(div15, "class", "field svelte-1y27qf1");
    			add_location(div15, file$5, 153, 4, 6179);
    			attr_dev(div16, "id", "fieldSelector");
    			set_style(div16, "display", /*showFieldSelector*/ ctx[0]);
    			set_style(div16, "left", /*left*/ ctx[1]);
    			set_style(div16, "top", /*top*/ ctx[2]);
    			attr_dev(div16, "class", "svelte-1y27qf1");
    			add_location(div16, file$5, 89, 0, 2645);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, h10);
    			append_dev(div16, t1);
    			append_dev(div16, div0);
    			mount_component(icon0, div0, null);
    			append_dev(div0, span0);
    			append_dev(div16, t3);
    			append_dev(div16, div1);
    			mount_component(icon1, div1, null);
    			append_dev(div1, span1);
    			append_dev(div16, t5);
    			append_dev(div16, div2);
    			mount_component(icon2, div2, null);
    			append_dev(div2, span2);
    			append_dev(div16, t7);
    			append_dev(div16, div3);
    			mount_component(icon3, div3, null);
    			append_dev(div3, span3);
    			append_dev(div16, t9);
    			append_dev(div16, div4);
    			mount_component(icon4, div4, null);
    			append_dev(div4, span4);
    			append_dev(div16, t11);
    			append_dev(div16, div5);
    			mount_component(icon5, div5, null);
    			append_dev(div5, span5);
    			append_dev(div16, t13);
    			append_dev(div16, div6);
    			mount_component(icon6, div6, null);
    			append_dev(div6, span6);
    			append_dev(div16, t15);
    			append_dev(div16, div7);
    			mount_component(icon7, div7, null);
    			append_dev(div7, span7);
    			append_dev(div16, t17);
    			append_dev(div16, h11);
    			append_dev(div16, t19);
    			append_dev(div16, div8);
    			mount_component(icon8, div8, null);
    			append_dev(div8, span8);
    			append_dev(div16, t21);
    			append_dev(div16, div9);
    			mount_component(icon9, div9, null);
    			append_dev(div9, span9);
    			append_dev(div16, t23);
    			append_dev(div16, div10);
    			mount_component(icon10, div10, null);
    			append_dev(div10, span10);
    			append_dev(div16, t25);
    			append_dev(div16, div11);
    			mount_component(icon11, div11, null);
    			append_dev(div11, span11);
    			append_dev(div16, t27);
    			append_dev(div16, div12);
    			mount_component(icon12, div12, null);
    			append_dev(div12, span12);
    			append_dev(div16, t29);
    			append_dev(div16, div13);
    			mount_component(icon13, div13, null);
    			append_dev(div13, span13);
    			append_dev(div16, t31);
    			append_dev(div16, div14);
    			mount_component(icon14, div14, null);
    			append_dev(div14, span14);
    			append_dev(div16, t33);
    			append_dev(div16, div15);
    			mount_component(icon15, div15, null);
    			append_dev(div15, span15);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[6], false, false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[7], false, false, false, false),
    					listen_dev(div2, "click", /*click_handler_2*/ ctx[8], false, false, false, false),
    					listen_dev(div3, "click", /*click_handler_3*/ ctx[9], false, false, false, false),
    					listen_dev(div4, "click", /*click_handler_4*/ ctx[10], false, false, false, false),
    					listen_dev(div5, "click", /*click_handler_5*/ ctx[11], false, false, false, false),
    					listen_dev(div6, "click", /*click_handler_6*/ ctx[12], false, false, false, false),
    					listen_dev(div7, "click", /*click_handler_7*/ ctx[13], false, false, false, false),
    					listen_dev(div8, "click", /*click_handler_8*/ ctx[14], false, false, false, false),
    					listen_dev(div9, "click", /*click_handler_9*/ ctx[15], false, false, false, false),
    					listen_dev(div10, "click", /*click_handler_10*/ ctx[16], false, false, false, false),
    					listen_dev(div11, "click", /*click_handler_11*/ ctx[17], false, false, false, false),
    					listen_dev(div12, "click", /*click_handler_12*/ ctx[18], false, false, false, false),
    					listen_dev(div13, "click", /*click_handler_13*/ ctx[19], false, false, false, false),
    					listen_dev(div14, "click", /*click_handler_14*/ ctx[20], false, false, false, false),
    					listen_dev(div15, "click", /*click_handler_15*/ ctx[21], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*showFieldSelector*/ 1) {
    				set_style(div16, "display", /*showFieldSelector*/ ctx[0]);
    			}

    			if (!current || dirty & /*left*/ 2) {
    				set_style(div16, "left", /*left*/ ctx[1]);
    			}

    			if (!current || dirty & /*top*/ 4) {
    				set_style(div16, "top", /*top*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			transition_in(icon4.$$.fragment, local);
    			transition_in(icon5.$$.fragment, local);
    			transition_in(icon6.$$.fragment, local);
    			transition_in(icon7.$$.fragment, local);
    			transition_in(icon8.$$.fragment, local);
    			transition_in(icon9.$$.fragment, local);
    			transition_in(icon10.$$.fragment, local);
    			transition_in(icon11.$$.fragment, local);
    			transition_in(icon12.$$.fragment, local);
    			transition_in(icon13.$$.fragment, local);
    			transition_in(icon14.$$.fragment, local);
    			transition_in(icon15.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			transition_out(icon4.$$.fragment, local);
    			transition_out(icon5.$$.fragment, local);
    			transition_out(icon6.$$.fragment, local);
    			transition_out(icon7.$$.fragment, local);
    			transition_out(icon8.$$.fragment, local);
    			transition_out(icon9.$$.fragment, local);
    			transition_out(icon10.$$.fragment, local);
    			transition_out(icon11.$$.fragment, local);
    			transition_out(icon12.$$.fragment, local);
    			transition_out(icon13.$$.fragment, local);
    			transition_out(icon14.$$.fragment, local);
    			transition_out(icon15.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    			destroy_component(icon3);
    			destroy_component(icon4);
    			destroy_component(icon5);
    			destroy_component(icon6);
    			destroy_component(icon7);
    			destroy_component(icon8);
    			destroy_component(icon9);
    			destroy_component(icon10);
    			destroy_component(icon11);
    			destroy_component(icon12);
    			destroy_component(icon13);
    			destroy_component(icon14);
    			destroy_component(icon15);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FieldSelector', slots, []);
    	const dispatch = createEventDispatcher();
    	let showFieldSelector = "none";
    	let left = "100px";
    	let top = "100px";

    	function openDialog(e, posX, posY) {
    		$$invalidate(0, showFieldSelector = "block");
    		let x = e.clientX - 460 / 2 - posX;
    		let y = e.clientY - 560 - posY;
    		if (x < 0) x = 0;
    		if (y < 0) y = 0;
    		if (x + 460 > window.innerWidth) x = window.innerWidth - 460;
    		if (y + 560 > window.innerHeight) y = window.innerHeight - 560;
    		$$invalidate(1, left = x + "px");
    		$$invalidate(2, top = y + "px");
    	}

    	function hideDialog() {
    		$$invalidate(0, showFieldSelector = "none");
    	}

    	function findFieldByType(type) {
    		for (let i = 0; i < fieldTypes.length; i++) {
    			let field = fieldTypes[i];

    			if (field.menu_type === type) {
    				field.menu_type = null;
    				return field;
    			}

    			if (field.type === type) return field;
    		}
    	}

    	function selectElement(type) {
    		let field = findFieldByType(type);

    		if (!field) {
    			alert("field type " + type + " not found");
    			return;
    		}

    		dispatch('select', field);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FieldSelector> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		selectElement("text");
    	};

    	const click_handler_1 = e => {
    		selectElement("textarea");
    	};

    	const click_handler_2 = e => {
    		selectElement("checkbox");
    	};

    	const click_handler_3 = e => {
    		selectElement("dropdown");
    	};

    	const click_handler_4 = e => {
    		selectElement("pre_filled_dropdown");
    	};

    	const click_handler_5 = e => {
    		selectElement("slider");
    	};

    	const click_handler_6 = e => {
    		selectElement("number");
    	};

    	const click_handler_7 = e => {
    		selectElement("color_picker");
    	};

    	const click_handler_8 = e => {
    		selectElement("layer_image");
    	};

    	const click_handler_9 = e => {
    		selectElement("drop_layers");
    	};

    	const click_handler_10 = e => {
    		selectElement("currentLayer");
    	};

    	const click_handler_11 = e => {
    		selectElement("Preview");
    	};

    	const click_handler_12 = e => {
    		selectElement("addLayer");
    	};

    	const click_handler_13 = e => {
    		selectElement("advanced_options");
    	};

    	const click_handler_14 = e => {
    		selectElement("numberImages");
    	};

    	const click_handler_15 = e => {
    		selectElement("Seed");
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Icon,
    		fieldTypes,
    		dispatch,
    		showFieldSelector,
    		left,
    		top,
    		openDialog,
    		hideDialog,
    		findFieldByType,
    		selectElement
    	});

    	$$self.$inject_state = $$props => {
    		if ('showFieldSelector' in $$props) $$invalidate(0, showFieldSelector = $$props.showFieldSelector);
    		if ('left' in $$props) $$invalidate(1, left = $$props.left);
    		if ('top' in $$props) $$invalidate(2, top = $$props.top);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showFieldSelector,
    		left,
    		top,
    		selectElement,
    		openDialog,
    		hideDialog,
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
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15
    	];
    }

    class FieldSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { openDialog: 4, hideDialog: 5 }, add_css$6);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldSelector",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get openDialog() {
    		return this.$$.ctx[4];
    	}

    	set openDialog(value) {
    		throw new Error("<FieldSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideDialog() {
    		return this.$$.ctx[5];
    	}

    	set hideDialog(value) {
    		throw new Error("<FieldSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\FormBuilder.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\FormBuilder.svelte";

    function add_css$5(target) {
    	append_styles(target, "svelte-1yl6ahv", ".formBuilder.svelte-1yl6ahv.svelte-1yl6ahv{padding:10px;color:white;width:470px;display:block}.formBuilder.svelte-1yl6ahv h1.svelte-1yl6ahv{font-size:16px;margin-bottom:30px}.draggable.svelte-1yl6ahv.svelte-1yl6ahv{cursor:grab}.form.svelte-1yl6ahv.svelte-1yl6ahv{border-radius:5px;background-color:black;width:450px;padding:10px;color:white;font:\"Segoe UI\", Roboto, system-ui;font-size:14px;margin-bottom:10px}.formBuilder.svelte-1yl6ahv button.svelte-1yl6ahv{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybUJ1aWxkZXIuc3ZlbHRlIiwic291cmNlcyI6WyJGb3JtQnVpbGRlci5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICBpbXBvcnQgRm9ybUVsZW1lbnQgZnJvbSAnLi9Gb3JtRWxlbWVudC5zdmVsdGUnO1xyXG4gIGltcG9ydCB7IG1ldGFkYXRhfSBmcm9tICcuL3N0b3Jlcy9tZXRhZGF0YSdcclxuICBpbXBvcnQgeyBydWxlc0V4ZWN1dGlvbiB9IGZyb20gJy4vcnVsZXNFeGVjdXRpb24uanMnXHJcbiAgaW1wb3J0IGZvcm1UZW1wbGF0ZV9UeHQySW1hZ2UgIGZyb20gJy4vZm9ybV90ZW1wbGF0ZXMvdHh0MmltYWdlLmpzb24nXHJcbiAgaW1wb3J0IGZvcm1UZW1wbGF0ZV9MYXllck1lbnUgIGZyb20gJy4vZm9ybV90ZW1wbGF0ZXMvbGF5ZXJtZW51Lmpzb24nXHJcbiAgaW1wb3J0IHsgbWFwcGluZ3NIZWxwZXIgfSBmcm9tICcuL21hcHBpbmdzSGVscGVyLmpzJ1xyXG4gIGltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gXCIuL2ZpZWxkU2VsZWN0b3Iuc3ZlbHRlXCJcclxuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnXHJcbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxyXG5cclxuICBpZiAoISRtZXRhZGF0YS5mb3JtcykgJG1ldGFkYXRhLmZvcm1zPXt9XHJcblxyXG4gIGV4cG9ydCBsZXQgZm9ybV9rZXk9J2RlZmF1bHQnICAvLyBzdXBwb3J0IGZvciBtdWx0aXBsZSBmb3JtcyAoZS5nLiB3aXphcmRzKSBpbiB0aGUgZnV0dXJlXHJcbiAgZXhwb3J0IGxldCBkYXRhPXt9ICAgICAgICAgICAgLy8gdGhlIGZvcm0gZGF0YVxyXG4gIGV4cG9ydCBsZXQgcmVmcmVzaCAgXHJcbiAgZXhwb3J0IGxldCBwb3NYLHBvc1kgICAgICAgIC8vIHBvc2l0aW9uIG9mIHRoZSBwYXJlbnQgZGlhbG9nXHJcbiAgaWYgKCEkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldKSAkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldPXtlbGVtZW50czpbXX1cclxuICBpZiAoISRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0uZWxlbWVudHMpICRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0uZWxlbWVudHM9W11cclxuICBsZXQgZm9ybUVsZW1lbnRzID0gJG1ldGFkYXRhLmZvcm1zW2Zvcm1fa2V5XS5lbGVtZW50c1xyXG4gIGVuc3VyZVVuaXF1ZU5hbWVzKClcclxuICBzZXREZWZhdWx0VmFsdWVzKClcclxuXHJcbiAgbGV0IGRyYWdTdGFydEluZGV4PS0xXHJcbiAgbGV0IHNob3dQcm9wZXJ0aWVzSWR4PS0xXHJcbiAgbGV0IHNlbGVjdGVkVHlwZVxyXG5cclxuICBmdW5jdGlvbiBlbnN1cmVVbmlxdWVOYW1lcygpIHtcclxuICBjb25zdCBuYW1lTWFwID0ge307IC8vIE9iamVjdCB0byBrZWVwIHRyYWNrIG9mIG5hbWVzIGFuZCB0aGVpciBvY2N1cnJlbmNlc1xyXG5cclxuICBmb3JtRWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgIGxldCBuYW1lID0gZWxlbWVudC5uYW1lO1xyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIG5hbWUgYWxyZWFkeSBleGlzdHMgaW4gdGhlIG5hbWVNYXBcclxuICAgIGlmIChuYW1lTWFwW25hbWVdKSB7XHJcbiAgICAgIC8vIElmIHRoZSBuYW1lIGV4aXN0cywgaW5jcmVtZW50IHRoZSBjb3VudCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBuYW1lXHJcbiAgICAgIGxldCBjb3VudCA9IG5hbWVNYXBbbmFtZV07XHJcbiAgICAgIGxldCBuZXdOYW1lID0gYCR7bmFtZX1fJHtjb3VudH1gO1xyXG4gICAgICB3aGlsZSAobmFtZU1hcFtuZXdOYW1lXSkgeyAvLyBFbnN1cmUgdGhlIG5ldyBuYW1lIGlzIGFsc28gdW5pcXVlXHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgICBuZXdOYW1lID0gYCR7bmFtZX1fJHtjb3VudH1gO1xyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnQubmFtZSA9IG5ld05hbWU7XHJcbiAgICAgIG5hbWVNYXBbbmFtZV0rKztcclxuICAgICAgbmFtZU1hcFtuZXdOYW1lXSA9IDE7IC8vIEluaXRpYWxpemUgdGhpcyBuZXcgbmFtZSBpbiB0aGUgbmFtZU1hcFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gSWYgdGhlIG5hbWUgZG9lc24ndCBleGlzdCwgYWRkIGl0IHRvIHRoZSBuYW1lTWFwXHJcbiAgICAgIG5hbWVNYXBbbmFtZV0gPSAxXHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuICAkOiB7XHJcbiAgICBpZiAocmVmcmVzaCkge1xyXG4gICAgICBmb3IobGV0IGk9MDtpPGZvcm1FbGVtZW50cy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ9Zm9ybUVsZW1lbnRzW2ldXHJcbiAgICAgICAgaWYgKCFkYXRhW2VsZW1lbnQubmFtZV0pIGRhdGFbZWxlbWVudC5uYW1lXT1lbGVtZW50LmRlZmF1bHRcclxuICAgICAgfVxyXG4gICAgICBmb3JtRWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRFbGVtZW50KGUpIHtcclxuICAgIGZpZWxkU2VsZWN0b3IuaGlkZURpYWxvZygpXHJcbiAgICBsZXQgbmV3RWxlbWVudD1lLmRldGFpbFxyXG4gICAgaWYgKCFuZXdFbGVtZW50KSByZXR1cm5cclxuICAgIGZvcm1FbGVtZW50cy5wdXNoKG5ld0VsZW1lbnQpXHJcbiAgICBlbnN1cmVVbmlxdWVOYW1lcygpXHJcbiAgICBmb3JtRWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbiAgICBzaG93UHJvcGVydGllc0lkeD1mb3JtRWxlbWVudHMubGVuZ3RoLTFcclxuICAgIHNldERlZmF1bHRWYWx1ZXMoKSAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZURyYWdTdGFydChldmVudCwgaW5kZXgpIHtcclxuICAgIGlmICghYWR2YW5jZWRPcHRpb25zKSByZXR1cm5cclxuICAgIGRyYWdTdGFydEluZGV4ID0gaW5kZXhcclxuICB9XHJcbiAgLyoqXHJcbiAgICogZHJhZyBhbmQgZHJvcCB0byBjaGFuZ2Ugb3JkZXIgaW4gbGlzdFxyXG4gICAqIEBwYXJhbSBldmVudFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGhhbmRsZURyYWdPdmVyKGV2ZW50KSB7XHJcbiAgICBpZiAoIWFkdmFuY2VkT3B0aW9ucykgcmV0dXJuXHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpIC8vIE5lY2Vzc2FyeSB0byBhbGxvdyBkcm9wcGluZ1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlRHJvcChldmVudCwgZHJvcEluZGV4KSB7XHJcbiAgICBpZiAoIWFkdmFuY2VkT3B0aW9ucykgcmV0dXJuXHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBpZiAoZHJhZ1N0YXJ0SW5kZXggPT09IGRyb3BJbmRleCkgcmV0dXJuXHJcbiAgICBcclxuICAgIGNvbnN0IGRyYWdnZWRJdGVtID0gZm9ybUVsZW1lbnRzW2RyYWdTdGFydEluZGV4XTtcclxuICAgIGNvbnN0IHJlbWFpbmluZ0l0ZW1zID0gZm9ybUVsZW1lbnRzLmZpbHRlcigoXywgaW5kZXgpID0+IGluZGV4ICE9PSBkcmFnU3RhcnRJbmRleClcclxuICAgIGNvbnN0IHJlb3JkZXJlZEl0ZW1zID0gW1xyXG4gICAgICAgIC4uLnJlbWFpbmluZ0l0ZW1zLnNsaWNlKDAsIGRyb3BJbmRleCksXHJcbiAgICAgICAgZHJhZ2dlZEl0ZW0sXHJcbiAgICAgICAgLi4ucmVtYWluaW5nSXRlbXMuc2xpY2UoZHJvcEluZGV4KVxyXG4gICAgXVxyXG4gICAgLy8gUmVhc3NpZ24gdGhlIHJlb3JkZXJlZCBpdGVtcyBiYWNrIHRvIGZvcm1FbGVtZW50c1xyXG4gICAgZm9ybUVsZW1lbnRzID0gcmVvcmRlcmVkSXRlbXNcclxuICAgIGZvcm1FbGVtZW50cz1mb3JtRWxlbWVudHNcclxuICAgIC8vIFJlc2V0IGRyYWdnZWQgaW5kZXhcclxuICAgIGRyYWdTdGFydEluZGV4ID0gLTFcclxuICAgICRtZXRhZGF0YS5mb3Jtc1tmb3JtX2tleV0uZWxlbWVudHM9Zm9ybUVsZW1lbnRzXHJcbn1cclxuLyoqXHJcbiAqIHVwZGF0ZXMgZWxlbWVudHMgZGF0YSAoZS5nLiBuYW1lLCBsYWJlbCwuLi4pXHJcbiAqIEBwYXJhbSBpbmRleFxyXG4gKiBAcGFyYW0gZWxlbWVudFxyXG4gKi9cclxuICBmdW5jdGlvbiB1cGRhdGVFbGVtZW50KGluZGV4LGVsZW1lbnQpIHtcclxuICAgIGZvcm1FbGVtZW50c1tpbmRleF09ZWxlbWVudFxyXG4gICAgZW5zdXJlVW5pcXVlTmFtZXMoKVxyXG4gICAgc2V0RGVmYXVsdFZhbHVlcygpXHJcbiAgICAkbWV0YWRhdGEuZm9ybXNbZm9ybV9rZXldLmVsZW1lbnRzPWZvcm1FbGVtZW50c1xyXG4gICAgbGV0IGhlbHBlcj1uZXcgbWFwcGluZ3NIZWxwZXIoKVxyXG4gICAgaGVscGVyLmNsZWFuVXBNYXBwaW5ncygkbWV0YWRhdGEpXHJcblxyXG4gIH1cclxuICAvKipcclxuICAgKiByZW1vdmUgb25lIGVsZW1lbnQgZnJvbSBmb3JtXHJcbiAgICogQHBhcmFtIGluZGV4XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChpbmRleCkge1xyXG4gICAgc2VsZWN0V29ya2Zsb3dUeXBlPWZhbHNlXHJcbiAgICBmb3JtRWxlbWVudHMudXBkYXRlKGVsZW1lbnRzID0+IGVsZW1lbnRzLmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpKVxyXG4gIH1cclxuXHJcbiAgbGV0IGFkdmFuY2VkT3B0aW9ucz10cnVlXHJcbiAgLyoqXHJcbiAgICogaGlkZS9zaG93IHBhcnRzIG9mIHRoZSBmb3JtXHJcbiAgICogQHBhcmFtIGVsZW1lbnRcclxuICAgKiBAcGFyYW0gaW5kZXhcclxuICAgKi9cclxuICBmdW5jdGlvbiBjaGVja0FkdmFuY2VkT3B0aW9ucyhlbGVtZW50LGluZGV4KSB7XHJcbiAgICBpZiAoYWR2YW5jZWRPcHRpb25zKSByZXR1cm4gXCJibG9ja1wiXHJcbiAgICBpZiAoZWxlbWVudC50eXBlPT09XCJhZHZhbmNlZF9vcHRpb25zXCIpIHJldHVybiBcImJsb2NrXCJcclxuICAgIGxldCBhZHZhbmNlZE9wdGlvbnNJbmRleD0tMVxyXG4gICAgZm9yKGxldCBpPTA7aTxmb3JtRWxlbWVudHMubGVuZ3RoO2krKykge1xyXG4gICAgICBsZXQgZT1mb3JtRWxlbWVudHNbaV1cclxuICAgICAgaWYgIChlLnR5cGU9PT1cImFkdmFuY2VkX29wdGlvbnNcIikgYWR2YW5jZWRPcHRpb25zSW5kZXg9aVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhZHZhbmNlZE9wdGlvbnNJbmRleDwwKSB7IC8vIGVsZW1lbnQgZG9lcyBub3QgZXhpc3RzIGFueW1vcmVcclxuICAgICAgYWR2YW5jZWRPcHRpb25zPXRydWVcclxuICAgICAgcmV0dXJuIFwiYmxvY2tcIlxyXG4gICAgfVxyXG4gICAgaWYgKGluZGV4IDxhZHZhbmNlZE9wdGlvbnNJbmRleCkgcmV0dXJuIFwiYmxvY2tcIiAvLyBiZWZvcmUgYWR2YW5jZWQgb3B0aW9uc1xyXG4gICAgcmV0dXJuIFwibm9uZVwiXHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZXhlY3V0ZVJ1bGVzKGVsZW1lbnQsdmFsdWUpIHtcclxuICAgIC8vIGZpcnN0IHNldCB0aGUgbmV3IHZhbHVlXHJcbiAgICBkYXRhW2VsZW1lbnQubmFtZV09dmFsdWVcclxuICAgIGRhdGEuY29udHJvbG5ldD1bXVxyXG4gICAgZGF0YS5jb250cm9sbmV0WzBdPXtcInR5cGVcIjpcInBvc2VcIn1cclxuICAgIC8vIG5vdyBleGVjdXRlIHJ1bGVzXHJcbiAgICBsZXQgcmU9bmV3IHJ1bGVzRXhlY3V0aW9uKCkgICAgXHJcbiAgICBsZXQgcmVzPXJlLmV4ZWN1dGUoZGF0YSxmb3JtRWxlbWVudHMsJG1ldGFkYXRhLnJ1bGVzLHtcImNvbnRyb2xuZXRcIjowfSlcclxuICAgIGlmICghcmVzKSByZXR1cm5cclxuICAgIGRhdGE9cmVzLmRhdGFcclxuICB9XHJcbiAgZnVuY3Rpb24gc2V0RGVmYXVsdFZhbHVlcygpIHtcclxuICAgIGlmICghZm9ybUVsZW1lbnRzKSByZXR1cm5cclxuICAgIGZvcihsZXQgaT0wO2k8Zm9ybUVsZW1lbnRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgbGV0IGZpZWxkPWZvcm1FbGVtZW50c1tpXVxyXG4gICAgICBpZiAoIWRhdGFbZmllbGQubmFtZV0pIGRhdGFbZmllbGQubmFtZV09ZmllbGQuZGVmYXVsdFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbmxldCBzZWxlY3RXb3JrZmxvd1R5cGU9ZmFsc2VcclxuIGZ1bmN0aW9uIHF1aWNrc3RhcnQodHlwZSkge1xyXG4gIGxldCB3b3JrZmxvdz13aW5kb3cuYXBwLmdyYXBoLnNlcmlhbGl6ZSgpXHJcbiAgbGV0IGhlbHBlcj1uZXcgbWFwcGluZ3NIZWxwZXJcclxuICAvLyAxLiBzZXQgZGVmYXVsdCBmb3JtXHJcbiAgaWYgKHR5cGU9PT1cIlR4dDJJbWFnZVwiIHx8IHR5cGU9PT1cIklucGFpbnRpbmdcIikge1xyXG4gICAgJG1ldGFkYXRhLmZvcm1zPWZvcm1UZW1wbGF0ZV9UeHQySW1hZ2VcclxuICAgIGZvcm1FbGVtZW50cz0kbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50c1xyXG4gICAgc2V0RGVmYXVsdFZhbHVlcygpXHJcbiAgICBpZiAoKCRtZXRhZGF0YS50YWdzIHx8ICEkbWV0YWRhdGEudGFncy5sZW5ndGgpICYmIHR5cGU9PT1cIlR4dDJJbWFnZVwiKSB7XHJcbiAgICAgICRtZXRhZGF0YS50YWdzPVtcIlR4dDJJbWFnZVwiXVxyXG4gICAgfVxyXG4gICAgaWYgKCgkbWV0YWRhdGEudGFncyB8fCAhJG1ldGFkYXRhLnRhZ3MubGVuZ3RoKSAmJiB0eXBlPT09XCJJbnBhaW50aW5nXCIpIHtcclxuICAgICAgJG1ldGFkYXRhLnRhZ3M9W1wiVHh0MkltYWdlXCIsXCJJbnBhaW50aW5nXCJdXHJcbiAgICB9ICAgIFxyXG4gIH0gXHJcbiAgaWYgKHR5cGU9PT1cIkxheWVyTWVudVwiKSB7XHJcbiAgICAkbWV0YWRhdGEuZm9ybXM9Zm9ybVRlbXBsYXRlX0xheWVyTWVudVxyXG4gICAgZm9ybUVsZW1lbnRzPSRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzXHJcbiAgICBpZiAoISRtZXRhZGF0YS50YWdzIHx8ICEkbWV0YWRhdGEudGFncy5sZW5ndGgpICRtZXRhZGF0YS50YWdzPVtcIkxheWVyTWVudVwiXVxyXG4gICAgc2V0RGVmYXVsdFZhbHVlcygpXHJcbiAgfVxyXG5cclxuICAvLyAyLiBzZXQgZGVmYXVsdCBtYXBwaW5nczogb3V0cHV0IGltYWdlXHJcbiAgbGV0IG5vZGU9aGVscGVyLmdldE5vZGVCeVR5cGUod29ya2Zsb3csXCJTYXZlSW1hZ2VcIilcclxuICBpZiAobm9kZSkgeyAgIFxyXG4gICAgaGVscGVyLmFkZE1hcHBpbmcoJG1ldGFkYXRhLG5vZGUuaWQsXCJyZXN1bHRJbWFnZVwiLFwiZmlsZW5hbWVfcHJlZml4XCIpXHJcbiAgfVxyXG4gIC8vIDMuIGlucHV0IGltYWdlIG1hcHBpbmdzXHJcbiAgaWYgKHR5cGU9PT1cIkxheWVyTWVudVwiKSB7XHJcbiAgICBsZXQgbm9kZT1oZWxwZXIuZ2V0Tm9kZUJ5VHlwZSh3b3JrZmxvdyxcIkxvYWRJbWFnZVwiKVxyXG4gICAgaWYgKG5vZGUpIHsgICBcclxuICAgICAgaGVscGVyLmFkZE1hcHBpbmcoJG1ldGFkYXRhLG5vZGUuaWQsXCJjdXJyZW50TGF5ZXJcIixcImltYWdlXCIpXHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIDMuIGlucHV0IGltYWdlIG1hcHBpbmdzXHJcbiAgaWYgKHR5cGU9PT1cIlR4dDJJbWFnZVwiKSB7XHJcbiAgICBsZXQgbm9kZT1oZWxwZXIuZ2V0Tm9kZUJ5VHlwZSh3b3JrZmxvdyxcIkxvYWRJbWFnZVwiKVxyXG4gICAgaWYgKG5vZGUpIHsgICBcclxuICAgICAgaGVscGVyLmFkZE1hcHBpbmcoJG1ldGFkYXRhLG5vZGUuaWQsXCJtZXJnZWRJbWFnZVwiLFwiaW1hZ2VcIilcclxuICAgIH1cclxuICB9ICBcclxuICBzZWxlY3RXb3JrZmxvd1R5cGU9ZmFsc2VcclxuICAgZGlzcGF0Y2goXCJyZWZyZXNoVGFnc1wiLCRtZXRhZGF0YS50YWdzKVxyXG4gfVxyXG4gbGV0IGZpZWxkU2VsZWN0b3JcclxuXHJcbjwvc2NyaXB0PlxyXG5cclxuPEZpZWxkU2VsZWN0b3IgYmluZDp0aGlzPXtmaWVsZFNlbGVjdG9yfSBvbjpzZWxlY3Q9eyhlKT0+eyBhZGRFbGVtZW50KGUpfX0+PC9GaWVsZFNlbGVjdG9yPlxyXG5cclxuXHJcbjxkaXYgY2xhc3M9XCJmb3JtQnVpbGRlclwiPlxyXG48aDE+RWRpdCBmb3JtPC9oMT5cclxuPGRpdiBjbGFzcz1cImZvcm1cIj5cclxuICB7I2lmICFmb3JtRWxlbWVudHMubGVuZ3RofVxyXG4gICAgeyNpZiAhc2VsZWN0V29ya2Zsb3dUeXBlfVxyXG4gICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKT0+e3NlbGVjdFdvcmtmbG93VHlwZT10cnVlfX0+UXVpY2tzdGFydDwvYnV0dG9uPlxyXG4gICAgezplbHNlfVxyXG4gICAgICBRdWlja3N0YXJ0IC0gU2VsZWN0IHR5cGU6PGJyPjxicj5cclxuICAgICAgPGJ1dHRvbiBvbjpjbGljaz17KCk9PntxdWlja3N0YXJ0KFwiVHh0MkltYWdlXCIpfX0+VHh0MkltYWdlPC9idXR0b24+XHJcbiAgICAgIDxidXR0b24gb246Y2xpY2s9eygpPT57cXVpY2tzdGFydChcIklucGFpbnRpbmdcIil9fT5JbnBhaW50aW5nPC9idXR0b24+XHJcbiAgICAgIDxidXR0b24gb246Y2xpY2s9eygpPT57cXVpY2tzdGFydChcIkxheWVyTWVudVwiKX19PkxheWVyTWVudTwvYnV0dG9uPlxyXG4gICAgey9pZn1cclxuXHJcblxyXG4gIHsvaWZ9XHJcbiAgeyNlYWNoIGZvcm1FbGVtZW50cyBhcyBlbGVtZW50LCBpbmRleCAoZWxlbWVudC5uYW1lKX1cclxuICAgIDxkaXZcclxuICAgICAgY2xhc3M9XCJkcmFnZ2FibGVcIlxyXG4gICAgICBkcmFnZ2FibGU9XCJ0cnVlXCJcclxuICAgICAgc3R5bGU9XCJkaXNwbGF5OntjaGVja0FkdmFuY2VkT3B0aW9ucyhlbGVtZW50LGluZGV4KX1cIlxyXG4gICAgICBvbjpkcmFnc3RhcnQ9eygpID0+IGhhbmRsZURyYWdTdGFydChldmVudCwgaW5kZXgpfVxyXG4gICAgICBvbjpkcmFnb3Zlcj17aGFuZGxlRHJhZ092ZXJ9XHJcbiAgICAgIG9uOmRyb3A9eygpID0+IGhhbmRsZURyb3AoZXZlbnQsIGluZGV4KX0+XHJcbiAgICAgIDxGb3JtRWxlbWVudCB7ZWxlbWVudH0gYmluZDphZHZhbmNlZE9wdGlvbnM9e2FkdmFuY2VkT3B0aW9uc31cclxuICAgICAgICBvbjpyZWRyYXdBbGw9eyhlKSA9PiB7Zm9ybUVsZW1lbnRzPWZvcm1FbGVtZW50c319XHJcbiAgICAgICAgb246cmVtb3ZlPXsoKSA9PiByZW1vdmVFbGVtZW50KGluZGV4KX0gIFxyXG4gICAgICAgIG9uOm9wZW5Qcm9wZXJ0aWVzPXsoKSA9PiB7c2hvd1Byb3BlcnRpZXNJZHg9aW5kZXggfX0gXHJcbiAgICAgICAgb246Y2xvc2VQcm9wZXJ0aWVzPXsoKSA9PiB7c2hvd1Byb3BlcnRpZXNJZHg9LTEgfX1cclxuICAgICAgICBvbjp1cGRhdGU9eyhlKSA9PiB7IHVwZGF0ZUVsZW1lbnQoaW5kZXgsZS5kZXRhaWwpICB9fVxyXG4gICAgICAgIG9uOmRlbGV0ZT17KGUpID0+IHsgZm9ybUVsZW1lbnRzLnNwbGljZShzaG93UHJvcGVydGllc0lkeCwxKTtmb3JtRWxlbWVudHM9Zm9ybUVsZW1lbnRzO3Nob3dQcm9wZXJ0aWVzSWR4PS0xIH19XHJcbiAgICAgICAgdmFsdWU9e2RhdGFbZWxlbWVudC5uYW1lXX1cclxuICAgICAgICBvbjpjaGFuZ2U9e2UgPT4geyBleGVjdXRlUnVsZXMoZWxlbWVudCxlLmRldGFpbC52YWx1ZSk7IH19XHJcbiAgICAgICAgc2hvd1Byb3BlcnRpZXM9e3Nob3dQcm9wZXJ0aWVzSWR4PT09aW5kZXh9Lz5cclxuICAgICAgPC9kaXY+XHJcbiAgey9lYWNofVxyXG48L2Rpdj5cclxuPGRpdj5cclxuIFxyXG4gIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiBmaWVsZFNlbGVjdG9yLm9wZW5EaWFsb2coZSxwb3NYLHBvc1kpfT4rIEFkZCBFbGVtZW50PC9idXR0b24+XHJcbjwvZGl2PlxyXG48L2Rpdj5cclxuPHN0eWxlPlxyXG4gIC5mb3JtQnVpbGRlciB7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgd2lkdGg6IDQ3MHB4O1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfVxyXG4gIC5mb3JtQnVpbGRlciBoMSB7XHJcbiAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gIH1cclxuICAuZHJhZ2dhYmxlIHtcclxuICAgIGN1cnNvcjogZ3JhYjtcclxuICB9XHJcbiAgLmZvcm0ge1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICB3aWR0aDogNDUwcHg7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgZm9udDogXCJTZWdvZSBVSVwiLCBSb2JvdG8sIHN5c3RlbS11aTtcclxuICAgIGZvbnQtc2l6ZToxNHB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICB9XHJcbiAgLmZvcm1CdWlsZGVyIC5hZGRfZmllbGRfc2VsZWN0X2xhYmVsIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcbiAgLmZvcm1CdWlsZGVyIC5hZGRfZmllbGRfc2VsZWN0IHtcclxuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIHBhZGRpbmc6IDVweDsgICBcclxuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgfVxyXG4gICAgLmZvcm1CdWlsZGVyIGJ1dHRvbiB7XHJcbiAgICAgICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIG1pbi13aWR0aDogNzBweDtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIyNywgMjA2LCAxMTYpO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogcmdiKDEyOCwgMTI4LCAxMjgpO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gICAgfVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF1UUUsMENBQWEsQ0FDWCxPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxLQUFLLENBQ1osS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsS0FDWCxDQUNBLDJCQUFZLENBQUMsaUJBQUcsQ0FDZCxTQUFTLENBQUUsSUFBSSxDQUNmLGFBQWEsQ0FBRSxJQUNqQixDQUNBLHdDQUFXLENBQ1QsTUFBTSxDQUFFLElBQ1YsQ0FDQSxtQ0FBTSxDQUNKLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLGdCQUFnQixDQUFFLEtBQUssQ0FDdkIsS0FBSyxDQUFFLEtBQUssQ0FDWixPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxLQUFLLENBQ1osSUFBSSxDQUFFLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FDbkMsVUFBVSxJQUFJLENBQ2QsYUFBYSxDQUFFLElBQ2pCLENBV0UsMkJBQVksQ0FBQyxxQkFBTyxDQUNoQixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUNuSSxTQUFTLENBQUUsSUFBSSxDQUNmLFNBQVMsQ0FBRSxJQUFJLENBQ2YsS0FBSyxDQUFFLEtBQUssQ0FDWixnQkFBZ0IsQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNwQyxZQUFZLENBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDaEMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsTUFBTSxDQUFFLE9BQU8sQ0FDZixZQUFZLENBQUUsSUFDbEIifQ== */");
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	child_ctx[44] = i;
    	return child_ctx;
    }

    // (225:2) {#if !formElements.length}
    function create_if_block$4(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*selectWorkflowType*/ ctx[6]) return create_if_block_1$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
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
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(225:2) {#if !formElements.length}",
    		ctx
    	});

    	return block;
    }

    // (228:4) {:else}
    function create_else_block$2(ctx) {
    	let t0;
    	let br0;
    	let br1;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Quickstart - Select type:");
    			br0 = element("br");
    			br1 = element("br");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Txt2Image";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Inpainting";
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = "LayerMenu";
    			add_location(br0, file$4, 228, 31, 7201);
    			add_location(br1, file$4, 228, 35, 7205);
    			attr_dev(button0, "class", "svelte-1yl6ahv");
    			add_location(button0, file$4, 229, 6, 7217);
    			attr_dev(button1, "class", "svelte-1yl6ahv");
    			add_location(button1, file$4, 230, 6, 7292);
    			attr_dev(button2, "class", "svelte-1yl6ahv");
    			add_location(button2, file$4, 231, 6, 7369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button2, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[22], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[23], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_3*/ ctx[24], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(228:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (226:4) {#if !selectWorkflowType}
    function create_if_block_1$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Quickstart";
    			attr_dev(button, "class", "svelte-1yl6ahv");
    			add_location(button, file$4, 226, 6, 7087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[21], false, false, false, false);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(226:4) {#if !selectWorkflowType}",
    		ctx
    	});

    	return block;
    }

    // (237:2) {#each formElements as element, index (element.name)}
    function create_each_block$4(key_1, ctx) {
    	let div;
    	let formelement;
    	let updating_advancedOptions;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	function formelement_advancedOptions_binding(value) {
    		/*formelement_advancedOptions_binding*/ ctx[25](value);
    	}

    	function remove_handler() {
    		return /*remove_handler*/ ctx[27](/*index*/ ctx[44]);
    	}

    	function openProperties_handler() {
    		return /*openProperties_handler*/ ctx[28](/*index*/ ctx[44]);
    	}

    	function update_handler(...args) {
    		return /*update_handler*/ ctx[30](/*index*/ ctx[44], ...args);
    	}

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[32](/*element*/ ctx[42], ...args);
    	}

    	let formelement_props = {
    		element: /*element*/ ctx[42],
    		value: /*data*/ ctx[0][/*element*/ ctx[42].name],
    		showProperties: /*showPropertiesIdx*/ ctx[4] === /*index*/ ctx[44]
    	};

    	if (/*advancedOptions*/ ctx[5] !== void 0) {
    		formelement_props.advancedOptions = /*advancedOptions*/ ctx[5];
    	}

    	formelement = new FormElement({ props: formelement_props, $$inline: true });
    	binding_callbacks.push(() => bind(formelement, 'advancedOptions', formelement_advancedOptions_binding));
    	formelement.$on("redrawAll", /*redrawAll_handler*/ ctx[26]);
    	formelement.$on("remove", remove_handler);
    	formelement.$on("openProperties", openProperties_handler);
    	formelement.$on("closeProperties", /*closeProperties_handler*/ ctx[29]);
    	formelement.$on("update", update_handler);
    	formelement.$on("delete", /*delete_handler*/ ctx[31]);
    	formelement.$on("change", change_handler);

    	function dragstart_handler() {
    		return /*dragstart_handler*/ ctx[33](/*index*/ ctx[44]);
    	}

    	function drop_handler() {
    		return /*drop_handler*/ ctx[34](/*index*/ ctx[44]);
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
    			set_style(div, "display", /*checkAdvancedOptions*/ ctx[14](/*element*/ ctx[42], /*index*/ ctx[44]));
    			add_location(div, file$4, 237, 4, 7523);
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
    					listen_dev(div, "dragover", /*handleDragOver*/ ctx[10], false, false, false, false),
    					listen_dev(div, "drop", drop_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formelement_changes = {};
    			if (dirty[0] & /*formElements*/ 8) formelement_changes.element = /*element*/ ctx[42];
    			if (dirty[0] & /*data, formElements*/ 9) formelement_changes.value = /*data*/ ctx[0][/*element*/ ctx[42].name];
    			if (dirty[0] & /*showPropertiesIdx, formElements*/ 24) formelement_changes.showProperties = /*showPropertiesIdx*/ ctx[4] === /*index*/ ctx[44];

    			if (!updating_advancedOptions && dirty[0] & /*advancedOptions*/ 32) {
    				updating_advancedOptions = true;
    				formelement_changes.advancedOptions = /*advancedOptions*/ ctx[5];
    				add_flush_callback(() => updating_advancedOptions = false);
    			}

    			formelement.$set(formelement_changes);

    			if (!current || dirty[0] & /*formElements*/ 8) {
    				set_style(div, "display", /*checkAdvancedOptions*/ ctx[14](/*element*/ ctx[42], /*index*/ ctx[44]));
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
    		source: "(237:2) {#each formElements as element, index (element.name)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let fieldselector;
    	let t0;
    	let div2;
    	let h1;
    	let t2;
    	let div0;
    	let t3;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t4;
    	let div1;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let fieldselector_props = {};

    	fieldselector = new FieldSelector({
    			props: fieldselector_props,
    			$$inline: true
    		});

    	/*fieldselector_binding*/ ctx[19](fieldselector);
    	fieldselector.$on("select", /*select_handler*/ ctx[20]);
    	let if_block = !/*formElements*/ ctx[3].length && create_if_block$4(ctx);
    	let each_value = /*formElements*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*element*/ ctx[42].name;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			create_component(fieldselector.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Edit form";
    			t2 = space();
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "+ Add Element";
    			attr_dev(h1, "class", "svelte-1yl6ahv");
    			add_location(h1, file$4, 222, 0, 6980);
    			attr_dev(div0, "class", "form svelte-1yl6ahv");
    			add_location(div0, file$4, 223, 0, 7000);
    			attr_dev(button, "class", "svelte-1yl6ahv");
    			add_location(button, file$4, 259, 2, 8469);
    			add_location(div1, file$4, 257, 0, 8457);
    			attr_dev(div2, "class", "formBuilder svelte-1yl6ahv");
    			add_location(div2, file$4, 221, 0, 6953);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldselector, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t2);
    			append_dev(div2, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div0, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[35], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const fieldselector_changes = {};
    			fieldselector.$set(fieldselector_changes);

    			if (!/*formElements*/ ctx[3].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div0, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*checkAdvancedOptions, formElements, handleDragStart, handleDragOver, handleDrop, data, showPropertiesIdx, advancedOptions, removeElement, updateElement, executeRules*/ 65081) {
    				each_value = /*formElements*/ ctx[3];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldselector.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldselector.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*fieldselector_binding*/ ctx[19](null);
    			destroy_component(fieldselector, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

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
    	let $metadata;
    	validate_store(metadata, 'metadata');
    	component_subscribe($$self, metadata, $$value => $$invalidate(37, $metadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FormBuilder', slots, []);
    	const dispatch = createEventDispatcher();
    	if (!$metadata.forms) set_store_value(metadata, $metadata.forms = {}, $metadata);
    	let { form_key = 'default' } = $$props; // support for multiple forms (e.g. wizards) in the future
    	let { data = {} } = $$props; // the form data
    	let { refresh } = $$props;
    	let { posX, posY } = $$props; // position of the parent dialog
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

    	function addElement(e) {
    		fieldSelector.hideDialog();
    		let newElement = e.detail;
    		if (!newElement) return;
    		formElements.push(newElement);
    		ensureUniqueNames();
    		(($$invalidate(3, formElements), $$invalidate(18, refresh)), $$invalidate(0, data));
    		$$invalidate(4, showPropertiesIdx = formElements.length - 1);
    		setDefaultValues();
    	}

    	function handleDragStart(event, index) {
    		if (!advancedOptions) return;
    		dragStartIndex = index;
    	}

    	/**
     * drag and drop to change order in list
     * @param event
     */
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
    		$$invalidate(3, formElements = reorderedItems);

    		(($$invalidate(3, formElements), $$invalidate(18, refresh)), $$invalidate(0, data));

    		// Reset dragged index
    		dragStartIndex = -1;

    		set_store_value(metadata, $metadata.forms[form_key].elements = formElements, $metadata);
    	}

    	/**
     * updates elements data (e.g. name, label,...)
     * @param index
     * @param element
     */
    	function updateElement(index, element) {
    		$$invalidate(3, formElements[index] = element, formElements);
    		ensureUniqueNames();
    		setDefaultValues();
    		set_store_value(metadata, $metadata.forms[form_key].elements = formElements, $metadata);
    		let helper = new mappingsHelper();
    		helper.cleanUpMappings($metadata);
    	}

    	/**
     * remove one element from form
     * @param index
     */
    	function removeElement(index) {
    		$$invalidate(6, selectWorkflowType = false);
    		formElements.update(elements => elements.filter((_, i) => i !== index));
    	}

    	let advancedOptions = true;

    	/**
     * hide/show parts of the form
     * @param element
     * @param index
     */
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
    			$$invalidate(5, advancedOptions = true);

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

    	let selectWorkflowType = false;

    	function quickstart(type) {
    		let workflow = window.app.graph.serialize();
    		let helper = new mappingsHelper();

    		// 1. set default form
    		if (type === "Txt2Image" || type === "Inpainting") {
    			set_store_value(metadata, $metadata.forms = formTemplate_Txt2Image, $metadata);
    			$$invalidate(3, formElements = $metadata.forms.default.elements);
    			setDefaultValues();

    			if (($metadata.tags || !$metadata.tags.length) && type === "Txt2Image") {
    				set_store_value(metadata, $metadata.tags = ["Txt2Image"], $metadata);
    			}

    			if (($metadata.tags || !$metadata.tags.length) && type === "Inpainting") {
    				set_store_value(metadata, $metadata.tags = ["Txt2Image", "Inpainting"], $metadata);
    			}
    		}

    		if (type === "LayerMenu") {
    			set_store_value(metadata, $metadata.forms = formTemplate_LayerMenu, $metadata);
    			$$invalidate(3, formElements = $metadata.forms.default.elements);
    			if (!$metadata.tags || !$metadata.tags.length) set_store_value(metadata, $metadata.tags = ["LayerMenu"], $metadata);
    			setDefaultValues();
    		}

    		// 2. set default mappings: output image
    		let node = helper.getNodeByType(workflow, "SaveImage");

    		if (node) {
    			helper.addMapping($metadata, node.id, "resultImage", "filename_prefix");
    		}

    		// 3. input image mappings
    		if (type === "LayerMenu") {
    			let node = helper.getNodeByType(workflow, "LoadImage");

    			if (node) {
    				helper.addMapping($metadata, node.id, "currentLayer", "image");
    			}
    		}

    		// 3. input image mappings
    		if (type === "Txt2Image") {
    			let node = helper.getNodeByType(workflow, "LoadImage");

    			if (node) {
    				helper.addMapping($metadata, node.id, "mergedImage", "image");
    			}
    		}

    		$$invalidate(6, selectWorkflowType = false);
    		dispatch("refreshTags", $metadata.tags);
    	}

    	let fieldSelector;

    	$$self.$$.on_mount.push(function () {
    		if (refresh === undefined && !('refresh' in $$props || $$self.$$.bound[$$self.$$.props['refresh']])) {
    			console.warn("<FormBuilder> was created without expected prop 'refresh'");
    		}

    		if (posX === undefined && !('posX' in $$props || $$self.$$.bound[$$self.$$.props['posX']])) {
    			console.warn("<FormBuilder> was created without expected prop 'posX'");
    		}

    		if (posY === undefined && !('posY' in $$props || $$self.$$.bound[$$self.$$.props['posY']])) {
    			console.warn("<FormBuilder> was created without expected prop 'posY'");
    		}
    	});

    	const writable_props = ['form_key', 'data', 'refresh', 'posX', 'posY'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FormBuilder> was created with unknown prop '${key}'`);
    	});

    	function fieldselector_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fieldSelector = $$value;
    			$$invalidate(7, fieldSelector);
    		});
    	}

    	const select_handler = e => {
    		addElement(e);
    	};

    	const click_handler = () => {
    		$$invalidate(6, selectWorkflowType = true);
    	};

    	const click_handler_1 = () => {
    		quickstart("Txt2Image");
    	};

    	const click_handler_2 = () => {
    		quickstart("Inpainting");
    	};

    	const click_handler_3 = () => {
    		quickstart("LayerMenu");
    	};

    	function formelement_advancedOptions_binding(value) {
    		advancedOptions = value;
    		$$invalidate(5, advancedOptions);
    	}

    	const redrawAll_handler = e => {
    		(($$invalidate(3, formElements), $$invalidate(18, refresh)), $$invalidate(0, data));
    	};

    	const remove_handler = index => removeElement(index);

    	const openProperties_handler = index => {
    		$$invalidate(4, showPropertiesIdx = index);
    	};

    	const closeProperties_handler = () => {
    		$$invalidate(4, showPropertiesIdx = -1);
    	};

    	const update_handler = (index, e) => {
    		updateElement(index, e.detail);
    	};

    	const delete_handler = e => {
    		formElements.splice(showPropertiesIdx, 1);
    		(($$invalidate(3, formElements), $$invalidate(18, refresh)), $$invalidate(0, data));
    		$$invalidate(4, showPropertiesIdx = -1);
    	};

    	const change_handler = (element, e) => {
    		executeRules(element, e.detail.value);
    	};

    	const dragstart_handler = index => handleDragStart(event, index);
    	const drop_handler = index => handleDrop(event, index);
    	const click_handler_4 = e => fieldSelector.openDialog(e, posX, posY);

    	$$self.$$set = $$props => {
    		if ('form_key' in $$props) $$invalidate(17, form_key = $$props.form_key);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('refresh' in $$props) $$invalidate(18, refresh = $$props.refresh);
    		if ('posX' in $$props) $$invalidate(1, posX = $$props.posX);
    		if ('posY' in $$props) $$invalidate(2, posY = $$props.posY);
    	};

    	$$self.$capture_state = () => ({
    		FormElement,
    		metadata,
    		rulesExecution,
    		formTemplate_Txt2Image,
    		formTemplate_LayerMenu,
    		mappingsHelper,
    		FieldSelector,
    		createEventDispatcher,
    		dispatch,
    		form_key,
    		data,
    		refresh,
    		posX,
    		posY,
    		formElements,
    		dragStartIndex,
    		showPropertiesIdx,
    		selectedType,
    		ensureUniqueNames,
    		addElement,
    		handleDragStart,
    		handleDragOver,
    		handleDrop,
    		updateElement,
    		removeElement,
    		advancedOptions,
    		checkAdvancedOptions,
    		executeRules,
    		setDefaultValues,
    		selectWorkflowType,
    		quickstart,
    		fieldSelector,
    		$metadata
    	});

    	$$self.$inject_state = $$props => {
    		if ('form_key' in $$props) $$invalidate(17, form_key = $$props.form_key);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('refresh' in $$props) $$invalidate(18, refresh = $$props.refresh);
    		if ('posX' in $$props) $$invalidate(1, posX = $$props.posX);
    		if ('posY' in $$props) $$invalidate(2, posY = $$props.posY);
    		if ('formElements' in $$props) $$invalidate(3, formElements = $$props.formElements);
    		if ('dragStartIndex' in $$props) dragStartIndex = $$props.dragStartIndex;
    		if ('showPropertiesIdx' in $$props) $$invalidate(4, showPropertiesIdx = $$props.showPropertiesIdx);
    		if ('selectedType' in $$props) selectedType = $$props.selectedType;
    		if ('advancedOptions' in $$props) $$invalidate(5, advancedOptions = $$props.advancedOptions);
    		if ('selectWorkflowType' in $$props) $$invalidate(6, selectWorkflowType = $$props.selectWorkflowType);
    		if ('fieldSelector' in $$props) $$invalidate(7, fieldSelector = $$props.fieldSelector);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*refresh, formElements, data*/ 262153) {
    			{
    				if (refresh) {
    					for (let i = 0; i < formElements.length; i++) {
    						let element = formElements[i];
    						if (!data[element.name]) $$invalidate(0, data[element.name] = element.default, data);
    					}

    					(($$invalidate(3, formElements), $$invalidate(18, refresh)), $$invalidate(0, data));
    				}
    			}
    		}
    	};

    	return [
    		data,
    		posX,
    		posY,
    		formElements,
    		showPropertiesIdx,
    		advancedOptions,
    		selectWorkflowType,
    		fieldSelector,
    		addElement,
    		handleDragStart,
    		handleDragOver,
    		handleDrop,
    		updateElement,
    		removeElement,
    		checkAdvancedOptions,
    		executeRules,
    		quickstart,
    		form_key,
    		refresh,
    		fieldselector_binding,
    		select_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
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
    		click_handler_4
    	];
    }

    class FormBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				form_key: 17,
    				data: 0,
    				refresh: 18,
    				posX: 1,
    				posY: 2
    			},
    			add_css$5,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormBuilder",
    			options,
    			id: create_fragment$5.name
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

    	get posX() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set posX(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get posY() {
    		throw new Error("<FormBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set posY(value) {
    		throw new Error("<FormBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\InputCombo.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\InputCombo.svelte";

    function add_css$4(target) {
    	append_styles(target, "svelte-12v7n6u", ".input.svelte-12v7n6u.svelte-12v7n6u{background-color:black;color:white;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}.input.svelte-12v7n6u option.svelte-12v7n6u{background-color:black;color:white}.input.svelte-12v7n6u optgroup.svelte-12v7n6u{background-color:black;color:white}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5wdXRDb21iby5zdmVsdGUiLCJzb3VyY2VzIjpbIklucHV0Q29tYm8uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgXHJcblxyXG4gIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gXCIuL3N0b3Jlcy9tZXRhZGF0YVwiO1xyXG5cclxuICBleHBvcnQgbGV0IHZhbHVlPVwiXCJcclxuICBpbXBvcnQgSWNvbiBmcm9tICcuL0ljb24uc3ZlbHRlJ1xyXG4gIGxldCBzaG93Qm94PWZhbHNlXHJcbiAgPC9zY3JpcHQ+XHJcbiAgXHJcbiAgPHN0eWxlPlxyXG4gICAgXHJcbiAgICAuaW5wdXQge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgVWJ1bnR1LCBDYW50YXJlbGwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiU2Vnb2UgVUlcIiwgSGVsdmV0aWNhLCBBcmlhbDtcclxuICAgICAgICBwYWRkaW5nOiAzcHg7XHJcbiAgICB9XHJcbiAgICAuaW5wdXQgb3B0aW9uIHtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gICAgLmlucHV0IG9wdGdyb3VwIHtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgfVxyXG4gIDwvc3R5bGU+XHJcbjxpbnB1dCB0eXBlPVwidGV4dFwiIHt2YWx1ZX0gY2xhc3M9XCJpbnB1dFwiIG9uOmNoYW5nZT17KGUpID0+IHsgdmFsdWU9ZS50YXJnZXQudmFsdWU7IHNob3dCb3g9ZmFsc2V9fT48SWNvbiBuYW1lPVwiY29tYm9MaXN0XCIgb246Y2xpY2s9eyhlKSA9PiB7c2hvd0JveD10cnVlfX0+PC9JY29uPlxyXG57I2lmIHNob3dCb3h9XHJcbiAgPHNlbGVjdCBjbGFzcz1cImlucHV0XCIgb246Y2hhbmdlPXsoZSkgPT4geyB2YWx1ZT1lLnRhcmdldC52YWx1ZTsgc2hvd0JveD1mYWxzZX19PlxyXG4gICAgPG9wdGlvbj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgIHsjZWFjaCBPYmplY3QuZW50cmllcygkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSBhcyBbdGl0bGUsdmFsdWVzXX1cclxuICAgICAgPG9wdGdyb3VwIGxhYmVsPXt0aXRsZX0+XHJcbiAgICAgIHsjZWFjaCB2YWx1ZXMgYXMgdn1cclxuICAgICAgICA8b3B0aW9uIHt2fT57dn08L29wdGlvbj5cclxuICAgICAgey9lYWNofVxyXG4gICAgPC9vcHRncm91cD5cclxuICAgIHsvZWFjaH1cclxuICA8L3NlbGVjdD5cclxuey9pZn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBWUksb0NBQU8sQ0FDSCxnQkFBZ0IsQ0FBRSxLQUFLLENBQ3ZCLEtBQUssQ0FBRSxLQUFLLENBQ1osV0FBVyxDQUFFLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDbkksT0FBTyxDQUFFLEdBQ2IsQ0FDQSxxQkFBTSxDQUFDLHFCQUFPLENBQ1osZ0JBQWdCLENBQUUsS0FBSyxDQUNyQixLQUFLLENBQUUsS0FDWCxDQUNBLHFCQUFNLENBQUMsdUJBQVMsQ0FDZCxnQkFBZ0IsQ0FBRSxLQUFLLENBQ3JCLEtBQUssQ0FBRSxLQUNYIn0= */");
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i][0];
    	child_ctx[7] = list[i][1];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
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
    			add_location(option, file$3, 30, 4, 869);
    			attr_dev(select, "class", "input svelte-12v7n6u");
    			add_location(select, file$3, 29, 2, 783);
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
    				dispose = listen_dev(select, "change", /*change_handler_1*/ ctx[5], false, false, false, false);
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
    	let t_value = /*v*/ ctx[10] + "";
    	let t;
    	let option_v_value;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			attr_dev(option, "v", option_v_value = /*v*/ ctx[10]);
    			option.__value = option_value_value = /*v*/ ctx[10];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-12v7n6u");
    			add_location(option, file$3, 34, 8, 1034);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$metadata*/ 4 && t_value !== (t_value = /*v*/ ctx[10] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$metadata*/ 4 && option_v_value !== (option_v_value = /*v*/ ctx[10])) {
    				attr_dev(option, "v", option_v_value);
    			}

    			if (dirty & /*$metadata*/ 4 && option_value_value !== (option_value_value = /*v*/ ctx[10])) {
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
    	let each_value_1 = /*values*/ ctx[7];
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

    			attr_dev(optgroup, "label", optgroup_label_value = /*title*/ ctx[6]);
    			attr_dev(optgroup, "class", "svelte-12v7n6u");
    			add_location(optgroup, file$3, 32, 6, 973);
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
    				each_value_1 = /*values*/ ctx[7];
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

    			if (dirty & /*$metadata*/ 4 && optgroup_label_value !== (optgroup_label_value = /*title*/ ctx[6])) {
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
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { name: "comboList" },
    			$$inline: true
    		});

    	icon.$on("click", /*click_handler*/ ctx[4]);
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

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
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
    			mounted = false;
    			dispose();
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

    	const change_handler = e => {
    		$$invalidate(0, value = e.target.value);
    		$$invalidate(1, showBox = false);
    	};

    	const click_handler = e => {
    		$$invalidate(1, showBox = true);
    	};

    	const change_handler_1 = e => {
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

    	return [value, showBox, $metadata, change_handler, click_handler, change_handler_1];
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

    function get_each_context_5$2(ctx, list, i) {
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
    		each_blocks_2[i] = create_each_block_5$2(get_each_context_5$2(ctx, each_value_5, i));
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
    					const child_ctx = get_each_context_5$2(ctx, each_value_5, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_5$2(child_ctx);
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
    function create_each_block_5$2(ctx) {
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
    		id: create_each_block_5$2.name,
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
    	append_styles(target, "svelte-mlofvx", "#gyre_mappings.svelte-mlofvx .mapping.svelte-mlofvx{border:1px solid white;margin-top:10px;padding:5px;position:relative}#gyre_mappings.svelte-mlofvx .mapping .del.svelte-mlofvx{position:absolute;right:10px;top:2px}#gyre_mappings.svelte-mlofvx button.svelte-mlofvx{font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;font-size:14px;min-width:70px;color:black;background-color:rgb(227, 206, 116);border-color:rgb(128, 128, 128);border-radius:5px;cursor:pointer;margin-right:10px}#gyre_mappings.svelte-mlofvx.svelte-mlofvx{z-index:200;position:fixed;left:10px;top:10px;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:20px;backdrop-filter:blur(20px) brightness(80%);box-shadow:0 0 1rem 0 rgba(255, 255, 255, 0.2);color:white;width:540px;display:block;border-radius:10px;font-size:14px}#gyre_mappings.svelte-mlofvx.svelte-mlofvx{display:none;width:480px;left:200px;top:200px}#gyre_mappings.svelte-mlofvx select.svelte-mlofvx{background-color:grey;font-size:14px;color:white;border:none;margin-top:10px;font-family:system-ui, -apple-system, \"Segoe UI\", Roboto, Ubuntu, Cantarell, \"Noto Sans\", sans-serif, \"Segoe UI\", Helvetica, Arial;padding:3px}#gyre_mappings.svelte-mlofvx select.svelte-mlofvx{background:transparent;border:1px solid white;border-radius:5px}#gyre_mappings.svelte-mlofvx select option.svelte-mlofvx,#gyre_mappings.svelte-mlofvx select optgroup.svelte-mlofvx{background:black}#gyre_mappings.svelte-mlofvx h1.svelte-mlofvx{font-size:16px;margin-top:5px;margin-bottom:30px}#gyre_mappings.svelte-mlofvx .close.svelte-mlofvx{position:absolute;right:20px;top:20px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwcGluZ3Muc3ZlbHRlIiwic291cmNlcyI6WyJNYXBwaW5ncy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cclxuICAgIGltcG9ydCB7IG1ldGFkYXRhfSBmcm9tICcuL3N0b3Jlcy9tZXRhZGF0YSdcclxuICAgIGltcG9ydCBJY29uIGZyb20gJy4vSWNvbi5zdmVsdGUnXHJcbiAgICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnO1xyXG4gICAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKVxyXG5cclxuICAgIGV4cG9ydCBsZXQgcmVuZGVyPXRydWVcclxuICAgIGltcG9ydCB7IG1hcHBpbmdzSGVscGVyIH0gZnJvbSAnLi9tYXBwaW5nc0hlbHBlci5qcydcclxuXHJcbiAgICBsZXQgc2hvd0d5cmVNYXBwaW5ncz1cIm5vbmVcIlxyXG4gICAgbGV0IGd5cmVNYXBwaW5nc0RpYWxvZ0xlZnQ9XCIxMDBweFwiXHJcbiAgICBsZXQgZ3lyZU1hcHBpbmdzRGlhbG9nVG9wPVwiMTAwcHhcIlxyXG4gICAgbGV0IHdpZGdldHM9W11cclxuICAgIGxldCBub2RlVHlwZT1cIlwiXHJcbiAgICBsZXQgbUg9bmV3IG1hcHBpbmdzSGVscGVyKClcclxuICAgIGxldCBtYXBwaW5nRmllbGRzPW1ILmdldE1hcHBpbmdGaWVsZHMoJG1ldGFkYXRhKVxyXG4gICAgbGV0IG5vZGVJZD0wXHJcbiAgICBmdW5jdGlvbiBvcGVuR3lyZU1hcHBpbmdzKG5vZGUsZSkge1xyXG4gICAgICAgIG1hcHBpbmdGaWVsZHM9bUguZ2V0TWFwcGluZ0ZpZWxkcygkbWV0YWRhdGEpXHJcbiAgICAgICAgc2hvd0d5cmVNYXBwaW5ncz1cImJsb2NrXCJcclxuICAgICAgICBub2RlSWQ9bm9kZS5pZFxyXG4gICAgICAgIGxldCB4PWUuY2xpZW50WC00ODAvMlxyXG4gICAgICAgIGxldCB5PWUuY2xpZW50WS0yMDBcclxuICAgICAgICBpZiAoeDwwKSB4PTBcclxuICAgICAgICBpZiAoeTwwKSB5PTBcclxuICAgICAgICBpZiAoeCs0ODA+d2luZG93LmlubmVyV2lkdGgpIHg9d2luZG93LmlubmVyV2lkdGgtNTQwXHJcbiAgICAgICAgaWYgKHkrNDAwPndpbmRvdy5pbm5lckhlaWdodCkgeT13aW5kb3cuaW5uZXJIZWlnaHQtNDAwXHJcblxyXG4gICAgICAgIGd5cmVNYXBwaW5nc0RpYWxvZ0xlZnQ9eCtcInB4XCJcclxuICAgICAgICBneXJlTWFwcGluZ3NEaWFsb2dUb3A9eStcInB4XCJcclxuICAgICAgICBcclxuICAgICAgICB3aWRnZXRzPW5vZGUud2lkZ2V0c1xyXG4gICAgICAgIG5vZGVUeXBlPW5vZGUudHlwZVxyXG4gICAgICAgIGlmICghJG1ldGFkYXRhLm1hcHBpbmdzKSAkbWV0YWRhdGEubWFwcGluZ3M9e31cclxuICAgICAgICBtYXBwaW5ncz0kbWV0YWRhdGEubWFwcGluZ3Nbbm9kZUlkXVxyXG4gICAgICAgIGlmICghbWFwcGluZ3MpIG1hcHBpbmdzPVtdXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93Lm9wZW5HeXJlTWFwcGluZ3M9b3Blbkd5cmVNYXBwaW5ncyAgICAvLyBleHBvc2Ugb3BlbiBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgY2FsbGVkIGZyb20gQ29tZnlVSSBtZW51IGV4dGVuc2lvblxyXG5cclxuICAgIC8vIGNoZWNrIG9mIGEgd2lkZ2V0ICg9YSBub2RlIHByb3BlcnR5KSBpcyBjb25uZWN0ZWQgdG8gYSBmb3JtIGZpZWxkXHJcbiAgICBmdW5jdGlvbiBjaGVja0d5cmVNYXBwaW5nKG5vZGUsd2lkZ2V0KSB7XHJcbiAgICAgICAgaWYgICghJG1ldGFkYXRhLm1hcHBpbmdzKSByZXR1cm5cclxuICAgICAgICBpZiAoISRtZXRhZGF0YS5tYXBwaW5nc1tub2RlLmlkXSkgcmV0dXJuXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTwkbWV0YWRhdGEubWFwcGluZ3Nbbm9kZS5pZF0ubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgbWFwcGluZz0kbWV0YWRhdGEubWFwcGluZ3Nbbm9kZS5pZF1baV1cclxuICAgICAgICAgICAgaWYgKG1hcHBpbmcudG9GaWVsZD09PXdpZGdldC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBtYXBwaW5nLnRvSW5kZXg9aVxyXG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsPSh3aWRnZXQubGFiZWwgfHwgd2lkZ2V0Lm5hbWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWwrXCI9XCIrbWFwcGluZy5mcm9tRmllbGRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHdpbmRvdy5jaGVja0d5cmVNYXBwaW5nPWNoZWNrR3lyZU1hcHBpbmdcclxuXHJcbiAgICBmdW5jdGlvbiBneXJlU2V0Q29tYm9WYWx1ZXMod2lkZ2V0KSB7ICAgICAgICAgICAvLyB0b2RvOiBmaW5kIG91dCBpbiBmdXR1cmUgd2hlcmUgdG8gZGlyZWN0bHkgZ2V0IHRoZXNlIGluZm9ybWF0aW9uXHJcbiAgICAgICAgaWYgKHdpZGdldC50eXBlIT09XCJjb21ib1wiIHx8ICF3aWRnZXQub3B0aW9ucyAgfHwgIXdpZGdldC5vcHRpb25zLnZhbHVlcyB8fCAhd2lkZ2V0Lm5hbWUgKSByZXR1cm5cclxuICAgICAgICBpZiAod2lkZ2V0Lm5hbWU9PT1cImltYWdlXCIpIHJldHVyblxyXG4gICAgICAgIGlmKCEkbWV0YWRhdGEuY29tYm9fdmFsdWVzKSAkbWV0YWRhdGEuY29tYm9fdmFsdWVzID0ge31cclxuICAgICAgICAkbWV0YWRhdGEuY29tYm9fdmFsdWVzW3dpZGdldC5uYW1lXT13aWRnZXQub3B0aW9ucy52YWx1ZXMgLy93aWRnZXQub3B0aW9uc1xyXG4gICAgfVxyXG4gICAgd2luZG93Lmd5cmVTZXRDb21ib1ZhbHVlcz1neXJlU2V0Q29tYm9WYWx1ZXNcclxuXHJcbiAgICBmdW5jdGlvbiBneXJlQ2xlYXJBbGxDb21ib1ZhbHVlcygpIHtcclxuICAgICAgICAkbWV0YWRhdGEuY29tYm9fdmFsdWVzID0ge31cclxuICAgIH1cclxuICAgIHdpbmRvdy5neXJlQ2xlYXJBbGxDb21ib1ZhbHVlcz1neXJlQ2xlYXJBbGxDb21ib1ZhbHVlc1xyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlRGlhbG9nKCkge1xyXG4gICAgICAgIHNob3dHeXJlTWFwcGluZ3M9XCJub25lXCJcclxuICAgIH1cclxuXHJcblxyXG4gICAgbGV0IG1hcHBpbmdzID0gW11cclxuICAgIGxldCBmcm9tRmllbGQ9XCJcIlxyXG4gICAgbGV0IHRvRmllbGQ9XCJcIlxyXG4gICAgbGV0IGFkZEZpZWxkPVwiXCJcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRNYXBwaW5nKCkge1xyXG4gICAgICAgIGlmICghdG9GaWVsZCB8fCAhZnJvbUZpZWxkKSByZXR1cm5cclxuICAgICAgICBpZiAoIW5vZGVJZCkgcmV0dXJuXHJcbiAgICAgICAgbWFwcGluZ3MucHVzaCh7IGZyb21GaWVsZCx0b0ZpZWxkICB9KVxyXG4gICAgICAgIG1hcHBpbmdzPW1hcHBpbmdzXHJcbiAgICAgICAgJG1ldGFkYXRhLm1hcHBpbmdzW25vZGVJZF0gPSBtYXBwaW5nc1xyXG4gICAgICAgIGZyb21GaWVsZD10b0ZpZWxkPWFkZEZpZWxkPVwiXCJcclxuICAgIH0gICAgXHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRm9ybUZpZWxkKGZpZWxkTmFtZSkge1xyXG4gICAgICAgIGlmICghbm9kZUlkKSByZXR1cm5cclxuICAgICAgICBpZiAoIWZpZWxkTmFtZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKGNoZWNrSWZGaWVsZE5hbWVFeGlzdHMoZmllbGROYW1lKSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IHdpZGdldD1nZXRXaWRnZXQoZmllbGROYW1lKVxyXG4gICAgICAgIGlmICghd2lkZ2V0KSByZXR1cm5cclxuICAgICAgICBjb25zb2xlLmxvZyh3aWRnZXQpXHJcblxyXG4gICAgICAgIGxldCB0eXBlPXdpZGdldC50eXBlXHJcbiAgICAgICAgbGV0IGxhYmVsPWZpZWxkTmFtZVxyXG4gICAgICAgIGxhYmVsPWxhYmVsLnJlcGxhY2UoL18vZywgXCIgXCIpO1xyXG4gICAgICAgIGxhYmVsPWxhYmVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbGFiZWwuc2xpY2UoMSlcclxuICAgICAgICBsZXQgZmllbGQ9e25hbWU6ZmllbGROYW1lLGxhYmVsLGRlZmF1bHQ6d2lkZ2V0LnZhbHVlfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgaWYgKHdpZGdldC5vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5taW49d2lkZ2V0Lm9wdGlvbnMubWluXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5tYXg9d2lkZ2V0Lm9wdGlvbnMubWF4XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5zdGVwPXdpZGdldC5vcHRpb25zLnJvdW5kICAgICAgIFxyXG4gICAgICAgICAgICAgICAvLyBmaWVsZC5kZWZhdWx0PWZpZWxkLm1pbiAgICAgICAgIFxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJjdXN0b210ZXh0XCIpIHtcclxuICAgICAgICAgICAgZmllbGQudHlwZT1cInRleHRhcmVhXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGU9PT1cInRleHRcIikge1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlPVwidGV4dFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJjb21ib1wiKSB7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGU9XCJwcmVfZmlsbGVkX2Ryb3Bkb3duXCJcclxuICAgICAgICAgICAgZmllbGQud2lkZ2V0X25hbWU9ZmllbGROYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlPT09XCJ0b2dnbGVcIikge1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAvLyAgIGZpZWxkLmRlZmF1bHQ9XCJmYWxzZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZmllbGQudHlwZSkgcmV0dXJuXHJcbiAgICBcclxuICAgICAgICBpZiAoISRtZXRhZGF0YS5mb3JtcykgJG1ldGFkYXRhLmZvcm1zPXt9XHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdCkgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQ9e31cclxuICAgICAgICBpZiAoISRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzKSAkbWV0YWRhdGEuZm9ybXMuZGVmYXVsdC5lbGVtZW50cz1bXVxyXG4gICAgICAgIGxldCBmb3JtRmllbGRzPSRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzXHJcbiAgICAgICAgZm9ybUZpZWxkcy5wdXNoKGZpZWxkKVxyXG4gICAgICAgIG1hcHBpbmdzLnB1c2goeyBmcm9tRmllbGQ6ZmllbGROYW1lLHRvRmllbGQ6ZmllbGROYW1lICB9KVxyXG4gICAgICAgIG1hcHBpbmdzPW1hcHBpbmdzXHJcbiAgICAgICAgJG1ldGFkYXRhLm1hcHBpbmdzW25vZGVJZF0gPSBtYXBwaW5nc1xyXG4gICAgICAgIGZyb21GaWVsZD10b0ZpZWxkPWFkZEZpZWxkPVwiXCJcclxuICAgICAgLy8gXHJcbiAgICB9ICAgXHJcbiAgICBmdW5jdGlvbiBnZXRXaWRnZXQoZmllbGROYW1lKSB7XHJcbiAgICAgICAgaWYgKCF3aWRnZXRzKSByZXR1cm5cclxuICAgICAgICBmb3IobGV0IGk9MDtpPHdpZGdldHMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgd2lkZ2V0PXdpZGdldHNbaV1cclxuICAgICAgICAgICAgaWYgKHdpZGdldC5uYW1lPT09ZmllbGROYW1lKSByZXR1cm4gd2lkZ2V0XHJcbiAgICAgICAgfSAgICBcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZU1hcHBpbmcoaW5kZXgpIHtcclxuICAgICAgICBtYXBwaW5ncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIG1hcHBpbmdzPW1hcHBpbmdzXHJcbiAgICAgICAgJG1ldGFkYXRhLm1hcHBpbmdzW25vZGVJZF0gPSBtYXBwaW5nc1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2hlY2tJZkZpZWxkTmFtZUV4aXN0cyhuYW1lKSB7XHJcbiAgICAgICAgaWYgKCEkbWV0YWRhdGEuZm9ybXMpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmICghJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGxldCBmb3JtRmllbGRzPSRtZXRhZGF0YS5mb3Jtcy5kZWZhdWx0LmVsZW1lbnRzXHJcbiAgICAgICAgaWYgKCFmb3JtRmllbGRzKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGZvcm1GaWVsZHMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgZmllbGQ9Zm9ybUZpZWxkc1tpXVxyXG4gICAgICAgICAgICBpZiAoZmllbGQubmFtZT09PW5hbWUpIHJldHVybiB0cnVlICAgICAgICAgICAgXHJcbiAgICAgICAgfSAgICAgICBcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGFkZEFsbEZvcm1GaWVsZHMoKSB7XHJcbiAgICAgICAgaWYgKCF3aWRnZXRzKSByZXR1cm5cclxuICAgICAgICBmb3IobGV0IGk9MDtpPHdpZGdldHMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICBsZXQgd2lkZ2V0PXdpZGdldHNbaV1cclxuICAgICAgICAgICAgYWRkRm9ybUZpZWxkKHdpZGdldC5uYW1lKVxyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgZGlzcGF0Y2goXCJ1cGRhdGVGb3JtXCIse30pXHJcbiAgICB9XHJcbjwvc2NyaXB0PlxyXG57I2lmIHJlbmRlcn1cclxuPGRpdiBpZD1cImd5cmVfbWFwcGluZ3NcIiBzdHlsZT1cImRpc3BsYXk6e3Nob3dHeXJlTWFwcGluZ3N9O2xlZnQ6e2d5cmVNYXBwaW5nc0RpYWxvZ0xlZnR9O3RvcDp7Z3lyZU1hcHBpbmdzRGlhbG9nVG9wfVwiID5cclxuICAgIDxoMT5GaWVsZCBNYXBwaW5nczwvaDE+XHJcbiAgICAgICAgPGRpdj57bm9kZVR5cGV9PC9kaXY+XHJcblxyXG4gICAgICAgIDxzZWxlY3QgIGJpbmQ6dmFsdWU9e2Zyb21GaWVsZH0+XHJcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiRm9ybSBmaWVsZHNcIj5cclxuICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5maWVsZHMgYXMgZmllbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17ZmllbGQubmFtZX0+e2ZpZWxkLm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIkRlZmF1bHRzXCI+XHJcbiAgICAgICAgICAgICAgICB7I2VhY2ggbWFwcGluZ0ZpZWxkcy5kZWZhdWx0RmllbGRzIGFzIGZpZWxkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2ZpZWxkLm5hbWV9PntmaWVsZC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICA8L29wdGdyb3VwPiAgICAgXHJcbiAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIk91dHB1dHNcIj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCBtYXBwaW5nRmllbGRzLm91dHB1dEZpZWxkcyBhcyBmaWVsZH1cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtmaWVsZC5uYW1lfT57ZmllbGQubmFtZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgPC9vcHRncm91cD4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDxJY29uIG5hbWU9XCJhcnJvd1JpZ2h0XCI+PC9JY29uPlxyXG4gICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17dG9GaWVsZH0gPlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0Li4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsjZWFjaCB3aWRnZXRzIGFzIHdpZGdldH1cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e3dpZGdldC5uYW1lfT57d2lkZ2V0Lm5hbWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4ge2FkZE1hcHBpbmcoKX19PisgQWRkPC9idXR0b24+ICBcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4ge2FkZEZvcm1GaWVsZChhZGRGaWVsZCk7ZGlzcGF0Y2goXCJ1cGRhdGVGb3JtXCIse30pfX0+QWRkIGZvcm0gZmllbGQgZnJvbTwvYnV0dG9uPiAgICAgXHJcbiAgICAgICAgICAgIDxzZWxlY3QgYmluZDp2YWx1ZT17YWRkRmllbGR9ID5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIHsjZWFjaCB3aWRnZXRzIGFzIHdpZGdldH1cclxuICAgICAgICAgICAgICAgICAgICB7I2lmICFjaGVja0lmRmllbGROYW1lRXhpc3RzKHdpZGdldC5uYW1lKX1cclxuICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt3aWRnZXQubmFtZX0+e3dpZGdldC5uYW1lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7YWRkQWxsRm9ybUZpZWxkcygpfX0+QWRkICBhbGwgZmllbGRzIHRvIGZvcm08L2J1dHRvbj4gICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICB7I2VhY2ggbWFwcGluZ3MgYXMgbWFwcGluZywgaW5kZXh9XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYXBwaW5nXCI+XHJcbiAgICAgICAgICAgICAgICB7bWFwcGluZy5mcm9tRmllbGR9IDxJY29uIG5hbWU9XCJhcnJvd1JpZ2h0XCI+PC9JY29uPnttYXBwaW5nLnRvRmllbGR9XHJcbiAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRlbFwiIG9uOmNsaWNrPXsoZSkgPT4ge2RlbGV0ZU1hcHBpbmcoaW5kZXgpfX0+PEljb24gbmFtZT1cInJlbW92ZUZyb21MaXN0XCI+PC9JY29uPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7L2VhY2h9XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbG9zZVwiPjxJY29uIG5hbWU9XCJjbG9zZVwiIG9uOmNsaWNrPXsoZSk9PntjbG9zZURpYWxvZygpfX0+PC9JY29uPjwvZGl2PlxyXG48L2Rpdj5cclxuey9pZn1cclxuPHN0eWxlPlxyXG5cclxuXHJcbiNneXJlX21hcHBpbmdzIC5tYXBwaW5nIHtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xyXG4gICAgbWFyZ2luLXRvcDoxMHB4O1xyXG4gICAgcGFkZGluZzo1cHg7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3MgLm1hcHBpbmcgLmRlbCB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDoxMHB4O1xyXG4gICAgdG9wOiAycHg7XHJcbn1cclxuXHJcblxyXG5cclxuI2d5cmVfbWFwcGluZ3MgYnV0dG9uIHtcclxuICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICBtaW4td2lkdGg6IDcwcHg7XHJcbiAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMjcsIDIwNiwgMTE2KTtcclxuICAgICAgICBib3JkZXItY29sb3I6IHJnYigxMjgsIDEyOCwgMTI4KTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxuICAgIH1cclxuI2d5cmVfbWFwcGluZ3Mge1xyXG4gICAgei1pbmRleDogMjAwO1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgbGVmdDogMTBweDtcclxuICAgIHRvcDogMTBweDtcclxuICAgIGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBVYnVudHUsIENhbnRhcmVsbCwgXCJOb3RvIFNhbnNcIiwgc2Fucy1zZXJpZiwgXCJTZWdvZSBVSVwiLCBIZWx2ZXRpY2EsIEFyaWFsO1xyXG4gICAgcGFkZGluZzogMjBweDtcclxuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigyMHB4KSBicmlnaHRuZXNzKDgwJSk7XHJcbiAgICBib3gtc2hhZG93OiAwIDAgMXJlbSAwIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIHdpZHRoOiA1NDBweDtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxufVxyXG4jZ3lyZV9tYXBwaW5ncyB7XHJcbiAgICBkaXNwbGF5Om5vbmU7XHJcbiAgICB3aWR0aDo0ODBweDtcclxuICAgIGxlZnQ6MjAwcHg7XHJcbiAgICB0b3A6MjAwcHg7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3Mgc2VsZWN0IHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXI6IG5vbmU7XHJcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xyXG4gICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFVidW50dSwgQ2FudGFyZWxsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIlNlZ29lIFVJXCIsIEhlbHZldGljYSwgQXJpYWw7XHJcbiAgICBwYWRkaW5nOiAzcHg7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3Mgc2VsZWN0IHtcclxuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3Mgc2VsZWN0IG9wdGlvbiwjZ3lyZV9tYXBwaW5ncyBzZWxlY3Qgb3B0Z3JvdXAge1xyXG4gICAgYmFja2dyb3VuZDogYmxhY2s7XHJcbn1cclxuI2d5cmVfbWFwcGluZ3MgaDEge1xyXG4gICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgbWFyZ2luLXRvcDogNXB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMzBweDtcclxufVxyXG4jZ3lyZV9tYXBwaW5ncyAuY2xvc2Uge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6IDIwcHg7XHJcbiAgICB0b3A6MjBweDtcclxufVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFvT0EsNEJBQWMsQ0FBQyxzQkFBUyxDQUNwQixNQUFNLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQ3ZCLFdBQVcsSUFBSSxDQUNmLFFBQVEsR0FBRyxDQUNYLFFBQVEsQ0FBRSxRQUNkLENBQ0EsNEJBQWMsQ0FBQyxRQUFRLENBQUMsa0JBQUssQ0FDekIsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsTUFBTSxJQUFJLENBQ1YsR0FBRyxDQUFFLEdBQ1QsQ0FJQSw0QkFBYyxDQUFDLG9CQUFPLENBQ2xCLFdBQVcsQ0FBRSxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQy9ILFNBQVMsQ0FBRSxJQUFJLENBQ2YsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsS0FBSyxDQUNaLGdCQUFnQixDQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLFlBQVksQ0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNoQyxhQUFhLENBQUUsR0FBRyxDQUNsQixNQUFNLENBQUUsT0FBTyxDQUNmLFlBQVksQ0FBRSxJQUNsQixDQUNKLDBDQUFlLENBQ1gsT0FBTyxDQUFFLEdBQUcsQ0FDWixRQUFRLENBQUUsS0FBSyxDQUNmLElBQUksQ0FBRSxJQUFJLENBQ1YsR0FBRyxDQUFFLElBQUksQ0FDVCxXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUNuSSxPQUFPLENBQUUsSUFBSSxDQUNiLGVBQWUsQ0FBRSxLQUFLLElBQUksQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQzNDLFVBQVUsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDL0MsS0FBSyxDQUFFLEtBQUssQ0FDWixLQUFLLENBQUUsS0FBSyxDQUNaLE9BQU8sQ0FBRSxLQUFLLENBQ2QsYUFBYSxDQUFFLElBQUksQ0FDbkIsU0FBUyxDQUFFLElBQ2YsQ0FDQSwwQ0FBZSxDQUNYLFFBQVEsSUFBSSxDQUNaLE1BQU0sS0FBSyxDQUNYLEtBQUssS0FBSyxDQUNWLElBQUksS0FDUixDQUNBLDRCQUFjLENBQUMsb0JBQU8sQ0FDbEIsZ0JBQWdCLENBQUUsSUFBSSxDQUN0QixTQUFTLENBQUUsSUFBSSxDQUNmLEtBQUssQ0FBRSxLQUFLLENBQ1osTUFBTSxDQUFFLElBQUksQ0FDWixVQUFVLENBQUUsSUFBSSxDQUNoQixXQUFXLENBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUNuSSxPQUFPLENBQUUsR0FDYixDQUNBLDRCQUFjLENBQUMsb0JBQU8sQ0FDbEIsVUFBVSxDQUFFLFdBQVcsQ0FDdkIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUN2QixhQUFhLENBQUUsR0FDbkIsQ0FDQSw0QkFBYyxDQUFDLE1BQU0sQ0FBQyxvQkFBTSxDQUFDLDRCQUFjLENBQUMsTUFBTSxDQUFDLHNCQUFTLENBQ3hELFVBQVUsQ0FBRSxLQUNoQixDQUNBLDRCQUFjLENBQUMsZ0JBQUcsQ0FDZCxTQUFTLENBQUUsSUFBSSxDQUNmLFVBQVUsQ0FBRSxHQUFHLENBQ2YsYUFBYSxDQUFFLElBQ25CLENBQ0EsNEJBQWMsQ0FBQyxvQkFBTyxDQUNsQixRQUFRLENBQUUsUUFBUSxDQUNsQixLQUFLLENBQUUsSUFBSSxDQUNYLElBQUksSUFDUiJ9 */");
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

    function get_each_context_5$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    // (169:0) {#if render}
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
    		each_blocks_5[i] = create_each_block_5$1(get_each_context_5$1(ctx, each_value_5, i));
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
    			add_location(h1, file$1, 170, 4, 5959);
    			add_location(div0, file$1, 171, 8, 5992);
    			option0.__value = "";
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-mlofvx");
    			add_location(option0, file$1, 174, 12, 6071);
    			attr_dev(optgroup0, "label", "Form fields");
    			attr_dev(optgroup0, "class", "svelte-mlofvx");
    			add_location(optgroup0, file$1, 175, 12, 6120);
    			attr_dev(optgroup1, "label", "Defaults");
    			attr_dev(optgroup1, "class", "svelte-mlofvx");
    			add_location(optgroup1, file$1, 180, 9, 6334);
    			attr_dev(optgroup2, "label", "Outputs");
    			attr_dev(optgroup2, "class", "svelte-mlofvx");
    			add_location(optgroup2, file$1, 185, 12, 6562);
    			attr_dev(select0, "class", "svelte-mlofvx");
    			if (/*fromField*/ ctx[8] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[18].call(select0));
    			add_location(select0, file$1, 173, 8, 6025);
    			option1.__value = "";
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-mlofvx");
    			add_location(option1, file$1, 193, 12, 6903);
    			attr_dev(select1, "class", "svelte-mlofvx");
    			if (/*toField*/ ctx[9] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[19].call(select1));
    			add_location(select1, file$1, 192, 8, 6859);
    			attr_dev(button0, "class", "svelte-mlofvx");
    			add_location(button0, file$1, 198, 8, 7095);
    			attr_dev(button1, "class", "svelte-mlofvx");
    			add_location(button1, file$1, 200, 12, 7181);
    			option2.__value = "";
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-mlofvx");
    			add_location(option2, file$1, 202, 16, 7354);
    			attr_dev(select2, "class", "svelte-mlofvx");
    			if (/*addField*/ ctx[10] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[22].call(select2));
    			add_location(select2, file$1, 201, 12, 7305);
    			add_location(div1, file$1, 199, 8, 7162);
    			attr_dev(button2, "class", "svelte-mlofvx");
    			add_location(button2, file$1, 211, 12, 7691);
    			add_location(div2, file$1, 210, 8, 7672);
    			attr_dev(div3, "class", "close svelte-mlofvx");
    			add_location(div3, file$1, 222, 8, 8198);
    			attr_dev(div4, "id", "gyre_mappings");
    			set_style(div4, "display", /*showGyreMappings*/ ctx[1]);
    			set_style(div4, "left", /*gyreMappingsDialogLeft*/ ctx[2]);
    			set_style(div4, "top", /*gyreMappingsDialogTop*/ ctx[3]);
    			attr_dev(div4, "class", "svelte-mlofvx");
    			add_location(div4, file$1, 169, 0, 5835);
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
    					const child_ctx = get_each_context_5$1(ctx, each_value_5, i);

    					if (each_blocks_5[i]) {
    						each_blocks_5[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_5[i] = create_each_block_5$1(child_ctx);
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
    		source: "(169:0) {#if render}",
    		ctx
    	});

    	return block;
    }

    // (177:14) {#each mappingFields.fields as field}
    function create_each_block_5$1(ctx) {
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
    			add_location(option, file$1, 177, 20, 6225);
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
    		id: create_each_block_5$1.name,
    		type: "each",
    		source: "(177:14) {#each mappingFields.fields as field}",
    		ctx
    	});

    	return block;
    }

    // (182:16) {#each mappingFields.defaultFields as field}
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
    			add_location(option, file$1, 182, 20, 6445);
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
    		source: "(182:16) {#each mappingFields.defaultFields as field}",
    		ctx
    	});

    	return block;
    }

    // (187:16) {#each mappingFields.outputFields as field}
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
    			add_location(option, file$1, 187, 20, 6671);
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
    		source: "(187:16) {#each mappingFields.outputFields as field}",
    		ctx
    	});

    	return block;
    }

    // (195:12) {#each widgets as widget}
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
    			add_location(option, file$1, 195, 16, 6995);
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
    		source: "(195:12) {#each widgets as widget}",
    		ctx
    	});

    	return block;
    }

    // (205:20) {#if !checkIfFieldNameExists(widget.name)}
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
    			add_location(option, file$1, 205, 23, 7521);
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
    		source: "(205:20) {#if !checkIfFieldNameExists(widget.name)}",
    		ctx
    	});

    	return block;
    }

    // (204:16) {#each widgets as widget}
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
    		source: "(204:16) {#each widgets as widget}",
    		ctx
    	});

    	return block;
    }

    // (215:8) {#each mappings as mapping, index}
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

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[24](/*index*/ ctx[36], ...args);
    	}

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
    			add_location(div0, file$1, 218, 16, 8050);
    			attr_dev(div1, "class", "mapping svelte-mlofvx");
    			add_location(div1, file$1, 215, 12, 7851);
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
    				dispose = listen_dev(div0, "click", click_handler_3, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
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
    		source: "(215:8) {#each mappings as mapping, index}",
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
    		let x = e.clientX - 480 / 2;
    		let y = e.clientY - 200;
    		if (x < 0) x = 0;
    		if (y < 0) y = 0;
    		if (x + 480 > window.innerWidth) x = window.innerWidth - 540;
    		if (y + 400 > window.innerHeight) y = window.innerHeight - 400;
    		$$invalidate(2, gyreMappingsDialogLeft = x + "px");
    		$$invalidate(3, gyreMappingsDialogTop = y + "px");
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

    	const click_handler_3 = (index, e) => {
    		deleteMapping(index);
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
    	append_styles(target, "svelte-1ac5lll", "@import 'dist/build/gyrestyles.css';\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSIsInNvdXJjZXMiOlsiV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gICAgaW1wb3J0IEZvcm1CdWlsZGVyIGZyb20gXCIuL0Zvcm1CdWlsZGVyLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQgUnVsZUVkaXRvciBmcm9tIFwiLi9SdWxlRWRpdG9yLnN2ZWx0ZVwiXHJcbiAgICBpbXBvcnQgTWFwcGluZ3MgZnJvbSBcIi4vTWFwcGluZ3Muc3ZlbHRlXCJcclxuXHJcbiAgICBpbXBvcnQge3dyaXRhYmxlfSBmcm9tICdzdmVsdGUvc3RvcmUnXHJcbiAgICBpbXBvcnQge29uTW91bnR9IGZyb20gJ3N2ZWx0ZSdcclxuICAgIGltcG9ydCB7bWV0YWRhdGF9IGZyb20gJy4vc3RvcmVzL21ldGFkYXRhJ1xyXG4gICAgaW1wb3J0IEljb24gZnJvbSAnLi9JY29uLnN2ZWx0ZSdcclxuICAgIGltcG9ydCB7IENvbWZ5VUlQcmVwYXJzZXIgfSBmcm9tICcuL0NvbWZ5VUlQcmVwYXJzZXIuanMnXHJcbiAgaW1wb3J0IHsgY29tcG9uZW50X3N1YnNjcmliZSB9IGZyb20gXCJzdmVsdGUvaW50ZXJuYWxcIjtcclxuXHJcbiAgICBsZXQgYWxsd29ya2Zsb3dzO1xyXG4gICAgbGV0IG1vdmluZyA9IGZhbHNlO1xyXG4gICAgbGV0IGxlZnQgPSAxMFxyXG4gICAgbGV0IHRvcCA9IDEwXHJcbiAgICBsZXQgc3R5bGVlbDtcclxuICAgIGxldCBsb2FkZWR3b3JrZmxvdztcclxuXHJcbiAgICBsZXQgZm9sZE91dCA9IGZhbHNlXHJcbiAgICBsZXQgbmFtZSA9IFwiXCIgICAvLyBjdXJyZW50IGxvYWRlZCB3b3JrZmxvdyBuYW1lXHJcbiAgICBsZXQgc3RhdGUgPSBcImxpc3RcIlxyXG4gICAgbGV0IHRhZ3MgPSBbXCJUeHQySW1hZ2VcIiwgXCJJbnBhaW50aW5nXCIsIFwiQ29udHJvbE5ldFwiLCBcIkxheWVyTWVudVwiLCBcIkRlYWN0aXZhdGVkXCJdXHJcbiAgICBsZXQgd29ya2Zsb3dMaXN0ID0gd3JpdGFibGUoW10pICAgIC8vIHRvZG86bG9hZCBhbGwgd29ya2Zsb3cgYmFzaWMgZGF0YSAobmFtZSwgbGFzdCBjaGFuZ2VkIGFuZCBneXJlIG9iamVjdCkgZnJvbSBzZXJ2ZXIgdmlhIHNlcnZlciByZXF1ZXN0XHJcbiAgICBsZXQgd29ya2Zsb3dhcGlMaXN0PSB3cml0YWJsZShbXSk7XHJcbiAgICBsZXQgYWN0aXZhdGVkVGFncyA9IHt9XHJcbiAgICBsZXQgc2VsZWN0ZWRUYWcgPSBcIlwiXHJcbiAgICBsZXQgb3JnaW5hbG5hbWU7XHJcbiAgICBsZXQgZHVwbGljYXRlID0gZmFsc2U7XHJcbiAgICBsZXQgZGVidWc9ZmFsc2VcclxuICAgIGZ1bmN0aW9uIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIG1vdmluZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xyXG4gICAgICAgIGlmIChtb3ZpbmcpIHtcclxuICAgICAgICAgICAgbGVmdCArPSBlLm1vdmVtZW50WDtcclxuICAgICAgICAgICAgdG9wICs9IGUubW92ZW1lbnRZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbk1vdW50KGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCBsb2FkTGlzdCgpO1xyXG4gICAgICAgIGF3YWl0IGxvYWRMb2dMaXN0KCk7XHJcbiAgICAgICAgYWRkRXh0ZXJuYWxMb2FkTGlzdGVuZXIoKTtcclxuICAgICAgICBsZXQgbGFzdGxvYWRlZHdvcmtmbG93bmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibGFzdGd5cmV3b3JrZmxvd2xvYWRlZFwiKTtcclxuICAgICAgICBpZihsYXN0bG9hZGVkd29ya2Zsb3duYW1lKSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gJHdvcmtmbG93TGlzdC5maW5kKChlbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLm5hbWUgPT0gbGFzdGxvYWRlZHdvcmtmbG93bmFtZTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGxvYWRXb3JrZmxvdyhjdXJyZW50KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRFeHRlcm5hbExvYWRMaXN0ZW5lcigpIHtcclxuICAgICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbWZ5LWZpbGUtaW5wdXRcIik7XHJcbiAgICAgICAgY29uc3QgZmlsZUlucHV0TGlzdGVuZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlSW5wdXQgJiYgZmlsZUlucHV0LmZpbGVzICYmIGZpbGVJbnB1dC5maWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlSW5wdXQsIGZpbGVJbnB1dC5maWxlcyk7XHJcbiAgICAgICAgICAgICAgICBuZXcgRGF0ZShmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkKS50b0RhdGVTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgbGV0IGZpeGVkZmlsZW5hbWUgPSBnZXRBdmFsYWJsZUZpbGVOYW1lKGZpbGVJbnB1dC5maWxlc1swXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGxldCBncmFwaCA9IHdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5uYW1lID0gZml4ZWRmaWxlbmFtZTtcclxuICAgICAgICAgICAgICAgIGdyYXBoLmxhc3RNb2RpZmllZCA9IGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWRcclxuICAgICAgICAgICAgICAgIGlmICghZ3JhcGguZXh0cmE/LndvcmtzcGFjZV9pbmZvKSBncmFwaC5leHRyYS53b3Jrc3BhY2VfaW5mbyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEud29ya3NwYWNlX2luZm8ubmFtZSA9IGZpeGVkZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5leHRyYS53b3Jrc3BhY2VfaW5mby5sYXN0TW9kaWZpZWQgPSBmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGguZXh0cmEud29ya3NwYWNlX2luZm8ubGFzdE1vZGlmaWVkUmVhZGFibGUgPSBuZXcgRGF0ZShmaWxlSW5wdXQuZmlsZXNbMF0ubGFzdE1vZGlmaWVkKS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWdyYXBoLmV4dHJhLmd5cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFwaC5leHRyYS5neXJlID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBncmFwaC5leHRyYS5neXJlLmxhc3RNb2RpZmllZCA9IGZpbGVJbnB1dC5maWxlc1swXS5sYXN0TW9kaWZpZWQ7XHJcbiAgICAgICAgICAgICAgICBncmFwaC5leHRyYS5neXJlLmxhc3RNb2RpZmllZFJlYWRhYmxlID0gbmV3IERhdGUoZmlsZUlucHV0LmZpbGVzWzBdLmxhc3RNb2RpZmllZCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGxvYWRlZHdvcmtmbG93ID0gZ3JhcGg7XHJcbiAgICAgICAgICAgICAgICBsb2FkV29ya2Zsb3coZ3JhcGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBmaWxlSW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZmlsZUlucHV0TGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZ2V0QXZhbGFibGVGaWxlTmFtZShuYW1lKSB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gJ25ldyc7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgbGV0IGluZCA9IDE7XHJcbiAgICAgICAgbGV0IGdvb2RuYW1lID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGV4dCA9IG5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcclxuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9cXC5bXi8uXSskLywgXCJcIik7XHJcbiAgICAgICAgbGV0IG5ld25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHdoaWxlICghZ29vZG5hbWUpIHtcclxuICAgICAgICAgICAgbGV0IGFsbGN1cnJuYW1lcyA9IGFsbHdvcmtmbG93cy5tYXAoKGVsKSA9PiBlbC5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKGFsbGN1cnJuYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgbmV3bmFtZSA9IGAke25hbWV9KCR7aW5kfSlgO1xyXG4gICAgICAgICAgICAgICAgaW5kID0gaW5kICsgMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGdvb2RuYW1lID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYCR7bmV3bmFtZX1gO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlVXAoKSB7XHJcbiAgICAgICAgbW92aW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGlzVmlzaWJsZSh3b3JrZmxvdykge1xyXG4gICAgICAgIGxldCBteXRhZ3MgPSB3b3JrZmxvdz8uZ3lyZT8udGFncyB8fCBbXTtcclxuICAgICAgICBmb3IgKGxldCBhY3RpdmVUYWcgaW4gYWN0aXZhdGVkVGFncykge1xyXG4gICAgICAgICAgICBpZiAoYWN0aXZhdGVkVGFnc1thY3RpdmVUYWddICYmICFteXRhZ3MuaW5jbHVkZXMoYWN0aXZlVGFnKSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRMb2dMaXN0KCkge1xyXG4gICAgICAgIC8vIHRvZG86IG1ha2Ugc2VydmVyIHJlcXVlc3QgYW5kIHJlYWQgJG1ldGFkYXRhIG9mIGFsbCBleGlzdGluZyB3b3JrZmxvd3Mgb24gZmlsZXN5c3RlbVxyXG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBzY2FuTG9jYWxOZXdGaWxlcygnbG9ncycpO1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zb3J0KChhLGIpID0+IGIubmFtZS5yZXBsYWNlKC9bXjAtOV0vZyxcIlwiKSAtIGEubmFtZS5yZXBsYWNlKC9bXjAtOV0vZyxcIlwiKSk7XHJcbiAgICAgICAgd29ya2Zsb3dhcGlMaXN0LnNldChyZXN1bHQpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRMaXN0KCkge1xyXG4gICAgICAgIC8vIHRvZG86IG1ha2Ugc2VydmVyIHJlcXVlc3QgYW5kIHJlYWQgJG1ldGFkYXRhIG9mIGFsbCBleGlzdGluZyB3b3JrZmxvd3Mgb24gZmlsZXN5c3RlbVxyXG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBzY2FuTG9jYWxOZXdGaWxlcygpXHJcbiAgICAgICAgbGV0IGRhdGFfd29ya2Zsb3dfbGlzdCA9IHJlc3VsdC5tYXAoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSB7bmFtZTogZWwubmFtZX1cclxuICAgICAgICAgICAgbGV0IGd5cmUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoZWwuanNvbikgZ3lyZSA9IEpTT04ucGFyc2UoZWwuanNvbikuZXh0cmEuZ3lyZTtcclxuICAgICAgICAgICAgcmVzLmxhc3RNb2RpZmllZFJlYWRhYmxlID0gSlNPTi5wYXJzZShlbC5qc29uKS5leHRyYS5neXJlPy5sYXN0TW9kaWZpZWRSZWFkYWJsZSB8fCBcIlwiO1xyXG4gICAgICAgICAgICBpZiAoZ3lyZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLmd5cmUgPSBneXJlO1xyXG4gICAgICAgICAgICAgICAgcmVzLmd5cmUubGFzdE1vZGlmaWVkUmVhZGFibGUgPSBKU09OLnBhcnNlKGVsLmpzb24pLmV4dHJhLmd5cmU/Lmxhc3RNb2RpZmllZFJlYWRhYmxlIHx8IFwiXCI7XHJcbiAgICAgICAgICAgICAgICByZXMuZ3lyZS5sYXN0TW9kaWZpZWQgPSBKU09OLnBhcnNlKGVsLmpzb24pLmV4dHJhLmd5cmU/Lmxhc3RNb2RpZmllZCB8fCBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYoIXJlcy5neXJlLndvcmtmbG93aWQpIHJlcy5neXJlLndvcmtmbG93aWQgPSAgKE1hdGgucmFuZG9tKCkgKyAxKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGFfd29ya2Zsb3dfbGlzdCk7XHJcbiAgICAgICAgd29ya2Zsb3dMaXN0LnNldChkYXRhX3dvcmtmbG93X2xpc3QpXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBzY2FuTG9jYWxOZXdGaWxlcyh0eXBlKSB7XHJcbiAgICAgICAgbGV0IGV4aXN0Rmxvd0lkcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvd29ya3NwYWNlL3JlYWR3b3JrZmxvd2RpclwiLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0Rmxvd0lkcyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGUhPSdsb2dzJykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZml4RGF0ZXNGcm9tU2VydmVyKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICBhbGx3b3JrZmxvd3MgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc2NhbiBsb2NhbCBuZXcgZmlsZXM6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZml4RGF0ZXNGcm9tU2VydmVyKHJlc3VsdCkge1xyXG4gICAgICAgIGxldCBuZXdlbCA9IHJlc3VsdC5tYXAoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBvYmpqcyA9IEpTT04ucGFyc2UoZWwuanNvbik7XHJcbiAgICAgICAgICAgIG9iampzLmV4dHJhLmd5cmUubGFzdE1vZGlmaWVkID0gbmV3IERhdGUoZWwubGFzdG1vZGlmaWVkICogMTAwMCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBsZXQgZGF0ZXN0ciA9IG5ldyBEYXRlKGVsLmxhc3Rtb2RpZmllZCAqIDEwMDApLnRvSVNPU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIG9iampzLmV4dHJhLmd5cmUubGFzdE1vZGlmaWVkUmVhZGFibGUgPSBkYXRlc3RyLnNwbGl0KCdUJylbMF0gKyBcIiBcIiArIGRhdGVzdHIuc3BsaXQoJ1QnKVsxXS5yZXBsYWNlKC9cXC5bXi8uXSskLywgXCJcIik7XHJcbiAgICAgICAgICAgIGxldCBqc29uID0gSlNPTi5zdHJpbmdpZnkob2JqanMpO1xyXG4gICAgICAgICAgICByZXR1cm4gey4uLmVsLCBqc29ufVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIG5ld2VsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkV29ya2Zsb3cod29ya2Zsb3cpIHtcclxuICAgICAgICBhd2FpdCBsb2FkTGlzdCgpO1xyXG4gICAgICAgIC8vIHRvZG86Y2hlY2sgaWYgY3VycmVudCB3b3JrZmxvdyBpcyB1bnNhdmVkIGFuZCBtYWtlIGNvbmZpcm0gb3RoZXJ3aXNlXHJcbiAgICAgICAgLy8gMS4gbWFrZSBzZXJ2ZXIgcmVxdWVzdCBieSB3b3JrZmxvdy5uYW1lLCBnZXR0aW5nIGZ1bGwgd29ya2Zsb3cgZGF0YSBoZXJlXHJcbiAgICAgICAgLy8gMi4gdXBkYXRlIENvbWZ5VUkgd2l0aCBuZXcgd29ya2Zsb3dcclxuICAgICAgICAvLyAzLiBzZXQgbmFtZSBhbmQgJG1ldGFkYXRhIGhlcmVcclxuICAgICAgICBpZiAoIXdvcmtmbG93Lmd5cmUpIHtcclxuICAgICAgICAgICAgd29ya2Zsb3cuZ3lyZSA9IHt9O1xyXG4gICAgICAgICAgICB3b3JrZmxvdy5neXJlLnRhZ3MgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3JnaW5hbG5hbWUgPSB3b3JrZmxvdy5uYW1lO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9hZCB3b3JrZmxvdyEhXCIsb3JnaW5hbG5hbWUsd29ya2Zsb3cubmFtZSk7XHJcbiAgICAgICAgbmFtZSA9IHdvcmtmbG93Lm5hbWVcclxuICAgICAgICAkbWV0YWRhdGEgPSB3b3JrZmxvdy5neXJlICAgICAgICBcclxuICAgICAgICBpZiAoISRtZXRhZGF0YS50YWdzKSAkbWV0YWRhdGEudGFncz1bXVxyXG4gICAgICAgIGlmICh3aW5kb3cuYXBwLmdyYXBoID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImFwcC5ncmFwaCBpcyBudWxsIGNhbm5vdCBsb2FkIHdvcmtmbG93XCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuZ3lyZUNsZWFyQWxsQ29tYm9WYWx1ZXMpIHdpbmRvdy5neXJlQ2xlYXJBbGxDb21ib1ZhbHVlcygpXHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBhbGx3b3JrZmxvd3MuZmluZCgoZWwpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsLm5hbWUgPT0gd29ya2Zsb3cubmFtZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChzdGF0ZT09XCJlcnJvcmxvZ3NcIil7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSAkd29ya2Zsb3dhcGlMaXN0LmZpbmQoKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubmFtZSA9PSB3b3JrZmxvdy5uYW1lO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB3aW5kb3cuYXBwLmxvYWRBcGlKc29uKEpTT04ucGFyc2UoY3VycmVudC5qc29uKSk7XHJcbiAgICAgICAgICAgIHN0YXRlPVwiZXJyb3Jsb2dzXCJcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdGd5cmV3b3JrZmxvd2xvYWRlZCcsd29ya2Zsb3cubmFtZSk7XHJcbiAgICAgICAgaWYgKCFsb2FkZWR3b3JrZmxvdykge1xyXG4gICAgICAgICAgICBpZiAoIWN1cnJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hcHAubG9hZEdyYXBoRGF0YSh3b3JrZmxvdyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd2YgPSBKU09OLnBhcnNlKGN1cnJlbnQuanNvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXdmLm5hbWUgJiYgbmFtZSkgd2YubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYXBwLmxvYWRHcmFwaERhdGEod2YpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgc3RhdGU9XCJwcm9wZXJ0aWVzXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uICB0ZXN0Rmlyc3RQYXNzKCkge1xyXG4gICAgICAgIGxldCB3b3JrZmxvdz13aW5kb3cuYXBwLmdyYXBoLnNlcmlhbGl6ZSgpXHJcbiAgICAgICAgd29ya2Zsb3c9SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh3b3JrZmxvdykpXHJcbiAgICAgICAgY29uc29sZS5sb2cod29ya2Zsb3cpXHJcbi8vICAgICAgICBsZXQgbG9vcD1uZXcgbG9vcFByZXBhcnNlcih3b3JrZmxvdylcclxuLy8gICAgICAgIGxvb3AuZ2VuZXJhdGVMb29wKFwiY29udHJvbG5ldFwiLDMpXHJcbi8vICAgICAgICBjb25zb2xlLmxvZyh3b3JrZmxvdylcclxuICAgICAgICBsZXQgcGFyc2VyPW5ldyBDb21meVVJUHJlcGFyc2VyKHdvcmtmbG93KVxyXG4gICAgICAgIGF3YWl0IHBhcnNlci5leGVjdXRlKHBhcnNlci5nZXRUZXN0RGF0YSgpKVxyXG4gICAgICAgIHdpbmRvdy5hcHAubG9hZEdyYXBoRGF0YSh3b3JrZmxvdyk7XHJcbiAgICAgICAgJG1ldGFkYXRhPXdvcmtmbG93LmV4dHJhLmd5cmVcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHNob3dTdHJ1Y3R1cmUoKSB7XHJcbiAgICAgICAgbGV0IHdvcmtmbG93PXdpbmRvdy5hcHAuZ3JhcGguc2VyaWFsaXplKClcclxuICAgICAgICBjb25zb2xlLmxvZyh3b3JrZmxvdylcclxuICAgIH1cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHNhdmVXb3JrZmxvdygpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVXb3JrZmxvd1wiKTtcclxuICAgICAgICB3aW5kb3cuYXBwLmdyYXBoLnNlcmlhbGl6ZV93aWRnZXRzPXRydWVcclxuICAgICAgICBsZXQgZ3JhcGggPSB3aW5kb3cuYXBwLmdyYXBoLnNlcmlhbGl6ZSgpXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxncmFwaC5ub2Rlcy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlPWdyYXBoLm5vZGVzW2ldXHJcbiAgICAgICAgICAgIGxldCBfbm9kZT13aW5kb3cuYXBwLmdyYXBoLl9ub2Rlc1tpXVxyXG4gICAgICAgICAgICBpZiAoISRtZXRhZGF0YS5ub2RlV2lkZ2V0cykgJG1ldGFkYXRhLm5vZGVXaWRnZXRzPXt9XHJcbiAgICAgICAgICAgICRtZXRhZGF0YS5ub2RlV2lkZ2V0c1tub2RlLmlkXT1fbm9kZS53aWRnZXRzXHJcbiAgICAgICAgIC8vICAgbm9kZS53aWRnZXRzPV9ub2RlLndpZGdldHNcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ3aW5kb3cuYXBwLmdyYXBoXCIsZ3JhcGgpXHJcbiAgICAgICAgLy8gdGhpcyBpcyBzY2VuYXJpbyBqdXN0IGFmdGVyIGxvYWRpbmcgd29ya2Zsb3cgYW5kIG5vdCBzYXZlIGl0XHJcbiAgICAgICAgaWYgKGxvYWRlZHdvcmtmbG93ICYmIGxvYWRlZHdvcmtmbG93LmV4dHJhLndvcmtzcGFjZV9pbmZvKSB7XHJcbiAgICAgICAgICAgIGdyYXBoLmV4dHJhID0gbG9hZGVkd29ya2Zsb3cuZXh0cmE7XHJcbiAgICAgICAgICAgICRtZXRhZGF0YSA9IGxvYWRlZHdvcmtmbG93LmV4dHJhLmd5cmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxvYWRlZHdvcmtmbG93ID0gbnVsbDtcclxuICAgICAgICBsZXQgZmlsZV9wYXRoID0gZ3JhcGguZXh0cmE/LndvcmtzcGFjZV9pbmZvPy5uYW1lIHx8IFwibmV3Lmpzb25cIjtcclxuICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICBmaWxlX3BhdGggPSBuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZSBmaWxlOiBcIixmaWxlX3BhdGgsXCJuYW1lOiBcIixuYW1lLFwiZ3lyZW5hbWU6IFwiLGdyYXBoLmV4dHJhPy53b3Jrc3BhY2VfaW5mbz8ubmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghZmlsZV9wYXRoLmVuZHNXaXRoKCcuanNvbicpKSB7XHJcbiAgICAgICAgICAgIC8vIEFkZCAuanNvbiBleHRlbnNpb24gaWYgaXQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgICBmaWxlX3BhdGggKz0gJy5qc29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRtZXRhZGF0YSAmJiBncmFwaC5leHRyYSkgZ3JhcGguZXh0cmEuZ3lyZSA9ICRtZXRhZGF0YTtcclxuICAgICAgICBjb25zdCBncmFwaEpzb24gPSBKU09OLnN0cmluZ2lmeShncmFwaCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCIgIG9yZ2luYWwgbmFtZSBcIixvcmdpbmFsbmFtZSk7XHJcblxyXG4gICAgICAgIGlmKG9yZ2luYWxuYW1lICE9IG5hbWUgJiYgIWR1cGxpY2F0ZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlbmFtZSBmaWxlIG9yZ2luYWwgXCIsb3JnaW5hbG5hbWUsXCJuYW1lXCIsbmFtZSk7XHJcbiAgICAgICAgICAgIGxldCBuZXdfZmlsZV9wYXRoO1xyXG4gICAgICAgICAgICBpZiAob3JnaW5hbG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIG5ld19maWxlX3BhdGggPSBvcmdpbmFsbmFtZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghbmV3X2ZpbGVfcGF0aC5lbmRzV2l0aCgnLmpzb24nKSkge1xyXG4gICAgICAgICAgICAgICAgbmV3X2ZpbGVfcGF0aCArPSAnLmpzb24nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZUZpbGUobmV3X2ZpbGVfcGF0aCwgZ3JhcGhKc29uKTtcclxuICAgICAgICAgICAgYXdhaXQgcmVuYW1lRmlsZShuZXdfZmlsZV9wYXRoLGZpbGVfcGF0aClcclxuICAgICAgICAgICAgZHVwbGljYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG9yZ2luYWxuYW1lID0gbmFtZTtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgIGF3YWl0IHVwZGF0ZUZpbGUoZmlsZV9wYXRoLCBncmFwaEpzb24pO1xyXG4gICAgICAgICAgICBpZihkdXBsaWNhdGUpe1xyXG4gICAgICAgICAgICAgICAgb3JnaW5hbG5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgZHVwbGljYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRvZG86Z2V0IHdvcmtmbG93IGZvbSBjb21meVVJXHJcbiAgICAgICAgLy8gJG1ldGFkYXRhIHNob3VsZCBhbHJlYWR5IHBvaW50IHRvIGV4dHJhcy5neXJlIC0gc28gbm90aGluZyB0byBkbyBoZXJlXHJcbiAgICAgICAgLy8gMS4gbWFrZSBzZXJ2ZXIgcmVxdWVzdCwgd2l0aCAgbmFtZSBhbmQgZnVsbCB3b3JrZmxvdywgc3RvcmUgaXQgb24gZmlsZXN5c3RlbSB0aGVyZVxyXG4gICAgICAgIC8vIDIuIHNldCB1bnNhdmVkIHN0YXRlIHRvIGZhbHNlXHJcbiAgICAgICAgLy8gMy4gbG9hZCBsaXN0IG9mIGFsbCB3b3JrZmxvd3MgYWdhaW5cclxuICAgICAgLy8gIGFsZXJ0KFwic2F2ZSB3b3JrZmxvdyBcIiArIG5hbWUpIC8vIHJlbW92ZVxyXG5cclxuICAgICAgICBhd2FpdCBsb2FkTGlzdCgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHJlbmFtZUZpbGUoZmlsZV9wYXRoLCBuZXdfZmlsZV9wYXRoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi93b3Jrc3BhY2UvcmVuYW1lX3dvcmtmbG93ZmlsZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxlX3BhdGg6IGZpbGVfcGF0aCxcclxuICAgICAgICAgICAgICAgICAgICBuZXdfZmlsZV9wYXRoOiBuZXdfZmlsZV9wYXRoLFxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciByZW5hbWUgLmpzb24gZmlsZTogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciByZW5hbWUgd29ya3NwYWNlOlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUZpbGUoZmlsZV9wYXRoLCBqc29uRGF0YSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvd29ya3NwYWNlL3VwZGF0ZV9qc29uX2ZpbGVcIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZV9wYXRoOiBmaWxlX3BhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAganNvbl9zdHI6IGpzb25EYXRhLFxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBzYXZpbmcgd29ya2Zsb3cgLmpzb24gZmlsZTogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBzYXZpbmcgd29ya3NwYWNlOlwiLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUZpbGUoZmlsZV9wYXRoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi93b3Jrc3BhY2UvZGVsZXRlX3dvcmtmbG93X2ZpbGVcIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZV9wYXRoOiBmaWxlX3BhdGgsXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGRlbGV0ZSB3b3JrZmxvdyAuanNvbiBmaWxlOiBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNhdmluZyB3b3Jrc3BhY2U6XCIsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZFRhZygpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGVkVGFnKSByZXR1cm5cclxuICAgICAgICBpZiAoISRtZXRhZGF0YS50YWdzKSAkbWV0YWRhdGEudGFncyA9IFtdXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVGFnPT09XCJMYXllck1lbnVcIikge1xyXG4gICAgICAgICAgICByZW1vdmVUYWcoXCJDb250cm9sTmV0XCIpXHJcbiAgICAgICAgICAgIHJlbW92ZVRhZyhcIlR4dDJJbWFnZVwiKVxyXG4gICAgICAgICAgICByZW1vdmVUYWcoXCJJbnBhaW50aW5nXCIpXHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZiAoc2VsZWN0ZWRUYWc9PT1cIlR4dDJJbWFnZVwiIHx8IHNlbGVjdGVkVGFnPT09XCJJbnBhaW50aW5nXCIgfHwgc2VsZWN0ZWRUYWc9PT1cIkNvbnRyb2xOZXRcIikge1xyXG4gICAgICAgICAgICByZW1vdmVUYWcoXCJMYXllck1lbnVcIilcclxuICAgICAgICB9XHJcbiAgICAgICAgJG1ldGFkYXRhLnRhZ3MucHVzaChzZWxlY3RlZFRhZylcclxuICAgICAgICAkbWV0YWRhdGEgPSAkbWV0YWRhdGFcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVUYWcodGFnKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSAkbWV0YWRhdGEudGFncy5pbmRleE9mKHRhZylcclxuICAgICAgICBpZiAoaW5kZXg8MCkgcmV0dXJuXHJcbiAgICAgICAgJG1ldGFkYXRhLnRhZ3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAkbWV0YWRhdGEgPSAkbWV0YWRhdGFcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZVdvcmtmbG93KHdvcmtmbG93KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJkZWxldGUgd29ya2Zsb3dcIix3b3JrZmxvdyk7XHJcbiAgICAgICAgaWYgKGNvbmZpcm0oXCJEZWxldGUgV29ya2Zsb3c/XCIpID09IHRydWUpIHtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSB3b3JrZmxvdy5uYW1lO1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUuZW5kc1dpdGgoJy5qc29uJykpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgKz0gJy5qc29uJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWxldGVGaWxlKG5hbWUpO1xyXG4gICAgICAgICAgICAkd29ya2Zsb3dMaXN0PSR3b3JrZmxvd0xpc3RcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkdXBsaWNhdGVXb3JrZmxvdygpIHtcclxuICAgICAgICBuYW1lID0gJ0NvcHkgb2YgJytuYW1lO1xyXG4gICAgICAgICRtZXRhZGF0YS53b3JrZmxvd2lkID0gKE1hdGgucmFuZG9tKCkgKyAxKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgIGR1cGxpY2F0ZSA9IHRydWU7XHJcbiAgICAgICAgc2F2ZVdvcmtmbG93KCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxldCByZWZyZXNoPTBcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUZvcm0oKSB7XHJcbiAgICAgICAgaWYgKHN0YXRlIT09XCJlZGl0Rm9ybVwiKSByZXR1cm5cclxuICAgICAgICByZWZyZXNoKytcclxuXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWZyZXNoVGFncyhlKSB7XHJcbiAgICAgICAgJG1ldGFkYXRhLnRhZ3M9ZS5kZXRhaWxcclxuICAgIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48ZGl2IGlkPVwid29ya2Zsb3dNYW5hZ2VyXCIgY2xhc3M9XCJ3b3JrZmxvd01hbmFnZXJcIiBzdHlsZT1cImxlZnQ6IHtsZWZ0fXB4OyB0b3A6IHt0b3B9cHg7XCI+XHJcbiAgPGRpdiBjbGFzcz1cIm1pbmlNZW51XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb3ZlSWNvblwiPlxyXG4gICAgICAgICAgICAgICAgPEljb24gbmFtZT1cIm1vdmVcIiBvbjptb3VzZWRvd249e29uTW91c2VEb3dufT48L0ljb24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5cclxuXHJcbiAgICAgICAgICAgICAgICB7I2lmICFuYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJHeXJlXCIgY2xhc3M9XCJneXJlTG9nb1wiPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgb246Y2xpY2s9eyhlKSA9PiB7Zm9sZE91dD10cnVlfX0gc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9ja1wiPkd5cmU8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHs6ZWxzZX1cclxuICAgICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgb246Y2xpY2s9eyhlKSA9PiB7Zm9sZE91dD10cnVlfX0gc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9ja1wiPntuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2tcIiBjbGFzcz1cInNhdmVJY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJzYXZlXCIgb246Y2xpY2s9eyhlKSA9PiB7c2F2ZVdvcmtmbG93KCl9fSA+PC9JY29uPiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIHsjaWYgIWZvbGRPdXR9XHJcbiAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb2xkb3V0XCIgb246Y2xpY2s9eyhlKSA9PiB7Zm9sZE91dD10cnVlfX0+XHJcbiAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZG93blwiPjwvSWNvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB7L2lmfVxyXG4gICAgeyNpZiBmb2xkT3V0fVxyXG4gICAgeyNpZiBkZWJ1Z31cclxuIDxidXR0b24gb246Y2xpY2s9eyhlKSA9PiB7IHRlc3RGaXJzdFBhc3MoKX0gfT5UZXN0PC9idXR0b24+XHJcbiA8YnV0dG9uIG9uOmNsaWNrPXsoZSkgPT4geyBzaG93U3RydWN0dXJlKCl9IH0+V0YgSlNPTjwvYnV0dG9uPlxyXG57L2lmfVxyXG4gICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZvbGRvdXRcIiBvbjpjbGljaz17KGUpID0+IHtmb2xkT3V0PWZhbHNlfX0+XHJcbiAgICAgICAgICAgIDxJY29uIG5hbWU9XCJ1cFwiPjwvSWNvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWFpblwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0TWVudVwiPlxyXG4gICAgICAgICAgICB7I2tleSBzdGF0ZX1cclxuICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJsaXN0XCIge3N0YXRlfSBvbjpjbGljaz17IChlKSA9PiAge3N0YXRlPVwibGlzdFwiIH19ID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICB7I2lmICRtZXRhZGF0YSAmJiAkbWV0YWRhdGEubGFzdE1vZGlmaWVkfVxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJwcm9wZXJ0aWVzXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7c3RhdGU9XCJwcm9wZXJ0aWVzXCIgfX0gID48L0ljb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImVkaXRGb3JtXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7c3RhdGU9XCJlZGl0Rm9ybVwiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJlZGl0UnVsZXNcIiB7c3RhdGV9IG9uOmNsaWNrPXthc3luYyAoZSkgPT4gIHtzdGF0ZT1cImVkaXRSdWxlc1wiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJlcnJvcmxvZ3NcIiB7c3RhdGV9IG9uOmNsaWNrPXthc3luYyAoZSkgPT4gIHthd2FpdCBsb2FkTG9nTGlzdCgpOyBzdGF0ZT1cImVycm9ybG9nc1wiIH19ICA+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJwcm9wZXJ0aWVzXCIgZGVhY3RpdmF0ZT1cImRlYWN0aXZhdGVcIiAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZWRpdEZvcm1cIiAgIGRlYWN0aXZhdGU9XCJkZWFjdGl2YXRlXCIgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZWRpdFJ1bGVzXCIgICBkZWFjdGl2YXRlPVwiZGVhY3RpdmF0ZVwiPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwiZXJyb3Jsb2dzXCIge3N0YXRlfSBvbjpjbGljaz17YXN5bmMgKGUpID0+ICB7YXdhaXQgbG9hZExvZ0xpc3QoKTsgc3RhdGU9XCJlcnJvcmxvZ3NcIiB9fSAgPjwvSWNvbj5cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIHsva2V5fVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcblxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcInByb3BlcnRpZXNcIn1cclxuICAgICAgICAgICAgICAgIDxoMT5Xb3JrZmxvdyBQcm9wZXJ0aWVzPC9oMT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJuYW1lXCI+TmFtZTo8L2xhYmVsPjxpbnB1dCBuYW1lPVwibmFtZVwiIHR5cGU9XCJ0ZXh0XCIgYmluZDp2YWx1ZT17bmFtZX0gY2xhc3M9XCJ0ZXh0X2lucHV0XCI+XHJcbiAgICAgICAgICAgICAgICB7I2lmIG5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbjpjbGljaz17KGUpID0+IHsgZHVwbGljYXRlV29ya2Zsb3coKX0gfT5EdXBsaWNhdGUgV29ya2Zsb3c8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnZWRpdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdUaXRsZVwiPkNsaWNrIG9uIGEgVGFnIHRvIHJlbW92ZSBpdDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgJG1ldGFkYXRhLnRhZ3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoICRtZXRhZGF0YS50YWdzIGFzIHRhZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnXCIgb246Y2xpY2s9eyhlKSA9PiB7cmVtb3ZlVGFnKHRhZyl9fT57dGFnfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJ0YWdzZWxlY3RcIiBiaW5kOnZhbHVlPXtzZWxlY3RlZFRhZ30gb246Y2hhbmdlPXsoZSkgPT4ge2FkZFRhZygpfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQgdmFsdWU9XCJcIj5BZGQgVGFnLi4uPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsjZWFjaCB0YWdzIGFzIHRhZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgJG1ldGFkYXRhLnRhZ3MgJiYgISRtZXRhZGF0YS50YWdzLmluY2x1ZGVzKHRhZyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInt0YWd9XCI+e3RhZ308L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxpY2Vuc2VcIj5MaWNlbnNlOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiaW5wdXQgbGljZW5zZVwiIG5hbWU9XCJsaWNlbnNlXCIgYmluZDp2YWx1ZT17JG1ldGFkYXRhLmxpY2Vuc2V9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQgdmFsdWU9XCJcIj5TZWxlY3QuLi48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHNlbGVjdGVkIHZhbHVlPVwieWVzX2NvbW1lcmNpYWxcIj5Db21tZXJjaWFsIGFsbG93ZWQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHNlbGVjdGVkIHZhbHVlPVwibm9uX2NvbW1lcmNpYWxcIj5Ob24gQ29tbWVyY2lhbDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQgdmFsdWU9XCJuZWVkc19saWNlbnNlXCI+TmVlZHMgbGljZW5zZSBmb3IgQ29tbWVyY2lhbCB1c2U8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0TGluZVwiID5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZGVzY3JpcHRpb25cIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOnRvcFwiPkRlc2NyaXB0aW9uOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwidGV4dF9pbnB1dFwiIGJpbmQ6dmFsdWU9eyRtZXRhZGF0YS5kZXNjcmlwdGlvbn0+PC90ZXh0YXJlYT4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXRMaW5lXCIgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjYXRlZ29yeVwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246dG9wXCI+Q2F0ZWdvcnkgKG9ubHkgbGF5ZXIgbWVudSk6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInRleHRfaW5wdXRcIiBiaW5kOnZhbHVlPXskbWV0YWRhdGEuY2F0ZWdvcnl9PiAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgeyNpZiBzdGF0ZSA9PT0gXCJlZGl0Rm9ybVwifVxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPEZvcm1CdWlsZGVyIHtyZWZyZXNofSBvbjpyZWZyZXNoVGFncz17KGUpPT57IHJlZnJlc2hUYWdzKGUpfX0gcG9zWD17cGFyc2VJbnQobGVmdCl9IHBvc1k9e3BhcnNlSW50KHRvcCl9fT48L0Zvcm1CdWlsZGVyPlxyXG4gICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcImVkaXRSdWxlc1wifVxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgeyNpZiAkbWV0YWRhdGEuZm9ybXMgJiYgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQgJiYgJG1ldGFkYXRhLmZvcm1zLmRlZmF1bHQuZWxlbWVudHN9XHJcbiAgICAgICAgICAgICAgICAgICAgPFJ1bGVFZGl0b3I+PC9SdWxlRWRpdG9yPlxyXG4gICAgICAgICAgICAgICAgezplbHNlfVxyXG4gICAgICAgICAgICAgICAgICAgIFBsZWFzZSBkZWZpbmUgYSBmb3JtIGZpcnN0XHJcbiAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcImxpc3RcIn1cclxuICAgICAgICAgICAgICAgIDxoMT5Xb3JrZmxvdyBMaXN0PC9oMT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWdzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHRhZ3MgYXMgdGFnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1jbGljay1ldmVudHMtaGF2ZS1rZXktZXZlbnRzIC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOmNsaWNrPXsgKGUpID0+IHsgYWN0aXZhdGVkVGFnc1t0YWddPSFhY3RpdmF0ZWRUYWdzW3RhZ107JHdvcmtmbG93TGlzdD0kd29ya2Zsb3dMaXN0fX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOm9uPXthY3RpdmF0ZWRUYWdzW3RhZ119Pnt0YWd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7I2lmIHdvcmtmbG93TGlzdH1cclxuICAgICAgICAgICAgICAgICAgICB7I2VhY2ggJHdvcmtmbG93TGlzdCBhcyB3b3JrZmxvd31cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyNpZiBpc1Zpc2libGUod29ya2Zsb3cpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBzdmVsdGUtaWdub3JlIGExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50cyAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmVcIiBjbGFzcz1cIndvcmtmbG93RW50cnlcIiBvbjpjbGljaz17bG9hZFdvcmtmbG93KHdvcmtmbG93KX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3dvcmtmbG93Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxhc3RfY2hhbmdlZFwiPnt3b3JrZmxvdy5sYXN0TW9kaWZpZWRSZWFkYWJsZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFnc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmIHdvcmtmbG93Lmd5cmUgJiYgd29ya2Zsb3cuZ3lyZS50YWdzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHdvcmtmbG93Lmd5cmUudGFncyBhcyB0YWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhZ1wiPnt0YWd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiAgY2xhc3M9XCJkZWxldGVpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJkZWxldGVcIiBvbjpjbGljaz17KGUpPT57ZGVsZXRlV29ya2Zsb3cod29ya2Zsb3cpfX0+PC9JY29uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuXHJcbiAgICAgICAgICAgIHsvaWZ9XHJcblxyXG4gICAgICAgICAgICB7I2lmIHN0YXRlID09PSBcImVycm9ybG9nc1wifVxyXG4gICAgICAgICAgICAgICAgPGgxPkVycm9yIGxvZ3M8L2gxPlxyXG4gICAgICAgICAgICAgICAgeyNpZiB3b3JrZmxvd0xpc3R9XHJcbiAgICAgICAgICAgICAgICAgICAgeyNlYWNoICR3b3JrZmxvd2FwaUxpc3QgYXMgd29ya2Zsb3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgaXNWaXNpYmxlKHdvcmtmbG93KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHMgLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlXCIgY2xhc3M9XCJ3b3JrZmxvd0VudHJ5XCIgb246Y2xpY2s9e2xvYWRXb3JrZmxvdyh3b3JrZmxvdyl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt3b3JrZmxvdy5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgey9lYWNofVxyXG4gICAgICAgICAgICAgICAgey9pZn1cclxuICAgICAgICAgICAgey9pZn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgey9pZn0gPCEtLSBmb2xkT3V0IC0tPlxyXG48L2Rpdj5cclxuPE1hcHBpbmdzIG9uOnVwZGF0ZUZvcm09eyhlKSA9PiB7dXBkYXRlRm9ybSgpfX0gPjwvTWFwcGluZ3M+XHJcblxyXG48c3ZlbHRlOndpbmRvdyBvbjptb3VzZXVwPXtvbk1vdXNlVXB9IG9uOm1vdXNlbW92ZT17b25Nb3VzZU1vdmV9Lz5cclxuIFxyXG48c3R5bGU+XHJcbiAgICBAaW1wb3J0ICdkaXN0L2J1aWxkL2d5cmVzdHlsZXMuY3NzJztcclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK2tCSSxRQUFRLDJCQUEyQiJ9 */");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[64] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[64] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    // (439:16) {:else}
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
    	icon.$on("click", /*click_handler_2*/ ctx[31]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(/*name*/ ctx[3]);
    			t1 = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			set_style(div0, "display", "inline-block");
    			add_location(div0, file, 440, 20, 15908);
    			set_style(div1, "display", "inline-block");
    			attr_dev(div1, "class", "saveIcon");
    			add_location(div1, file, 441, 20, 16009);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(icon, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_1*/ ctx[30], false, false, false, false);
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
    		source: "(439:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (435:16) {#if !name}
    function create_if_block_18(ctx) {
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
    			add_location(div, file, 437, 20, 15706);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[29], false, false, false, false);
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
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(435:16) {#if !name}",
    		ctx
    	});

    	return block;
    }

    // (449:4) {#if !foldOut}
    function create_if_block_17(ctx) {
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
    			add_location(div, file, 450, 12, 16363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_3*/ ctx[32], false, false, false, false);
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
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(449:4) {#if !foldOut}",
    		ctx
    	});

    	return block;
    }

    // (455:4) {#if foldOut}
    function create_if_block(ctx) {
    	let t0;
    	let div0;
    	let icon;
    	let t1;
    	let div3;
    	let div1;
    	let previous_key = /*state*/ ctx[4];
    	let t2;
    	let div2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*debug*/ ctx[14] && create_if_block_16(ctx);
    	icon = new Icon({ props: { name: "up" }, $$inline: true });
    	let key_block = create_key_block(ctx);
    	let if_block1 = /*state*/ ctx[4] === "properties" && create_if_block_11(ctx);
    	let if_block2 = /*state*/ ctx[4] === "editForm" && create_if_block_10(ctx);
    	let if_block3 = /*state*/ ctx[4] === "editRules" && create_if_block_8(ctx);
    	let if_block4 = /*state*/ ctx[4] === "list" && create_if_block_4(ctx);
    	let if_block5 = /*state*/ ctx[4] === "errorlogs" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			key_block.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			attr_dev(div0, "class", "foldout");
    			add_location(div0, file, 460, 8, 16737);
    			attr_dev(div1, "class", "leftMenu");
    			add_location(div1, file, 464, 8, 16883);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file, 480, 8, 17989);
    			attr_dev(div3, "class", "main");
    			add_location(div3, file, 463, 8, 16855);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			mount_component(icon, div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			key_block.m(div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t5);
    			if (if_block4) if_block4.m(div2, null);
    			append_dev(div2, t6);
    			if (if_block5) if_block5.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_6*/ ctx[35], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*debug*/ ctx[14]) if_block0.p(ctx, dirty);

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
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_11(ctx);
    					if_block1.c();
    					if_block1.m(div2, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*state*/ ctx[4] === "editForm") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_10(ctx);
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

    			if (/*state*/ ctx[4] === "editRules") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_8(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div2, t5);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4] === "list") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_4(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div2, t6);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4] === "errorlogs") {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1(ctx);
    					if_block5.c();
    					if_block5.m(div2, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(key_block);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(key_block);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			destroy_component(icon);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			key_block.d(detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(455:4) {#if foldOut}",
    		ctx
    	});

    	return block;
    }

    // (456:4) {#if debug}
    function create_if_block_16(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Test";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "WF JSON";
    			add_location(button0, file, 456, 1, 16530);
    			add_location(button1, file, 457, 1, 16592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_4*/ ctx[33], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_5*/ ctx[34], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(456:4) {#if debug}",
    		ctx
    	});

    	return block;
    }

    // (473:16) {:else}
    function create_else_block_1(ctx) {
    	let icon0;
    	let t0;
    	let icon1;
    	let t1;
    	let icon2;
    	let t2;
    	let icon3;
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

    	icon3 = new Icon({
    			props: {
    				name: "errorlogs",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon3.$on("click", /*click_handler_12*/ ctx[41]);

    	const block = {
    		c: function create() {
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			create_component(icon1.$$.fragment);
    			t1 = space();
    			create_component(icon2.$$.fragment);
    			t2 = space();
    			create_component(icon3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(icon1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(icon2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(icon3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon3_changes = {};
    			if (dirty[0] & /*state*/ 16) icon3_changes.state = /*state*/ ctx[4];
    			icon3.$set(icon3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(icon1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(icon2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(icon3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(473:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (468:16) {#if $metadata && $metadata.lastModified}
    function create_if_block_15(ctx) {
    	let icon0;
    	let t0;
    	let icon1;
    	let t1;
    	let icon2;
    	let t2;
    	let icon3;
    	let current;

    	icon0 = new Icon({
    			props: {
    				name: "properties",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon0.$on("click", /*click_handler_8*/ ctx[37]);

    	icon1 = new Icon({
    			props: {
    				name: "editForm",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon1.$on("click", /*click_handler_9*/ ctx[38]);

    	icon2 = new Icon({
    			props: {
    				name: "editRules",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon2.$on("click", /*click_handler_10*/ ctx[39]);

    	icon3 = new Icon({
    			props: {
    				name: "errorlogs",
    				state: /*state*/ ctx[4]
    			},
    			$$inline: true
    		});

    	icon3.$on("click", /*click_handler_11*/ ctx[40]);

    	const block = {
    		c: function create() {
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			create_component(icon1.$$.fragment);
    			t1 = space();
    			create_component(icon2.$$.fragment);
    			t2 = space();
    			create_component(icon3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(icon1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(icon2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(icon3, target, anchor);
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
    			const icon3_changes = {};
    			if (dirty[0] & /*state*/ 16) icon3_changes.state = /*state*/ ctx[4];
    			icon3.$set(icon3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(icon1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(icon2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(icon3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(468:16) {#if $metadata && $metadata.lastModified}",
    		ctx
    	});

    	return block;
    }

    // (466:12) {#key state}
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

    	icon.$on("click", /*click_handler_7*/ ctx[36]);
    	const if_block_creators = [create_if_block_15, create_else_block_1];
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
    		source: "(466:12) {#key state}",
    		ctx
    	});

    	return block;
    }

    // (483:12) {#if state === "properties"}
    function create_if_block_11(ctx) {
    	let h1;
    	let t1;
    	let label0;
    	let input0;
    	let t3;
    	let t4;
    	let div2;
    	let div0;
    	let t6;
    	let div1;
    	let t7;
    	let select0;
    	let option0;
    	let t9;
    	let label1;
    	let t11;
    	let select1;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t16;
    	let div3;
    	let label2;
    	let t18;
    	let textarea;
    	let t19;
    	let div4;
    	let label3;
    	let t21;
    	let input1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*name*/ ctx[3] && create_if_block_14(ctx);
    	let if_block1 = /*$metadata*/ ctx[8].tags && create_if_block_13(ctx);
    	let each_value_4 = /*tags*/ ctx[11];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
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
    			if (if_block0) if_block0.c();
    			t4 = space();
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Click on a Tag to remove it";
    			t6 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t7 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Add Tag...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			label1 = element("label");
    			label1.textContent = "License:";
    			t11 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Select...";
    			option2 = element("option");
    			option2.textContent = "Commercial allowed";
    			option3 = element("option");
    			option3.textContent = "Non Commercial";
    			option4 = element("option");
    			option4.textContent = "Needs license for Commercial use";
    			t16 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "Description:";
    			t18 = space();
    			textarea = element("textarea");
    			t19 = space();
    			div4 = element("div");
    			label3 = element("label");
    			label3.textContent = "Category (only layer menu):";
    			t21 = space();
    			input1 = element("input");
    			add_location(h1, file, 483, 16, 18072);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file, 484, 16, 18118);
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "text_input");
    			add_location(input0, file, 484, 47, 18149);
    			attr_dev(div0, "class", "tagTitle");
    			add_location(div0, file, 489, 20, 18428);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 490, 20, 18505);
    			option0.selected = true;
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file, 499, 24, 19036);
    			attr_dev(select0, "class", "tagselect");
    			if (/*selectedTag*/ ctx[6] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[45].call(select0));
    			add_location(select0, file, 498, 20, 18929);
    			attr_dev(div2, "class", "tagedit");
    			add_location(div2, file, 488, 16, 18385);
    			attr_dev(label1, "for", "license");
    			add_location(label1, file, 507, 16, 19420);
    			option1.selected = true;
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file, 509, 20, 19573);
    			option2.selected = true;
    			option2.__value = "yes_commercial";
    			option2.value = option2.__value;
    			add_location(option2, file, 510, 20, 19639);
    			option3.selected = true;
    			option3.__value = "non_commercial";
    			option3.value = option3.__value;
    			add_location(option3, file, 511, 20, 19728);
    			option4.selected = true;
    			option4.__value = "needs_license";
    			option4.value = option4.__value;
    			add_location(option4, file, 512, 20, 19813);
    			attr_dev(select1, "class", "input license");
    			attr_dev(select1, "name", "license");
    			if (/*$metadata*/ ctx[8].license === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[47].call(select1));
    			add_location(select1, file, 508, 16, 19475);
    			attr_dev(label2, "for", "description");
    			set_style(label2, "vertical-align", "top");
    			add_location(label2, file, 515, 20, 19984);
    			attr_dev(textarea, "class", "text_input");
    			add_location(textarea, file, 516, 20, 20078);
    			attr_dev(div3, "class", "inputLine");
    			add_location(div3, file, 514, 16, 19938);
    			attr_dev(label3, "for", "category");
    			set_style(label3, "vertical-align", "top");
    			add_location(label3, file, 519, 20, 20261);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "text_input");
    			add_location(input1, file, 520, 20, 20367);
    			attr_dev(div4, "class", "inputLine");
    			add_location(div4, file, 518, 16, 20215);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label0, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*name*/ ctx[3]);
    			insert_dev(target, t3, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div2, t7);
    			append_dev(div2, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select0, null);
    				}
    			}

    			select_option(select0, /*selectedTag*/ ctx[6], true);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, label1, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, select1, anchor);
    			append_dev(select1, option1);
    			append_dev(select1, option2);
    			append_dev(select1, option3);
    			append_dev(select1, option4);
    			select_option(select1, /*$metadata*/ ctx[8].license, true);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, label2);
    			append_dev(div3, t18);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*$metadata*/ ctx[8].description);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, label3);
    			append_dev(div4, t21);
    			append_dev(div4, input1);
    			set_input_value(input1, /*$metadata*/ ctx[8].category);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[42]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[45]),
    					listen_dev(select0, "change", /*change_handler*/ ctx[46], false, false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[47]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[48]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[49])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*name*/ 8 && input0.value !== /*name*/ ctx[3]) {
    				set_input_value(input0, /*name*/ ctx[3]);
    			}

    			if (/*name*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_14(ctx);
    					if_block0.c();
    					if_block0.m(t4.parentNode, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$metadata*/ ctx[8].tags) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_13(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*tags, $metadata*/ 2304) {
    				each_value_4 = /*tags*/ ctx[11];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty[0] & /*selectedTag, tags*/ 2112) {
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
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(label1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(select1);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(483:12) {#if state === \\\"properties\\\"}",
    		ctx
    	});

    	return block;
    }

    // (486:16) {#if name}
    function create_if_block_14(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Duplicate Workflow";
    			add_location(button, file, 486, 20, 18267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_13*/ ctx[43], false, false, false, false);
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
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(486:16) {#if name}",
    		ctx
    	});

    	return block;
    }

    // (492:24) {#if $metadata.tags}
    function create_if_block_13(ctx) {
    	let each_1_anchor;
    	let each_value_5 = /*$metadata*/ ctx[8].tags;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
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
    			if (dirty[0] & /*removeTag, $metadata*/ 16777472) {
    				each_value_5 = /*$metadata*/ ctx[8].tags;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(492:24) {#if $metadata.tags}",
    		ctx
    	});

    	return block;
    }

    // (494:28) {#each $metadata.tags as tag}
    function create_each_block_5(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[69] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_14(...args) {
    		return /*click_handler_14*/ ctx[44](/*tag*/ ctx[69], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 494, 32, 18748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_14, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$metadata*/ 256 && t_value !== (t_value = /*tag*/ ctx[69] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(494:28) {#each $metadata.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (502:28) {#if $metadata.tags && !$metadata.tags.includes(tag)}
    function create_if_block_12(ctx) {
    	let option;
    	let t_value = /*tag*/ ctx[69] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*tag*/ ctx[69];
    			option.value = option.__value;
    			add_location(option, file, 502, 32, 19243);
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
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(502:28) {#if $metadata.tags && !$metadata.tags.includes(tag)}",
    		ctx
    	});

    	return block;
    }

    // (501:24) {#each tags as tag}
    function create_each_block_4(ctx) {
    	let show_if = /*$metadata*/ ctx[8].tags && !/*$metadata*/ ctx[8].tags.includes(/*tag*/ ctx[69]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_12(ctx);

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
    			if (dirty[0] & /*$metadata*/ 256) show_if = /*$metadata*/ ctx[8].tags && !/*$metadata*/ ctx[8].tags.includes(/*tag*/ ctx[69]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_12(ctx);
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
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(501:24) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (524:12) {#if state === "editForm"}
    function create_if_block_10(ctx) {
    	let div;
    	let t;
    	let formbuilder;
    	let current;

    	formbuilder = new FormBuilder({
    			props: {
    				refresh: /*refresh*/ ctx[7],
    				posX: parseInt(/*left*/ ctx[0]),
    				posY: "" + (parseInt(/*top*/ ctx[1]) + "}")
    			},
    			$$inline: true
    		});

    	formbuilder.$on("refreshTags", /*refreshTags_handler*/ ctx[50]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			create_component(formbuilder.$$.fragment);
    			set_style(div, "margin-top", "10px");
    			add_location(div, file, 524, 16, 20555);
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
    			if (dirty[0] & /*left*/ 1) formbuilder_changes.posX = parseInt(/*left*/ ctx[0]);
    			if (dirty[0] & /*top*/ 2) formbuilder_changes.posY = "" + (parseInt(/*top*/ ctx[1]) + "}");
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
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(524:12) {#if state === \\\"editForm\\\"}",
    		ctx
    	});

    	return block;
    }

    // (528:12) {#if state === "editRules"}
    function create_if_block_8(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_9, create_else_block];
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
    			add_location(div, file, 528, 16, 20807);
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(528:12) {#if state === \\\"editRules\\\"}",
    		ctx
    	});

    	return block;
    }

    // (532:16) {:else}
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
    		source: "(532:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (530:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}
    function create_if_block_9(ctx) {
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
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(530:16) {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}",
    		ctx
    	});

    	return block;
    }

    // (536:12) {#if state === "list"}
    function create_if_block_4(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let if_block_anchor;
    	let current;
    	let each_value_3 = /*tags*/ ctx[11];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let if_block = /*workflowList*/ ctx[12] && create_if_block_5(ctx);

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
    			add_location(h1, file, 536, 16, 21160);
    			attr_dev(div, "class", "tags");
    			add_location(div, file, 537, 16, 21200);
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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*activatedTags, tags, $workflowList*/ 2592) {
    				each_value_3 = /*tags*/ ctx[11];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (/*workflowList*/ ctx[12]) if_block.p(ctx, dirty);
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(536:12) {#if state === \\\"list\\\"}",
    		ctx
    	});

    	return block;
    }

    // (539:20) {#each tags as tag}
    function create_each_block_3(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[69] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_15(...args) {
    		return /*click_handler_15*/ ctx[51](/*tag*/ ctx[69], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[69]]);
    			add_location(div, file, 540, 24, 21367);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_15, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*activatedTags, tags*/ 2080) {
    				toggle_class(div, "on", /*activatedTags*/ ctx[5][/*tag*/ ctx[69]]);
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
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(539:20) {#each tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (546:16) {#if workflowList}
    function create_if_block_5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*$workflowList*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*loadWorkflow, $workflowList, deleteWorkflow, isVisible*/ 34865664) {
    				each_value_1 = /*$workflowList*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(546:16) {#if workflowList}",
    		ctx
    	});

    	return block;
    }

    // (548:24) {#if isVisible(workflow)}
    function create_if_block_6(ctx) {
    	let div3;
    	let t0_value = /*workflow*/ ctx[64].name + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2_value = /*workflow*/ ctx[64].lastModifiedReadable + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let div2;
    	let icon;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*workflow*/ ctx[64].gyre && /*workflow*/ ctx[64].gyre.tags && create_if_block_7(ctx);

    	function click_handler_16(...args) {
    		return /*click_handler_16*/ ctx[52](/*workflow*/ ctx[64], ...args);
    	}

    	icon = new Icon({
    			props: { name: "delete" },
    			$$inline: true
    		});

    	icon.$on("click", click_handler_16);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t4 = space();
    			div2 = element("div");
    			create_component(icon.$$.fragment);
    			t5 = space();
    			attr_dev(div0, "class", "last_changed");
    			add_location(div0, file, 551, 32, 22054);
    			attr_dev(div1, "class", "tags");
    			add_location(div1, file, 552, 32, 22151);
    			attr_dev(div2, "class", "deleteicon");
    			add_location(div2, file, 559, 32, 22563);
    			set_style(div3, "position", "relative");
    			attr_dev(div3, "class", "workflowEntry");
    			add_location(div3, file, 549, 28, 21883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div0);
    			append_dev(div0, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			mount_component(icon, div2, null);
    			append_dev(div3, t5);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div3,
    					"click",
    					function () {
    						if (is_function(/*loadWorkflow*/ ctx[20](/*workflow*/ ctx[64]))) /*loadWorkflow*/ ctx[20](/*workflow*/ ctx[64]).apply(this, arguments);
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
    			if ((!current || dirty[0] & /*$workflowList*/ 512) && t0_value !== (t0_value = /*workflow*/ ctx[64].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*$workflowList*/ 512) && t2_value !== (t2_value = /*workflow*/ ctx[64].lastModifiedReadable + "")) set_data_dev(t2, t2_value);

    			if (/*workflow*/ ctx[64].gyre && /*workflow*/ ctx[64].gyre.tags) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					if_block.m(div1, null);
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
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(548:24) {#if isVisible(workflow)}",
    		ctx
    	});

    	return block;
    }

    // (554:36) {#if workflow.gyre && workflow.gyre.tags}
    function create_if_block_7(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*workflow*/ ctx[64].gyre.tags;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
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
    				each_value_2 = /*workflow*/ ctx[64].gyre.tags;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(554:36) {#if workflow.gyre && workflow.gyre.tags}",
    		ctx
    	});

    	return block;
    }

    // (555:40) {#each workflow.gyre.tags as tag}
    function create_each_block_2(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[69] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag");
    			add_location(div, file, 555, 44, 22369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 512 && t_value !== (t_value = /*tag*/ ctx[69] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(555:40) {#each workflow.gyre.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (547:20) {#each $workflowList as workflow}
    function create_each_block_1(ctx) {
    	let show_if = /*isVisible*/ ctx[18](/*workflow*/ ctx[64]);
    	let if_block_anchor;
    	let current;
    	let if_block = show_if && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$workflowList*/ 512) show_if = /*isVisible*/ ctx[18](/*workflow*/ ctx[64]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*$workflowList*/ 512) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_6(ctx);
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
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(547:20) {#each $workflowList as workflow}",
    		ctx
    	});

    	return block;
    }

    // (570:12) {#if state === "errorlogs"}
    function create_if_block_1(ctx) {
    	let h1;
    	let t1;
    	let if_block_anchor;
    	let if_block = /*workflowList*/ ctx[12] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Error logs";
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(h1, file, 570, 16, 22937);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*workflowList*/ ctx[12]) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(570:12) {#if state === \\\"errorlogs\\\"}",
    		ctx
    	});

    	return block;
    }

    // (572:16) {#if workflowList}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value = /*$workflowapiList*/ ctx[10];
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
    			if (dirty[0] & /*loadWorkflow, $workflowapiList, isVisible*/ 1311744) {
    				each_value = /*$workflowapiList*/ ctx[10];
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
    		source: "(572:16) {#if workflowList}",
    		ctx
    	});

    	return block;
    }

    // (574:24) {#if isVisible(workflow)}
    function create_if_block_3(ctx) {
    	let div;
    	let t0_value = /*workflow*/ ctx[64].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			set_style(div, "position", "relative");
    			attr_dev(div, "class", "workflowEntry");
    			add_location(div, file, 575, 28, 23217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*loadWorkflow*/ ctx[20](/*workflow*/ ctx[64]))) /*loadWorkflow*/ ctx[20](/*workflow*/ ctx[64]).apply(this, arguments);
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
    			if (dirty[0] & /*$workflowapiList*/ 1024 && t0_value !== (t0_value = /*workflow*/ ctx[64].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(574:24) {#if isVisible(workflow)}",
    		ctx
    	});

    	return block;
    }

    // (573:20) {#each $workflowapiList as workflow}
    function create_each_block(ctx) {
    	let show_if = /*isVisible*/ ctx[18](/*workflow*/ ctx[64]);
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
    			if (dirty[0] & /*$workflowapiList*/ 1024) show_if = /*isVisible*/ ctx[18](/*workflow*/ ctx[64]);

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
    		source: "(573:20) {#each $workflowapiList as workflow}",
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
    	icon.$on("mousedown", /*onMouseDown*/ ctx[15]);
    	const if_block_creators = [create_if_block_18, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*name*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = !/*foldOut*/ ctx[2] && create_if_block_17(ctx);
    	let if_block2 = /*foldOut*/ ctx[2] && create_if_block(ctx);
    	mappings = new Mappings({ $$inline: true });
    	mappings.$on("updateForm", /*updateForm_handler*/ ctx[53]);

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
    			add_location(div0, file, 429, 12, 15366);
    			attr_dev(div1, "class", "title");
    			add_location(div1, file, 432, 12, 15492);
    			attr_dev(div2, "class", "miniMenu");
    			add_location(div2, file, 428, 2, 15330);
    			attr_dev(div3, "id", "workflowManager");
    			attr_dev(div3, "class", "workflowManager");
    			set_style(div3, "left", /*left*/ ctx[0] + "px");
    			set_style(div3, "top", /*top*/ ctx[1] + "px");
    			add_location(div3, file, 427, 0, 15238);
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
    					listen_dev(window_1, "mouseup", /*onMouseUp*/ ctx[17], false, false, false, false),
    					listen_dev(window_1, "mousemove", /*onMouseMove*/ ctx[16], false, false, false, false)
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
    					if_block1 = create_if_block_17(ctx);
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

    async function renameFile(file_path, new_file_path) {
    	try {
    		const response = await fetch("/workspace/rename_workflowfile", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ file_path, new_file_path })
    		});

    		const result = await response.text();
    		return result;
    	} catch(error) {
    		alert("Error rename .json file: " + error);
    		console.error("Error rename workspace:", error);
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

    async function deleteFile(file_path) {
    	try {
    		const response = await fetch("/workspace/delete_workflow_file", {
    			method: "POST",
    			headers: { "Content-Type": "application/json" },
    			body: JSON.stringify({ file_path })
    		});

    		const result = await response.text();
    		return result;
    	} catch(error) {
    		alert("Error delete workflow .json file: " + error);
    		console.error("Error saving workspace:", error);
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $metadata;
    	let $workflowList;
    	let $workflowapiList;
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
    	let workflowapiList = writable([]);
    	validate_store(workflowapiList, 'workflowapiList');
    	component_subscribe($$self, workflowapiList, value => $$invalidate(10, $workflowapiList = value));
    	let activatedTags = {};
    	let selectedTag = "";
    	let orginalname;
    	let duplicate = false;
    	let debug = false;

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
    		await loadLogList();
    		addExternalLoadListener();
    		let lastloadedworkflowname = localStorage.getItem("lastgyreworkflowloaded");

    		if (lastloadedworkflowname) {
    			let current = $workflowList.find(el => {
    				return el.name == lastloadedworkflowname;
    			});

    			loadWorkflow(current);
    		}
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

    	async function loadLogList() {
    		// todo: make server request and read $metadata of all existing workflows on filesystem
    		let result = await scanLocalNewFiles('logs');

    		result = result.sort((a, b) => b.name.replace(/[^0-9]/g, "") - a.name.replace(/[^0-9]/g, ""));
    		workflowapiList.set(result);
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
    				if (!res.gyre.workflowid) res.gyre.workflowid = (Math.random() + 1).toString(36).substring(2);
    			}

    			return res;
    		});

    		console.log(data_workflow_list);
    		workflowList.set(data_workflow_list);
    	}

    	async function scanLocalNewFiles(type) {
    		let existFlowIds = [];

    		try {
    			const response = await fetch("/workspace/readworkflowdir", {
    				method: "POST",
    				headers: { "Content-Type": "application/json" },
    				body: JSON.stringify({ path: "", existFlowIds, type })
    			});

    			let result = await response.json();

    			if (type != 'logs') {
    				result = fixDatesFromServer(result);
    				allworkflows = result;
    			}

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

    		orginalname = workflow.name;
    		console.log("load workflow!!", orginalname, workflow.name);
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

    		if (state == "errorlogs") {
    			current = $workflowapiList.find(el => {
    				return el.name == workflow.name;
    			});

    			window.app.loadApiJson(JSON.parse(current.json));
    			$$invalidate(4, state = "errorlogs");
    			return;
    		}

    		localStorage.setItem('lastgyreworkflowloaded', workflow.name);

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

    		console.log("save file: ", file_path, "name: ", name, "gyrename: ", graph.extra?.workspace_info?.name);

    		if (!file_path.endsWith('.json')) {
    			// Add .json extension if it doesn't exist
    			file_path += '.json';
    		}

    		if ($metadata && graph.extra) graph.extra.gyre = $metadata;
    		const graphJson = JSON.stringify(graph);
    		console.log("  orginal name ", orginalname);

    		if (orginalname != name && !duplicate) {
    			console.log("rename file orginal ", orginalname, "name", name);
    			let new_file_path;

    			if (orginalname) {
    				new_file_path = orginalname;
    			}

    			if (!new_file_path.endsWith('.json')) {
    				new_file_path += '.json';
    			}

    			await updateFile(new_file_path, graphJson);
    			await renameFile(new_file_path, file_path);
    			duplicate = false;
    			orginalname = name;
    		} else {
    			await updateFile(file_path, graphJson);

    			if (duplicate) {
    				orginalname = name;
    				duplicate = false;
    			}
    		}

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

    		if (selectedTag === "LayerMenu") {
    			removeTag("ControlNet");
    			removeTag("Txt2Image");
    			removeTag("Inpainting");
    		}

    		if (selectedTag === "Txt2Image" || selectedTag === "Inpainting" || selectedTag === "ControlNet") {
    			removeTag("LayerMenu");
    		}

    		$metadata.tags.push(selectedTag);
    		metadata.set($metadata);
    	}

    	function removeTag(tag) {
    		const index = $metadata.tags.indexOf(tag);
    		if (index < 0) return;
    		$metadata.tags.splice(index, 1);
    		metadata.set($metadata);
    	}

    	function deleteWorkflow(workflow) {
    		console.log("delete workflow", workflow);

    		if (confirm("Delete Workflow?") == true) {
    			let name = workflow.name;

    			if (!name.endsWith('.json')) {
    				name += '.json';
    			}

    			deleteFile(name);
    			workflowList.set($workflowList);
    		}
    	}

    	function duplicateWorkflow() {
    		$$invalidate(3, name = 'Copy of ' + name);
    		set_store_value(metadata, $metadata.workflowid = (Math.random() + 1).toString(36).substring(2), $metadata);
    		duplicate = true;
    		saveWorkflow();
    	}

    	let refresh = 0;

    	function updateForm() {
    		if (state !== "editForm") return;
    		$$invalidate(7, refresh++, refresh);
    	}

    	function refreshTags(e) {
    		set_store_value(metadata, $metadata.tags = e.detail, $metadata);
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

    	const click_handler_11 = async e => {
    		await loadLogList();
    		$$invalidate(4, state = "errorlogs");
    	};

    	const click_handler_12 = async e => {
    		await loadLogList();
    		$$invalidate(4, state = "errorlogs");
    	};

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(3, name);
    	}

    	const click_handler_13 = e => {
    		duplicateWorkflow();
    	};

    	const click_handler_14 = (tag, e) => {
    		removeTag(tag);
    	};

    	function select0_change_handler() {
    		selectedTag = select_value(this);
    		$$invalidate(6, selectedTag);
    		$$invalidate(11, tags);
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

    	const refreshTags_handler = e => {
    		refreshTags(e);
    	};

    	const click_handler_15 = (tag, e) => {
    		$$invalidate(5, activatedTags[tag] = !activatedTags[tag], activatedTags);
    		workflowList.set($workflowList);
    	};

    	const click_handler_16 = (workflow, e) => {
    		deleteWorkflow(workflow);
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
    		component_subscribe,
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
    		workflowapiList,
    		activatedTags,
    		selectedTag,
    		orginalname,
    		duplicate,
    		debug,
    		onMouseDown,
    		onMouseMove,
    		addExternalLoadListener,
    		getAvalableFileName,
    		onMouseUp,
    		isVisible,
    		loadLogList,
    		loadList,
    		scanLocalNewFiles,
    		fixDatesFromServer,
    		loadWorkflow,
    		testFirstPass,
    		showStructure,
    		saveWorkflow,
    		renameFile,
    		updateFile,
    		deleteFile,
    		addTag,
    		removeTag,
    		deleteWorkflow,
    		duplicateWorkflow,
    		refresh,
    		updateForm,
    		refreshTags,
    		$metadata,
    		$workflowList,
    		$workflowapiList
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
    		if ('tags' in $$props) $$invalidate(11, tags = $$props.tags);
    		if ('workflowList' in $$props) $$invalidate(12, workflowList = $$props.workflowList);
    		if ('workflowapiList' in $$props) $$invalidate(13, workflowapiList = $$props.workflowapiList);
    		if ('activatedTags' in $$props) $$invalidate(5, activatedTags = $$props.activatedTags);
    		if ('selectedTag' in $$props) $$invalidate(6, selectedTag = $$props.selectedTag);
    		if ('orginalname' in $$props) orginalname = $$props.orginalname;
    		if ('duplicate' in $$props) duplicate = $$props.duplicate;
    		if ('debug' in $$props) $$invalidate(14, debug = $$props.debug);
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
    		$workflowapiList,
    		tags,
    		workflowList,
    		workflowapiList,
    		debug,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		isVisible,
    		loadLogList,
    		loadWorkflow,
    		testFirstPass,
    		saveWorkflow,
    		addTag,
    		removeTag,
    		deleteWorkflow,
    		duplicateWorkflow,
    		updateForm,
    		refreshTags,
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
    		click_handler_11,
    		click_handler_12,
    		input0_input_handler,
    		click_handler_13,
    		click_handler_14,
    		select0_change_handler,
    		change_handler,
    		select1_change_handler,
    		textarea_input_handler,
    		input1_input_handler,
    		refreshTags_handler,
    		click_handler_15,
    		click_handler_16,
    		updateForm_handler
    	];
    }

    class WorkflowManager extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css$1, [-1, -1, -1]);

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
    	append_styles(target, "svelte-1tky8bj", "@media(min-width: 640px){}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQXBwLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGltcG9ydCBXb3JrZmxvd01hbmFnZXIgZnJvbSBcIi4vV29ya2Zsb3dNYW5hZ2VyLnN2ZWx0ZVwiO1xyXG4gIFxyXG48L3NjcmlwdD5cclxuXHJcbjxXb3JrZmxvd01hbmFnZXI+PC9Xb3JrZmxvd01hbmFnZXI+XHJcblxyXG48c3R5bGU+XHJcblx0bWFpbiB7XHJcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblx0XHRwYWRkaW5nOiAxZW07XHJcblx0XHRtYXgtd2lkdGg6IDI0MHB4O1xyXG5cdFx0bWFyZ2luOiAwIGF1dG87XHJcblx0fVxyXG5cclxuXHRoMSB7XHJcblx0XHRjb2xvcjogI2ZmM2UwMDtcclxuXHRcdHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcblx0XHRmb250LXNpemU6IDRlbTtcclxuXHRcdGZvbnQtd2VpZ2h0OiAxMDA7XHJcblx0fVxyXG5cclxuXHRAbWVkaWEgKG1pbi13aWR0aDogNjQwcHgpIHtcclxuXHRcdG1haW4ge1xyXG5cdFx0XHRtYXgtd2lkdGg6IG5vbmU7XHJcblx0XHR9XHJcblx0fVxyXG48L3N0eWxlPiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFzQkMsTUFBTyxZQUFZLEtBQUssQ0FBRSxDQUkxQiJ9 */");
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

    	$$self.$capture_state = () => ({ WorkflowManager });
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
