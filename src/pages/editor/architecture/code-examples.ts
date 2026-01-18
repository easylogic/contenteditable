export const initializationPatternCode = `class Editor {
  constructor(config) {
    this.#config = config;
    this.#initialized = false;
    
    // Create initialization promise
    this.#initPromise = this.#initialize();
  }
  
  get initialized() {
    return this.#initPromise;
  }
  
  async #initialize() {
    // Load schema
    const schema = await this.#loadSchema(this.#config.schema);
    
    // Initialize plugins
    await this.#initializePlugins();
    
    // Set up view layer
    await this.#setupView();
    
    this.#initialized = true;
    return this;
  }
  
  async #loadSchema(schemaConfig) {
    if (typeof schemaConfig === 'string') {
      // Load from URL
      const response = await fetch(schemaConfig);
      return await response.json();
    }
    return schemaConfig;
  }
  
  async #initializePlugins() {
    const pluginPromises = this.#config.plugins.map(plugin => {
      return plugin.initialize?.(this) || Promise.resolve();
    });
    await Promise.all(pluginPromises);
  }
  
  async #setupView() {
    // Set up DOM event listeners
    // Initialize rendering
    // Set up selection handling
  }
}

// Usage
const editor = await new Editor({
  schema: './schema.json',
  plugins: [new HistoryPlugin(), new LinkPlugin()]
}).initialized;

// Editor is now ready to use
editor.insertText('Hello');`;

export const errorHandlingCode = `class Editor {
  async #initialize() {
    try {
      // Load schema
      const schema = await this.#loadSchema(this.#config.schema);
      if (!schema) {
        throw new Error('Failed to load schema');
      }
      
      // Initialize plugins
      await this.#initializePlugins();
      
      // Set up view layer
      await this.#setupView();
      
      this.#initialized = true;
      return this;
    } catch (error) {
      // Clean up on error
      this.#cleanup();
      throw error;
    }
  }
  
  #cleanup() {
    // Remove event listeners
    // Clear timers
    // Release resources
  }
}

// Usage with error handling
try {
  const editor = await new Editor({
    schema: './schema.json',
    plugins: [new HistoryPlugin()]
  }).initialized;
  
  // Use editor
  editor.insertText('Hello');
} catch (error) {
  console.error('Failed to initialize editor:', error);
  // Show error to user
}`;

export const hookIntegrationCode = `class Editor {
  constructor(config) {
    this.#hooks = {
      init: new SyncHook(),
      initAsync: new AsyncParallelHook(),
      ready: new SyncHook()
    };
    
    this.#initPromise = this.#initialize();
  }
  
  async #initialize() {
    // Synchronous initialization hooks
    this.#hooks.init.call();
    
    // Asynchronous initialization hooks
    await this.#hooks.initAsync.promise();
    
    // Ready hook
    this.#hooks.ready.call();
    
    return this;
  }
  
  get hooks() {
    return this.#hooks;
  }
}

// Plugin can hook into initialization
class DatabasePlugin {
  apply(editor) {
    editor.hooks.initAsync.tapPromise(async () => {
      // Load data from database
      const data = await this.loadFromDatabase();
      editor.setInitialContent(data);
    });
  }
  
  async loadFromDatabase() {
    const response = await fetch('/api/document');
    return await response.json();
  }
}

// Usage
const editor = await new Editor({
  plugins: [new DatabasePlugin()]
}).initialized;`;

