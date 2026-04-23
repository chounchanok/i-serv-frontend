<script setup>

</script>
<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Price & Promotion
        </h4>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn variant="tonal" color="secondary">
          โหลดข้อมูล
        </VBtn>
        <VBtn>บันทึก</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="12">

        <!-- 👉 Variants -->
        <VCard class="mb-6">

          <VCardText>
              <VRow>
                <VCol cols="12" md="4">
                  <AppSelect 
                    v-model="select_store" 
                    label="ร้านค้า"
                    placeholder="เลือกร้านค้า" 
                    :items="items" 
                    clearable 
                    clear-icon="tabler-x"
                    @update:modelValue="show_product"
                    @click:clear="show_product" />
                </VCol>

                <VCol cols="12" md="2">
                  <AppDateTimePicker v-model="date_start" label="วันที่" placeholder="เลือกวันที่" />
                </VCol>
                <VCol cols="12" md="6" class="d-flex align-self-center">
                  <v-checkbox v-model="msl" label="MSL"></v-checkbox>
                </VCol>
              </VRow>
            </VCardText>

            <VDivider />


          <VCardText>

            <template v-if="show_p" v-for="(v,i) in rowdata" :key="i">
              <VRow :style="(i%2) == 0 ? '' : 'background-color: #f9f9f9;'">
                <VCol cols="12" md="4">
                  <AppTextField v-model="v.product_name"  placeholder="" type="text" :label="(i+1)+'.สินค้า'"  />
                </VCol>
                
                <VCol cols="12" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.price" placeholder="0" type="number" label="ราคาปกติ" />
                </VCol>
                <VCol cols="12" md="3">
                  <AppSelect :items="['PO', '2For', '2Free1', 'Other']" v-model="v.promotion" placeholder="เลือก"
                    label="Promotion" />
                </VCol>
                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField v-model="v.special_price" placeholder="0" type="number" label="ราคาพิเศษ" />
                </VCol>
                <VCol cols="6" md="3">
                  <DemoDateTimePickerRange v-model="v.daterange" label="ช่วงวันที่" placeholder="ช่วงวันที่"/>
                </VCol>
                
                

                
                
                <VCol cols="6" md="1">
                  <AppTextField placeholder="" type="text" label="ภาพ" />
                </VCol>

                <VCol cols="6" md="1" class="d-flex align-self-end">
                  <AppTextField placeholder="0" type="number" label="คงเหลือ" />
                </VCol>
                <VCol cols="12" md="10">
                  <AppTextField placeholder="" type="text" label="หมายเหตุ" />
                </VCol>
                <VDivider />
                
              </VRow>
            </template>
          </VCardText>
        </VCard>

      </VCol>

    </VRow>

    <div class="show_m d-flex flex-wrap justify-start justify-sm-end gap-y-4 gap-x-6 mb-6">
     
      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn variant="tonal" color="secondary">
          โหลดข้อมูล
        </VBtn>
        <VBtn>บันทึก</VBtn>
      </div>
    </div>
  </div>
</template>










<script>
export default {
    data: () => ({
      isInlinePicker:false,
      daterange:'',
      select_store:'',
      msl:true,
      date_start:new Date(),
      date_end:new Date(),
      rowdata:[{
          product_name:'',
          price:'',
          promotion:'',
          special_price:'',
          daterange:''
        },{
          product_name:'',
          price:'',
          promotion:'',
          special_price:'',
          daterange:''
        },{
          product_name:'',
          price:'',
          promotion:'',
          special_price:'',
          daterange:''
        },{
          product_name:'',
          price:'',
          promotion:'',
          special_price:'',
          daterange:''
        },{
          product_name:'',
          price:'',
          promotion:'',
          special_price:'',
          daterange:''
        },{
          product_name:'',
          price:'',
          promotion:'',
          special_price:'',
          daterange:''
        },{
          product_name:'',
          price:'',
          promotion:'',
          special_price:'',
          daterange:''
        },{
          product_name:'',
          price:'',
          promotion:'',
          special_price:'',
          daterange:''
        }],
      show_p:false,
      items:[
        {
          title: 'เลือก',
          value: '',
        },
        {
          title: 'ร้านค้า 1',
          value: '1',
        },
        {
          title: 'ร้านค้า 2',
          value: '2',
        },
        {
          title: 'ร้านค้า 3',
          value: '3',
        },
      ]
    }),
    methods: {

      show_product(){
        console.log(this.select_store)
        if(this.select_store == null){
          this.select_store = '';
        }
        if(this.select_store == ''){
          this.show_p = false
        }else{
          this.show_p = true
        }
      },
      emitModelValue(){
        console.log(this.daterange)
      }
    },
    mounted(){

        this.$nextTick(function(){
          var flatpickrRange = document.querySelector("#flatpickr-range");

          flatpickrRange.flatpickr({
            mode: "range"
          });
        });

        
    }
}
</script>

