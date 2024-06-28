import { mountEl, span, text } from "/shared/dom.js";

document.addEventListener("DOMContentLoaded", async () => {
    window.app = new App();
});

const adjectiveStr = "quick slow bright dark happy sad large small hot cold smooth rough noisy quiet old new strong weak deep shallow fast lazy bold timid sharp dull clean dirty sweet sour rich poor smart foolish soft hard fresh stale young old light heavy long short tall short wide narrow thick thin simple complex busy idle warm cool wet dry kind cruel calm angry cheerful gloomy brave cowardly humble proud gentle harsh wild tame polite rude honest deceitful loyal disloyal patient impatient generous selfish caring indifferent friendly unfriendly playful serious curious uninterested hopeful hopeless funny boring careful careless loving hateful daring cautious beautiful ugly graceful clumsy healthy sick wealthy impoverished wise ignorant creative unoriginal diligent lazy elegant awkward festive somber spicy bland savory bitter fragrant stinky powerful powerless energetic lethargic vibrant dull adventurous cautious mysterious predictable artistic unimaginative precise imprecise radiant dim enchanting repulsive bountiful scarce majestic ordinary luxurious plain tasty tasteless robust fragile flexible rigid durable delicate cozy uncomfortable fierce gentle jubilant melancholic passionate indifferent clever foolish confident uncertain grateful ungrateful dazzling drab triumphant defeated vivacious listless sparkling dull jovial morose charming repellent resourceful wasteful inclusive exclusive supportive critical luminous dark buoyant sinking serene chaotic empathetic apathetic enthusiastic indifferent innovative traditional respectful disrespectful optimistic pessimistic dynamic static fertile barren tranquil turbulent strategic haphazard meticulous sloppy assertive passive resilient fragile jubilant sorrowful abundant sparse resilient fragile efficient inefficient thoughtful thoughtless coherent incoherent vibrant dull insightful shallow disciplined undisciplined generous stingy determined indecisive transparent opaque logical illogical sensible foolish zealous indifferent meticulous careless majestic ordinary cheerful morose friendly hostile patient impatient vibrant lifeless innovative stagnant brave fearful honest dishonest modest arrogant serene agitated wise foolish imaginative unimaginative genuine fake proactive reactive sensitive insensitive capable incapable thorough superficial diligent lazy charming repulsive tolerant intolerant enthusiastic apathetic motivated unmotivated disciplined undisciplined ambitious complacent compassionate indifferent curious uninterested responsible irresponsible articulate inarticulate courageous cowardly enthusiastic listless friendly hostile dependable unreliable generous selfish harmonious discordant humble proud optimistic pessimistic perceptive oblivious persistent wavering respectful disrespectful resourceful helpless sincere insincere supportive critical tolerant intolerant visionary shortsighted wise naive alert unaware adaptable rigid appreciative ungrateful assertive submissive attentive distracted authentic inauthentic balanced unbalanced calm restless caring indifferent cheerful gloomy coherent incoherent competent incompetent considerate inconsiderate courteous discourteous creative unimaginative decisive indecisive diligent negligent dynamic static empathetic apathetic flexible inflexible focused unfocused generous stingy genuine fake gracious rude hopeful hopeless humble arrogant insightful oblivious inspiring discouraging intelligent foolish intuitive unperceptive joyful sorrowful kind cruel knowledgeable ignorant loyal disloyal methodical haphazard mindful heedless motivated unmotivated noble ignoble observant unobservant optimistic pessimistic organized disorganized passionate indifferent patient impatient perceptive unobservant persistent fleeting polite rude practical impractical proactive reactive prudent reckless rational irrational reliable unreliable resilient brittle resourceful wasteful respectful disrespectful responsible irresponsible responsive unresponsive selfless selfish sincere insincere skillful unskillful strategic aimless supportive critical thoughtful thoughtless tolerant intolerant trustworthy untrustworthy versatile inflexible vibrant lifeless wise foolish youthful aged zealous apathetic";
const adjectives = [...new Set(adjectiveStr.split(" "))];