export const pluginInitializationCode = `class Plugin {
  constructor(config) {
    this.#config = config;
  }
  
  async initialize(editor) {
    // Load plugin resources
    await this.#loadResources();
    
    // Set up plugin state
    this.#setupState(editor);
    
    // Register hooks
    this.#registerHooks(editor);
  }
  
  async #loadResources() {
    if (this.#config.resources) {
      const promises = this.#config.resources.map(url => fetch(url));
      await Promise.all(promises);
    }
  }
  
  #setupState(editor) {
    this.#editor = editor;
    this.#state = new Map();
  }
  
  #registerHooks(editor) {
    editor.hooks.beforeOperation.tap((operation) => {
      this.#handleOperation(operation);
    });
  }
}

// Plugin with async initialization
class ImageUploadPlugin extends Plugin {
  async initialize(editor) {
    await super.initialize(editor);
    
    // Initialize upload service
    this.#uploadService = await this.#createUploadService();
  }
  
  async #createUploadService() {
    // Set up cloud storage connection
    return new UploadService({
      apiKey: this.#config.apiKey,
      endpoint: this.#config.endpoint
    });
  }
}`;

export const schemaLoaderCode = `class SchemaLoader {
  async load(schemaConfig) {
    if (typeof schemaConfig === 'string') {
      if (this.isURL(schemaConfig)) {
        return await this.loadFromURL(schemaConfig);
      }
      if (this.isLocalPath(schemaConfig)) {
        return await this.loadFromFile(schemaConfig);
      }
      return await this.loadFromRegistry(schemaConfig);
    }
    return schemaConfig;
  }
  
  isURL(str) {
    return str.startsWith('http://') || str.startsWith('https://');
  }
  
  isLocalPath(str) {
    return str.startsWith('./') || str.startsWith('../');
  }
  
  async loadFromURL(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to load schema from URL');
    }
    return await response.json();
  }
  
  async loadFromFile(path) {
    const response = await fetch(path);
    return await response.json();
  }
  
  async loadFromRegistry(name) {
    const registry = await this.getRegistry();
    return registry.get(name);
  }
}`;

export const pluginLoaderCode = `class PluginLoader {
  async loadPlugins(pluginConfigs) {
    const plugins = [];
    
    for (const config of pluginConfigs) {
      if (typeof config === 'string') {
        // Load plugin module
        const plugin = await this.#loadPluginModule(config);
        plugins.push(plugin);
      } else if (config.module) {
        // Load from module
        const plugin = await this.#loadPluginModule(config.module);
        plugins.push(new plugin(config.options));
      } else {
        // Already a plugin instance
        plugins.push(config);
      }
    }
    
    return plugins;
  }
  
  async #loadPluginModule(name) {
    // Dynamic import
    const module = await import(\`./plugins/\${name}.js\`);
    return module.default || module[name];
  }
}

// Usage
const loader = new PluginLoader();
const plugins = await loader.loadPlugins([
  'history',
  'link',
  { module: 'image', options: { uploadUrl: '/api/upload' } }
]);`;

export const lifecyclePhasesCode = `class Editor {
  #state = 'idle'; // idle -> loading -> ready -> error
  
  async #initialize() {
    this.#transition('loading');
    
    try {
      // Phase 1: Pre-initialization
      await this.#phasePreInit();
      
      // Phase 2: Resource loading
      await this.#phaseLoadResources();
      
      // Phase 3: Plugin initialization
      await this.#phaseInitPlugins();
      
      // Phase 4: View setup
      await this.#phaseSetupView();
      
      // Phase 5: Post-initialization
      await this.#phasePostInit();
      
      this.#transition('ready');
    } catch (error) {
      this.#transition('error', error);
      throw error;
    }
  }
  
  #transition(newState, data = null) {
    const oldState = this.#state;
    this.#state = newState;
    this.emit('stateChange', { from: oldState, to: newState, data });
  }
  
  async #phasePreInit() {
    // Validate configuration
    // Set up internal structures
  }
  
  async #phaseLoadResources() {
    // Load schemas, assets, etc.
  }
  
  async #phaseInitPlugins() {
    // Initialize all plugins
  }
  
  async #phaseSetupView() {
    // Set up DOM, event listeners
  }
  
  async #phasePostInit() {
    // Final validation, emit ready event
  }
}`;