<style lang="scss" scoped>
@use "@core/scss/template/mixins" as templateMixins;

/* stylelint-disable no-descending-specificity */
@use "flatpickr/dist/flatpickr.css";
@use "@core/scss/base/mixins";
$heading-color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
$body-color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
$disabled-color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));

.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
.flatpickr-time input.flatpickr-hour {
  font-weight: 400;
}

.flatpickr-calendar {
  @include mixins.elevation(6);

  background-color: rgb(var(--v-theme-surface));
  inline-size: 16.875rem;

  .flatpickr-day:focus {
    border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgba(var(--v-border-color), var(--v-border-opacity));
  }

  .flatpickr-rContainer {
    .flatpickr-weekdays {
      block-size: 1.25rem;
      padding-inline: 0.5625rem;
    }

    .flatpickr-days {
      min-inline-size: 16.875rem;

      .dayContainer {
        justify-content: center !important;
        inline-size: 16.875rem;
        min-inline-size: 16.875rem;
        padding-block: 0.75rem 0.5rem;

        .flatpickr-day {
          block-size: 2.25rem;
          font-size: 0.9375rem;
          line-height: 2.25rem;
          margin-block-start: 0 !important;
          max-inline-size: 2.25rem;
        }
      }
    }
  }

  .flatpickr-day {
    color: $body-color;

    &.today {
      &:not(.selected) {
        border: none !important;
        background: rgba(var(--v-theme-primary), 0.24);
        color: rgb(var(--v-theme-primary));
      }

      &:hover {
        border: none !important;
        background: rgba(var(--v-theme-primary), 0.24);
        color: rgb(var(--v-theme-primary));
      }
    }

    &.selected,
    &.selected:hover {
      border-color: rgb(var(--v-theme-primary));
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));

      @include templateMixins.custom-elevation(var(--v-theme-primary), "sm");
    }

    &.inRange,
    &.inRange:hover {
      border: none;
      background: rgba(var(--v-theme-primary), var(--v-activated-opacity)) !important;
      box-shadow: none !important;
      color: rgb(var(--v-theme-primary));
    }

    &.startRange {
      @include templateMixins.custom-elevation(var(--v-theme-primary), "sm");
    }

    &.endRange {
      @include templateMixins.custom-elevation(var(--v-theme-primary), "sm");
    }

    &.startRange,
    &.endRange,
    &.startRange:hover,
    &.endRange:hover {
      border-color: rgb(var(--v-theme-primary));
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }

    &.selected.startRange + .endRange:not(:nth-child(7n + 1)),
    &.startRange.startRange + .endRange:not(:nth-child(7n + 1)),
    &.endRange.startRange + .endRange:not(:nth-child(7n + 1)) {
      box-shadow: -10px 0 0 rgb(var(--v-theme-primary));
    }

    &.flatpickr-disabled,
    &.prevMonthDay:not(.startRange,.inRange),
    &.nextMonthDay:not(.endRange,.inRange) {
      opacity: var(--v-disabled-opacity);
    }

    &:hover {
      border-color: transparent;
      background: rgba(var(--v-theme-on-surface), 0.06);
    }
  }

  .flatpickr-weekday {
    color: $heading-color;
    font-size: 0.8125rem;
    font-weight: 400;
    inline-size: 2.25rem;
    line-height: 1.25rem;
  }

  .flatpickr-days {
    inline-size: 16.875rem;
  }

  &::after,
  &::before {
    display: none;
  }

  .flatpickr-months {
    .flatpickr-prev-month,
    .flatpickr-next-month {
      color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
      fill: $body-color;

      &:hover {
        color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
      }

      &:hover i,
      &:hover svg {
        fill: $body-color;
      }
    }
  }

  .flatpickr-current-month span.cur-month {
    font-weight: 300;
  }

  &.open {
    // Open calendar above overlay
    z-index: 2401;
  }

  &.hasTime.open {
    .flatpickr-innerContainer + .flatpickr-time {
      block-size: auto;
      border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }

    .flatpickr-time {
      border-block-start: none;
    }

    .flatpickr-hour,
    .flatpickr-minute,
    .flatpickr-am-pm {
      font-size: 0.9375rem;
    }
  }
}