const verbStr = "run jump swim write read sing dance laugh cry shout whisper talk listen see hear smell taste touch build destroy create imagine think believe hope love hate like dislike want need give take find lose win fail start stop begin end open close cut break fix grow shrink teach learn play work sleep wake cook eat drink buy sell pay borrow lend save spend drive walk fly swim climb fall push pull carry drop throw catch hold release paint draw sew knit weave spin wash clean tidy mess organize plan prepare sing yell scream argue discuss agree disagree help assist support rescue draw build read jump run play dance sing talk listen write watch clean sleep eat drink cook shop travel fly drive walk run jump swim climb read write laugh cry talk listen sing dance work play eat sleep drink cook clean drive travel fly swim run jump think dream believe hope plan prepare create destroy build repair break fix save spend buy sell love hate like dislike want need give take send receive find lose win fail start stop begin end open close cut break grow shrink teach learn play work sleep wake cook eat drink buy sell pay borrow lend save spend drive walk fly swim climb fall push pull carry drop throw catch hold release paint draw sew knit weave spin wash clean tidy mess organize plan prepare sing yell scream argue discuss agree disagree help assist support rescue draw build read jump run play dance sing talk listen write watch clean sleep eat drink cook shop travel fly drive walk run jump swim climb read write laugh cry talk listen sing dance work play eat sleep drink cook clean drive travel fly swim run jump think dream believe hope plan prepare create destroy build repair break fix save spend buy sell love hate like dislike want need give take send receive find lose win fail start stop begin end open close cut break grow shrink teach learn play work sleep wake cook eat drink buy sell pay borrow lend save spend drive walk fly swim climb fall push pull carry drop throw catch hold release paint draw sew knit weave spin wash clean tidy mess organize plan prepare sing yell scream argue discuss agree disagree help assist support rescue draw build read jump run play dance sing talk listen write watch clean sleep eat drink cook shop travel fly drive walk run jump swim climb read write laugh cry talk listen sing dance work play eat sleep drink cook clean drive travel fly swim run jump think dream believe hope plan prepare create destroy build repair break fix save spend buy sell love hate like dislike want need give take send receive find lose win fail start stop begin end open close cut break grow shrink teach learn play work sleep wake cook eat drink buy sell pay borrow lend save spend drive walk fly swim climb fall push pull carry drop throw catch hold release paint draw sew knit weave spin wash clean tidy mess organize plan prepare sing yell scream argue discuss agree disagree help assist support rescue draw build read jump run play dance sing talk listen write watch clean sleep eat drink cook shop travel fly drive walk run jump swim climb read write laugh cry talk listen sing dance work play eat sleep drink cook clean drive travel fly swim run jump think dream believe hope plan prepare create destroy build repair break fix save spend buy sell love hate like dislike want need give take send receive find lose win fail start stop begin end open close cut break grow shrink teach learn play work sleep wake cook eat drink buy sell pay borrow lend save spend drive walk fly swim climb fall push pull carry drop throw catch hold release paint draw sew knit weave spin wash clean tidy mess organize plan prepare sing yell scream argue discuss agree disagree help assist support rescue";
const verbs = [...new Set(verbStr.split(" "))];

const nounStr = "apple banana chair table car truck dog cat house tree river mountain beach computer phone book pen shirt pants shoe window door glass plate camera bicycle flower garden school city village road bridge airplane train boat ship star cloud rain snow wind thunder lightning sand stone forest desert ocean lake valley hill island meadow castle tower cave tunnel fence path park street lamp bench museum library theater restaurant hotel store market stadium airport station bus taxi bicycle subway highway sidewalk field court playground farm barn office factory workshop laboratory clinic hospital temple church mosque beach pool gym studio apartment mansion cabin hut tent playground warehouse gallery pub club mall zoo aquarium planet comet galaxy nebula universe atom molecule cell tissue organ machine engine battery circuit wire switch button screen keyboard mouse speaker microphone printer scanner projector compass map globe backpack suitcase wallet purse watch bracelet necklace ring crown scepter sword shield helmet armor costume mask doll toy puzzle game ball bat glove racket net skate ski snowboard surfboard kayak paddle raft tent sleeping bag flashlight campfire hammock barbecue grill oven stove fridge microwave blender mixer kettle pot pan spoon fork knife plate bowl cup bottle jar box bag basket shelf drawer closet cabinet mirror frame painting sculpture vase rug curtain blind towel sheet pillow blanket bed mattress couch sofa chair table desk lamp clock fan heater air conditioner generator solar panel wind turbine water pump drill saw hammer wrench screwdriver pliers tape measure level chisel file sandpaper glue nail screw bolt nut washer hinge latch lock key card chip coin bill stamp envelope paper notebook journal diary calendar agenda book magazine newspaper comic brochure flyer poster banner sign billboard ad pamphlet leaflet catalog menu recipe letter report essay story poem novel script play article review guide manual textbook dictionary encyclopedia atlas thesaurus biography autobiography memoir journal log chart graph diagram blueprint sketch drawing painting photograph illustration cartoon animation video movie film clip song melody tune rhythm beat chord harmony symphony opera ballet concert festival parade circus fair carnival race marathon tournament match game contest quiz puzzle riddle mystery adventure journey expedition voyage mission quest";
const nouns = [...new Set(nounStr.split(" "))];