export const dependencyResolutionCode = `class DependencyResolver {
  resolve(plugins) {
    // Build dependency graph
    const graph = this.#buildGraph(plugins);
    
    // Detect cycles
    if (this.#hasCycle(graph)) {
      throw new Error('Circular dependency detected');
    }
    
    // Topological sort
    return this.#topologicalSort(graph);
  }
  
  #buildGraph(plugins) {
    const graph = new Map();
    
    for (const plugin of plugins) {
      const deps = plugin.dependencies || [];
      graph.set(plugin, deps);
    }
    
    return graph;
  }
  
  #hasCycle(graph) {
    const visited = new Set();
    const recStack = new Set();
    
    const hasCycleDFS = (node) => {
      if (recStack.has(node)) return true;
      if (visited.has(node)) return false;
      
      visited.add(node);
      recStack.add(node);
      
      const deps = graph.get(node) || [];
      for (const dep of deps) {
        if (hasCycleDFS(dep)) return true;
      }
      
      recStack.delete(node);
      return false;
    };
    
    for (const node of graph.keys()) {
      if (hasCycleDFS(node)) return true;
    }
    
    return false;
  }
  
  #topologicalSort(graph) {
    const visited = new Set();
    const result = [];
    
    const visit = (node) => {
      if (visited.has(node)) return;
      
      const deps = graph.get(node) || [];
      for (const dep of deps) {
        visit(dep);
      }
      
      visited.add(node);
      result.push(node);
    };
    
    for (const node of graph.keys()) {
      visit(node);
    }
    
    return result;
  }
}

// Usage
const resolver = new DependencyResolver();
const orderedPlugins = resolver.resolve([
  { name: 'link', dependencies: ['history'] },
  { name: 'history', dependencies: [] },
  { name: 'image', dependencies: ['link'] }
]);
// Result: ['history', 'link', 'image']`;

export const timeoutRetryCode = `class InitializationManager {
  async initializeWithTimeout(initFn, timeout = 5000) {
    return Promise.race([
      initFn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Initialization timeout')), timeout)
      )
    ]);
  }
  
  async initializeWithRetry(initFn, options = {}) {
    const { maxRetries = 3, delay = 1000, backoff = 2 } = options;
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await initFn();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const waitTime = delay * Math.pow(backoff, attempt);
          await this.#sleep(waitTime);
        }
      }
    }
    
    throw lastError;
  }
  
  async initializeWithTimeoutAndRetry(initFn, options = {}) {
    const { timeout = 5000, maxRetries = 3 } = options;
    
    return this.initializeWithRetry(
      () => this.initializeWithTimeout(initFn, timeout),
      { maxRetries }
    );
  }
  
  #sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const manager = new InitializationManager();

try {
  const editor = await manager.initializeWithTimeoutAndRetry(
    () => new Editor(config).initialized,
    { timeout: 10000, maxRetries: 3 }
  );
} catch (error) {
  console.error('Failed after retries:', error);
}`;

export const bestPracticesCode = `class Editor {
  async #initialize() {
    // Check if already initialized
    if (this.#initialized) {
      return this;
    }
    
    // Show loading state
    this.#setLoadingState(true);
    
    try {
      // Load resources in parallel
      const [schema, plugins] = await Promise.all([
        this.#loadSchema(this.#config.schema),
        this.#loadPlugins(this.#config.plugins)
      ]);
      
      // Initialize sequentially (plugins may depend on schema)
      await this.#setupSchema(schema);
      await this.#setupPlugins(plugins);
      await this.#setupView();
      
      this.#initialized = true;
      this.#setLoadingState(false);
      
      return this;
    } catch (error) {
      this.#setLoadingState(false);
      this.#setErrorState(error);
      throw error;
    }
  }
  
  #setLoadingState(loading) {
    // Emit loading event
    this.emit('loading', { loading });
  }
  
  #setErrorState(error) {
    // Emit error event
    this.emit('error', { error });
  }
}`;
