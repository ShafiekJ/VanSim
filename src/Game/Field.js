import { VGCircle , RGCircle , GCircle} from "./Circles"


const VG = new VGCircle( null, 0)
const FLRG = new RGCircle('FL' , null, 0, 0)
const BLRG = new RGCircle('BL' , null, 0, 0)
const BCRG = new RGCircle('BC' , null, 0, 0)
const BRRG = new RGCircle('BR' , null, 0, 0)
const FRRG = new RGCircle('FR' , null, 0, 0)
const GC = new GCircle(null)

export class Field{
    constructor(
        MainDeck,
        RideDeck,
        DropZone,
        OrderArea,
        OrderZone,
        DamageZone,
        TriggerZone,
        
        GZone,
        BindZone,
        RemoveZone
    ){
        this.MainDeck = MainDeck,
        this.RideDeck = RideDeck,
        this.DropZone = DropZone,
        this.OrderArea = OrderArea,
        this.OrderZone = OrderZone,
        this.DamageZone = DamageZone,
        this.TriggerZone = TriggerZone,
        this.GZone = GZone,
        this.BindZone = BindZone,
        this.VGCircle = VG,
        this.FLRG = FLRG,
        this.BLRG = BLRG,
        this.BCRG = BCRG,
        this.BRRG = BRRG,
        this.FRRG = FRRG,
        this.GCircle = GC,
        this.RemoveZone = RemoveZone
    }

}