class App {
    constructor() {
        this.outputEl = document.getElementById("output");
        this.titleEl = document.getElementById("title");

        this.genAdjEl = document.getElementById("gen-adj");
        this.genVerbEl = document.getElementById("gen-verb");
        this.genNounEl = document.getElementById("gen-noun");

        this.genAdjEl.addEventListener("click", () => {
            this.generate(this.adjectiveGenerator)
            this.titleEl.innerText = "Adjectives";
        });
        this.genVerbEl.addEventListener("click", () => {
            this.generate(this.verbGenerator)
            this.titleEl.innerText = "Verbs";
        });
        this.genNounEl.addEventListener("click", () => {
            this.generate(this.nounGenerator)
            this.titleEl.innerText = "Nouns";
        });

        this.adjectiveGenerator = new MarkovChain();
        for (const word of adjectives) {
            this.adjectiveGenerator.train(word);
        }

        this.verbGenerator = new MarkovChain();
        for (const word of verbs) {
            this.verbGenerator.train(word);
        }

        this.nounGenerator = new MarkovChain();
        for (const word of nouns) {
            this.nounGenerator.train(word);
        }

        this.generate(this.adjectiveGenerator);
    }

    generate(generator) {
        const words = Array(16);
        let i = 0;
        while (true) {
            if (i >= 32) break;
            const word = generator.generate().join("");
            if (word.length < 5 || word.length > 10) continue;
            words[i] = word;
            i += 1;
        }
        mountEl(this.outputEl, words.map(word => span({}, [text(word)])));
    }
}

const startState = Object.create(null);
const endState = Object.create(null);

class MarkovChain {
    constructor() {
        this.counts = new Map();
        this.windowSize = 2;
    }

    generate() {
        let output = [];
        let state = Array(this.windowSize).fill(startState);
        while (true) {
            const newState = this.nextState(state);
            if (newState === endState) break;
            state[0] = state[1];
            state[1] = newState;
            output.push(newState);
        }
        return output;
    }

    nextState(prev) {
        const key = stateToKey(prev);
        const probabilities = this.probabilities.get(key);
        const letters = this.values.get(key);
        const r = Math.random();

        // TODO: binary search
        for (let i = 0; i < probabilities.length; i++) {
            const probability = probabilities[i];
            if (r < probability) {
                return letters[i];
            }
        }
    }

    train(arr) {
        this.addPair([startState, startState], arr[0]);
        this.addPair([startState, arr[0]], arr[1]);
        for (let i = 0; i < arr.length - 2; i++) {
            this.addPair([arr[i], arr[i + 1]], arr[i + 2]);
        }
        this.addPair([arr.at(-2), arr.at(-1)], endState);
        this.recomputeAllProbabilities();
    }

    addPair(a, b) {
        const key = stateToKey(a);
        if (this.counts.get(key) === undefined) {
            this.counts.set(key, new Map());
        }
        if (this.counts.get(key).get(b) === undefined) {
            this.counts.get(key).set(b, 0);
        }
        this.counts.get(key).set(b, this.counts.get(key).get(b) + 1);
    }

    recomputeAllProbabilities() {
        this.probabilities = new Map();
        this.values = new Map();
        for (const key of this.counts.keys()) {
            this.recomputeProbabilities(key);
        }
    }

    recomputeProbabilities(a) {
        const keys = [...this.counts.get(a).keys()];
        const total = [...this.counts.get(a).values()].reduce((acc, cur) => acc + cur, 0);

        this.probabilities.set(a, Array(keys.length));
        this.values.set(a, Array(keys.length));

        let maxChance = 0;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            maxChance += this.counts.get(a).get(key) / total;
            this.probabilities.get(a)[i] = maxChance;
            this.values.get(a)[i] = key;
        }
    }
}

function stateToKey(state) {
    return state.map(value => {
        if (value === startState) return "<start>";
        if (value === endState) return "<end>";
        return value;
    }).join(":");
}