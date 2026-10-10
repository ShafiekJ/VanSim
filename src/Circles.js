export class RGCircle{
constructor(
    position,
    unit,
    powergain,
    shieldgain,
    order
){
    this.position = position
    this.unit = unit
    this.powergain = powergain
    this.shieldgain = shieldgain
    this.markers = []
    this.order = order
}

}
export class VGCircle{
    position = 'VC'
    order = 0
    constructor(
        unit,
        powergain
    ){
        this.unit = unit
        this.powergain = powergain
        this.markers = []
    }
    
}
export class GCircle{
    position = 'GC'
    constructor(
        guardians
    ){
        this.guardians = guardians
    }
    
}
class Unit{
    constructor(
        name,
        grade,
        text,
        skill ,
        originalPower,
        originalCritical,
        originalShield,
        img,
        nation,
        clan,
        race,
        set,
        setNo,
        cardtype,
        flavor,
        format,
        sleeve,
        triggereffect,
        state,
        abilityActive,
        tempPower,
        tempCritical,
        tempShield,
        isVanguard
    ){}
        Attack(AttackingUnit, DefendingUnit){}
        Boost(AttackingUnit, BoostingUnit){}
        Intercept(InterceptingUnit , GCircle){}
}