.v-theme--dark .flatpickr-calendar {
  box-shadow: 0 3px 14px 0 rgb(15 20 34 / 38%);
}

// Time picker hover & focus bg color
.flatpickr-time input:hover,
.flatpickr-time .flatpickr-am-pm:hover,
.flatpickr-time input:focus,
.flatpickr-time .flatpickr-am-pm:focus {
  background: transparent;
}

// Time picker
.flatpickr-time {
  .flatpickr-am-pm,
  .flatpickr-time-separator,
  input {
    color: $body-color;
  }

  .numInputWrapper {
    span {
      &.arrowUp {
        &::after {
          border-block-end-color: rgb(var(--v-border-color));
        }
      }

      &.arrowDown {
        &::after {
          border-block-start-color: rgb(var(--v-border-color));
        }
      }
    }
  }
}

//  Added bg color for flatpickr input only as it has default readonly attribute
.flatpickr-input[readonly],
.flatpickr-input ~ .form-control[readonly],
.flatpickr-human-friendly[readonly] {
  background-color: inherit;
}

// week sections
.flatpickr-weekdays {
  margin-block: 0.375rem;
}

// Month and year section
.flatpickr-current-month {
  .flatpickr-monthDropdown-months {
    appearance: none;
  }

  .flatpickr-monthDropdown-months,
  .numInputWrapper {
    padding: 2px;
    border-radius: 4px;
    color: $heading-color;
    font-size: 0.9375rem;
    font-weight: 400;
    line-height: 1.375rem;
    transition: all 0.15s ease-out;

    span {
      display: none;
    }

    .flatpickr-monthDropdown-month {
      background-color: rgb(var(--v-theme-surface));
    }

    .numInput.cur-year {
      font-weight: 400;
    }
  }
}

.flatpickr-day.flatpickr-disabled,
.flatpickr-day.flatpickr-disabled:hover {
  color: $body-color;
}

.flatpickr-months {
  padding-block: 0.75rem;
  padding-inline: 1rem;

  .flatpickr-prev-month,
  .flatpickr-next-month {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 5rem;
    background: rgba(var(--v-theme-on-surface), var(--v-selected-opacity));
    block-size: 1.875rem;
    inline-size: 1.875rem;
    inset-block-start: 15px !important;

    &.flatpickr-disabled {
      display: inline;
      opacity: var(--v-disabled-opacity);
      pointer-events: none;
    }
  }

  .flatpickr-next-month {
    inset-inline-end: 1.05rem !important;
  }

  .flatpickr-prev-month {
    /* stylelint-disable-next-line liberty/use-logical-spec */
    right: 3.65rem;
    left: unset !important;
  }

  .flatpickr-month {
    display: flex;
    align-items: center;
    block-size: 2.125rem;

    .flatpickr-current-month {
      display: flex;
      align-items: center;
      padding: 0;
      block-size: 1.75rem;
      inset-inline-start: 0;
      text-align: start;
    }
  }
}
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }

  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;
    }

    .v-label.custom-input {
      border: none !important;
    }
  }
}
.show_m{
  display: none !important;
}
@media (max-width: 1024px){
    .show_m{
      display: flex !important;
    }
}

</style>
