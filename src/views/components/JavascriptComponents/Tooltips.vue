<template>
  <div class="row">
    <div class="col-lg-6">
      <small class="d-block text-uppercase font-weight-bold mb-3">Tooltips</small>
      <base-button v-b-tooltip.hover.left class="btn-tooltip" size="sm"
                   title="Tooltip on left" type="primary">On left
      </base-button>
      <base-button v-b-tooltip.hover.top class="btn-tooltip" size="sm"
                   title="Tooltip on top" type="primary">On top
      </base-button>
      <base-button v-b-tooltip.hover.bottom class="btn-tooltip" size="sm"
                   title="Tooltip on bottom" type="primary">On bottom
      </base-button>
      <base-button v-b-tooltip.hover.right class="btn-tooltip" size="sm"
                   title="Tooltip on right" type="primary">On right
      </base-button>
    </div>
    <div class="col-lg-6 mt-4 mt-lg-0">
      <small class="d-block text-uppercase font-weight-bold mb-3">Popovers</small>
      <base-button v-b-popover.hover.left="'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.'" size="sm"
                   title="Popover On Left"
                   type="default">On left
      </base-button>

      <base-button v-b-popover.hover.left="'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.'" size="sm"
                   title="Popover On Left"
                   type="default">On left
      </base-button>

      <base-button v-b-popover.hover.top="'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.'" size="sm"
                   title="Popover On Top"
                   type="default">On top
      </base-button>
      <base-button v-b-popover.hover.right="'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.'" size="sm"
                   title="Popover On right"
                   type="default">On right
      </base-button>
      <base-button v-b-popover.hover.bottom="'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.'" size="sm"
                   title="Popover On bottom"
                   type="default">On bottom
      </base-button>
    </div>
  </div>
</template>
<script>
import { VBTooltip } from 'bootstrap-vue/esm/directives/tooltip/tooltip'
import { VBPopover } from 'bootstrap-vue/esm/directives/popover/popover'

export default {
  directives: {
    BTooltip: VBTooltip,
    BPopover: VBPopover,
  }
}
</script>
